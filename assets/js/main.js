/* =========================================================
   main.js — page behaviour.
   -------------------------------------------------------
   Boots the shared components, then wires up:
     - smooth page transitions between pages
     - fade/slide reveal of sections on scroll
     - the mobile navigation toggle
     - offset-aware smooth scrolling for in-page links
     - scroll-spy highlighting of the active nav item
     - the image sliders
   ========================================================= */

(function () {
    'use strict';

    var TRANSITION_MS = 280;

    function reducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function navHeight() {
        var nav = document.getElementById('site-nav');
        return nav ? nav.offsetHeight : 0;
    }

    /* Treats "/", "/index.html" and "/projects/project-1/" consistently. */
    function normalizePath(pathname) {
        return decodeURIComponent(pathname || '').replace(/index\.html$/, '');
    }

    function isSamePage(link) {
        return link.host === window.location.host &&
            normalizePath(link.pathname) === normalizePath(window.location.pathname);
    }

    /* ---------- Smooth scrolling with a sticky-nav offset ---------- */

    /* Keeps the keyboard in step with the scroll (needed by the skip link). */
    function focusTarget(element) {
        if (!element) return;
        if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
    }

    function scrollToHash(hash) {
        var target = hash && document.querySelector(hash);
        if (!target) return false;

        var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight() - 16;
        window.scrollTo({
            top: Math.max(top, 0),
            behavior: reducedMotion() ? 'auto' : 'smooth'
        });
        return true;
    }

    /* ---------- Page transitions ---------- */

    function shouldIntercept(link, event) {
        if (event.defaultPrevented || event.button !== 0) return false;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
        if (link.target && link.target !== '_self') return false;
        if (link.hasAttribute('download')) return false;
        if (link.host !== window.location.host) return false;
        if (!/^https?:$/.test(link.protocol)) return false;
        /* PDFs and other assets should open normally. */
        if (/\.(pdf|png|jpe?g|svg|zip|csv|xlsx?)$/i.test(link.pathname)) return false;
        return true;
    }

    function initPageTransitions() {
        document.addEventListener('click', function (event) {
            var link = event.target.closest && event.target.closest('a[href]');
            if (!link || !shouldIntercept(link, event)) return;

            /* Same page: scroll instead of reloading. */
            if (isSamePage(link)) {
                event.preventDefault();
                closeMobileNav();

                if (!link.hash) {
                    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
                    return;
                }

                if (scrollToHash(link.hash)) {
                    history.pushState(null, '', link.hash);
                    focusTarget(document.querySelector(link.hash));
                }
                return;
            }

            /* Different page: fade out, then go. */
            event.preventDefault();
            closeMobileNav();

            if (reducedMotion()) {
                window.location.href = link.href;
                return;
            }

            document.body.classList.add('is-leaving');
            window.setTimeout(function () {
                window.location.href = link.href;
            }, TRANSITION_MS);
        });

        /* Coming back via the browser's back button must not leave the
           page stuck in its faded-out state (bfcache restore). */
        window.addEventListener('pageshow', function () {
            document.body.classList.remove('is-leaving');
        });
    }

    /* ---------- Scroll reveal ---------- */

    function initScrollReveal() {
        var elements = document.querySelectorAll('[data-reveal]');
        if (!elements.length) return;

        if (!('IntersectionObserver' in window) || reducedMotion()) {
            Array.prototype.forEach.call(elements, function (element) {
                element.classList.add('is-revealed');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        Array.prototype.forEach.call(elements, function (element) {
            observer.observe(element);
        });
    }

    /* ---------- Navigation ---------- */

    function closeMobileNav() {
        var toggle = document.querySelector('.nav-toggle');
        var links = document.getElementById('nav-links');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        if (links) links.classList.remove('is-open');
    }

    function initNav() {
        var nav = document.getElementById('site-nav');
        var toggle = document.querySelector('.nav-toggle');
        var links = document.getElementById('nav-links');

        if (toggle && links) {
            toggle.addEventListener('click', function () {
                var isOpen = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', String(!isOpen));
                links.classList.toggle('is-open', !isOpen);
            });

            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') closeMobileNav();
            });
        }

        /* Subtle shadow once the nav sticks to the top. */
        if (nav) {
            var onScroll = function () {
                nav.classList.toggle('is-stuck', nav.getBoundingClientRect().top <= 0);
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }
    }

    /* ---------- Scroll spy (homepage) ---------- */

    function initScrollSpy() {
        if (document.body.getAttribute('data-page') !== 'home') return;
        if (!('IntersectionObserver' in window)) return;

        var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
        if (!sections.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                document.querySelectorAll('.nav-links a').forEach(function (link) {
                    var isActive = link.getAttribute('data-nav') === entry.target.id;
                    link.classList.toggle('is-active', isActive);
                    if (isActive) {
                        link.setAttribute('aria-current', 'true');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

        sections.forEach(function (section) { observer.observe(section); });
    }

    /* ---------- Boot ---------- */

    function init() {
        if (window.Components) window.Components.init();

        initNav();
        initPageTransitions();
        initScrollReveal();
        initScrollSpy();
        if (window.initSliders) window.initSliders();

        /* Deep links such as /projects/project-1/#features need the offset
           applied once the components have rendered. */
        if (window.location.hash) {
            window.setTimeout(function () { scrollToHash(window.location.hash); }, 60);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
