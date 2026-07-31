/* =========================================================
   slider.js — accessible image carousel.
   -------------------------------------------------------
   Any element with [data-slider] is upgraded automatically.
   Supports: prev/next buttons, dots, keyboard arrows, mouse
   drag, touch swipe, looping and optional autoplay
   (data-autoplay="6000"). Autoplay is skipped entirely when
   the visitor prefers reduced motion.
   ========================================================= */

(function () {
    'use strict';

    var SWIPE_RATIO = 0.15;   /* fraction of the width that counts as a swipe */
    var SWIPE_MIN = 50;       /* ...but never less than this many pixels */

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function Slider(root) {
        this.root = root;
        this.viewport = root.querySelector('.slider__viewport');
        this.track = root.querySelector('[data-slider-track]');
        this.slides = Array.prototype.slice.call(root.querySelectorAll('.slide'));
        this.dots = Array.prototype.slice.call(root.querySelectorAll('[data-slide-to]'));
        this.counter = root.querySelector('[data-slider-count]');
        this.progress = root.querySelector('[data-slider-progress]');
        this.playButton = root.querySelector('[data-slider-play]');

        this.index = 0;
        this.width = 0;
        this.dragStartX = 0;
        this.dragDelta = 0;
        this.isDragging = false;
        this.pointerId = null;
        this.timer = null;

        var delay = parseInt(root.getAttribute('data-autoplay'), 10);
        this.delay = delay > 0 ? delay : 0;
        this.autoplayEnabled = this.delay > 0 && this.slides.length > 1 && !prefersReducedMotion();
        this.isPlaying = false;

        if (this.slides.length) this.init();
    }

    Slider.prototype.init = function () {
        var self = this;

        this.measure();
        this.update(0, true);

        /* Arrows */
        this.root.querySelectorAll('[data-slide]').forEach(function (button) {
            button.addEventListener('click', function () {
                self.stop();
                self.go(button.getAttribute('data-slide') === 'next' ? self.index + 1 : self.index - 1);
            });
        });

        /* Dots */
        this.dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                self.stop();
                self.go(parseInt(dot.getAttribute('data-slide-to'), 10));
            });
        });

        /* Play / pause */
        if (this.playButton) {
            if (!this.autoplayEnabled) {
                this.playButton.hidden = true;
            } else {
                this.playButton.addEventListener('click', function () {
                    if (self.isPlaying) self.stop(); else self.start();
                });
            }
        }

        /* Keyboard */
        this.root.addEventListener('keydown', function (event) {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            self.stop();
            self.go(event.key === 'ArrowRight' ? self.index + 1 : self.index - 1);
        });

        /* Drag / swipe */
        if (this.viewport && this.slides.length > 1 && window.PointerEvent) {
            this.viewport.addEventListener('pointerdown', this.onPointerDown.bind(this));
            this.viewport.addEventListener('pointermove', this.onPointerMove.bind(this));
            this.viewport.addEventListener('pointerup', this.onPointerUp.bind(this));
            this.viewport.addEventListener('pointercancel', this.onPointerUp.bind(this));
            /* Stop a swipe from also triggering the caption link / drag ghost */
            this.viewport.addEventListener('dragstart', function (event) { event.preventDefault(); });
        }

        /* Pause while hovered or focused, and when the tab is hidden */
        if (this.autoplayEnabled) {
            this.root.addEventListener('mouseenter', function () { self.pause(); });
            this.root.addEventListener('mouseleave', function () { self.resume(); });
            this.root.addEventListener('focusin', function () { self.pause(); });
            this.root.addEventListener('focusout', function () { self.resume(); });
            document.addEventListener('visibilitychange', function () {
                if (document.hidden) self.pause(); else self.resume();
            });
            this.start();
        }

        window.addEventListener('resize', function () {
            self.measure();
            self.setOffset(-self.index * self.width, false);
        });
    };

    Slider.prototype.measure = function () {
        this.width = this.viewport ? this.viewport.clientWidth : 0;
    };

    Slider.prototype.setOffset = function (pixels, animate) {
        if (!this.track) return;
        this.track.classList.toggle('is-dragging', !animate);
        this.track.style.transform = 'translate3d(' + pixels + 'px, 0, 0)';
    };

    /** Moves to `target`, wrapping around at both ends. */
    Slider.prototype.go = function (target) {
        var count = this.slides.length;
        this.update(((target % count) + count) % count);
    };

    Slider.prototype.update = function (index, immediate) {
        this.index = index;
        this.measure();
        this.setOffset(-index * this.width, !immediate);

        this.slides.forEach(function (slide, i) {
            slide.classList.toggle('is-current', i === index);
            slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        });

        this.dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === index);
            dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });

        if (this.counter) {
            this.counter.textContent = (index + 1) + ' / ' + this.slides.length;
        }

        if (this.isPlaying) this.restartTimer();
    };

    /* ---------- Pointer handling ---------- */

    Slider.prototype.onPointerDown = function (event) {
        if (event.button !== 0 && event.pointerType === 'mouse') return;
        /* Never capture the pointer from the arrows: capturing would re-target
           the follow-up `click` to the viewport and the buttons would go dead. */
        if (event.target.closest && event.target.closest('button, a')) return;
        this.isDragging = true;
        this.pointerId = event.pointerId;
        this.dragStartX = event.clientX;
        this.dragDelta = 0;
        this.measure();
        this.pause();
        this.viewport.classList.add('is-dragging');
        if (this.viewport.setPointerCapture) {
            this.viewport.setPointerCapture(event.pointerId);
        }
    };

    Slider.prototype.onPointerMove = function (event) {
        if (!this.isDragging || event.pointerId !== this.pointerId) return;
        this.dragDelta = event.clientX - this.dragStartX;
        this.setOffset(-this.index * this.width + this.dragDelta, false);
    };

    Slider.prototype.onPointerUp = function (event) {
        if (!this.isDragging || event.pointerId !== this.pointerId) return;
        this.isDragging = false;
        this.pointerId = null;
        this.viewport.classList.remove('is-dragging');

        var threshold = Math.max(this.width * SWIPE_RATIO, SWIPE_MIN);
        if (this.dragDelta <= -threshold) {
            this.stop();
            this.go(this.index + 1);
        } else if (this.dragDelta >= threshold) {
            this.stop();
            this.go(this.index - 1);
        } else {
            this.update(this.index);
            this.resume();
        }
        this.dragDelta = 0;
    };

    /* ---------- Autoplay ---------- */

    Slider.prototype.start = function () {
        if (!this.autoplayEnabled) return;
        this.isPlaying = true;
        this.setPlayIcon('pause', 'Pause slideshow');
        this.restartTimer();
    };

    /** Stops autoplay for good (a deliberate user interaction). */
    Slider.prototype.stop = function () {
        this.isPlaying = false;
        this.clearTimer();
        this.setProgress(0);
        this.setPlayIcon('play', 'Play slideshow');
    };

    /** Temporarily suspends autoplay (hover / focus / hidden tab). */
    Slider.prototype.pause = function () {
        if (!this.isPlaying) return;
        this.clearTimer();
        this.setProgress(0);
    };

    Slider.prototype.resume = function () {
        if (!this.isPlaying || this.isDragging || document.hidden) return;
        this.restartTimer();
    };

    Slider.prototype.clearTimer = function () {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    };

    Slider.prototype.restartTimer = function () {
        var self = this;
        this.clearTimer();
        this.setProgress(0);
        /* Next frame, so the reset is painted before the fill animates. */
        requestAnimationFrame(function () {
            requestAnimationFrame(function () { self.setProgress(1); });
        });
        this.timer = setTimeout(function () {
            self.go(self.index + 1);
        }, this.delay);
    };

    Slider.prototype.setProgress = function (value) {
        if (!this.progress) return;
        this.progress.style.transition = value ? 'width ' + this.delay + 'ms linear' : 'none';
        this.progress.style.width = value ? '100%' : '0%';
    };

    Slider.prototype.setPlayIcon = function (name, label) {
        if (!this.playButton) return;
        var icon = this.playButton.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-' + name;
        this.playButton.setAttribute('aria-label', label);
    };

    /** Upgrades every [data-slider] inside `scope`. */
    window.initSliders = function (scope) {
        var root = scope || document;
        Array.prototype.forEach.call(root.querySelectorAll('[data-slider]'), function (element) {
            if (!element.dataset.sliderReady) {
                element.dataset.sliderReady = 'true';
                new Slider(element);
            }
        });
    };
})();
