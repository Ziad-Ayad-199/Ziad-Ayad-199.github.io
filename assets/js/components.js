/* =========================================================
   components.js — reusable UI components.
   -------------------------------------------------------
   Every page includes the same three scripts and declares
   what it is on the <body> tag:

     <body data-page="home"    data-base="">
     <body data-page="project" data-base="../../" data-project="project-1">

   `data-base` is the relative path back to the site root, so
   the same components work from any folder depth.
   ========================================================= */

(function () {
    'use strict';

    var SITE = window.SITE || {};
    var PROJECTS = window.PROJECTS || [];

    /* ---------- Small helpers ---------- */

    /** Escapes text before it is placed into an HTML string. */
    function esc(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /** Root-relative path -> path that works from the current page. */
    function url(path) {
        if (!path) return '';
        if (/^(https?:)?\/\//.test(path) || path.charAt(0) === '/' || path.indexOf('mailto:') === 0) {
            return path;
        }
        return Components.base + path;
    }

    function byId(id) {
        return document.getElementById(id);
    }

    /** Renders `html` into #id when that placeholder exists on the page. */
    function mount(id, html) {
        var host = byId(id);
        if (host) host.innerHTML = html;
        return host;
    }

    function getProject(slug) {
        for (var i = 0; i < PROJECTS.length; i++) {
            if (PROJECTS[i].slug === slug) return PROJECTS[i];
        }
        return null;
    }

    function projectHref(project) {
        return url('projects/' + project.slug + '/');
    }

    /** Wraps items in a list of pill tags. */
    function tagList(items, extraClass) {
        if (!items || !items.length) return '';
        return '<ul class="tag-list' + (extraClass ? ' ' + extraClass : '') + '">' +
            items.map(function (item) {
                return '<li class="tag">' + esc(item) + '</li>';
            }).join('') + '</ul>';
    }

    /** Social icon row, shared by the header and the footer. */
    function socialLinks(className) {
        var links = (SITE.social || []).map(function (item) {
            var attrs = item.external ? ' target="_blank" rel="noopener"' : '';
            if (item.download) attrs += ' download';
            return '<a href="' + esc(url(item.href)) + '" title="' + esc(item.label) + '"' +
                ' aria-label="' + esc(item.label) + '"' + attrs + '>' +
                '<i class="' + esc(item.icon) + '" aria-hidden="true"></i></a>';
        }).join('');
        return '<div class="' + (className || 'social-links') + '">' + links + '</div>';
    }

    /* ---------- Components ---------- */

    var Components = {
        base: '',

        /** Site header — only used on the homepage. */
        renderHeader: function () {
            return mount('site-header', [
                '<div class="container">',
                '<h1>' + esc(SITE.name) + '</h1>',
                '<p>' + esc(SITE.role) + '</p>',
                socialLinks('social-links'),
                '</div>'
            ].join(''));
        },

        /**
         * Navigation bar — identical markup on every page.
         * @param {string} activeId id of the nav item to highlight.
         */
        renderNav: function (activeId) {
            var items = (SITE.nav || []).map(function (item) {
                var isActive = item.id === activeId;
                return '<li><a href="' + esc(url(item.href)) + '"' +
                    ' data-nav="' + esc(item.id) + '"' +
                    (isActive ? ' class="is-active" aria-current="page"' : '') + '>' +
                    esc(item.label) + '</a></li>';
            }).join('');

            return mount('site-nav', [
                '<div class="container">',
                '<a class="nav-brand" href="' + esc(url('index.html')) + '">',
                '<span class="nav-brand__mark" aria-hidden="true">' + esc(SITE.initials) + '</span>',
                '<span>' + esc(SITE.name) + '</span>',
                '</a>',
                '<button class="nav-toggle" type="button" aria-expanded="false"',
                ' aria-controls="nav-links" aria-label="Toggle navigation menu"><span></span></button>',
                '<ul class="nav-links" id="nav-links">' + items + '</ul>',
                '</div>'
            ].join(''));
        },

        /** Footer — identical on every page. */
        renderFooter: function () {
            return mount('site-footer', [
                '<div class="container">',
                socialLinks('social-links'),
                '<p>&copy; ' + esc(SITE.year) + ' ' + esc(SITE.name) + '. All rights reserved.</p>',
                '</div>'
            ].join(''));
        },

        /** One project card. Used by the homepage grid. */
        projectCard: function (project, index) {
            return [
                '<a class="project-card" href="' + esc(projectHref(project)) + '"',
                ' data-reveal style="--reveal-delay:' + (index * 0.08).toFixed(2) + 's"',
                ' aria-label="' + esc(project.title) + ' — view case study">',
                '<div class="project-card__media">',
                project.category ? '<span class="project-card__badge">' + esc(project.category) + '</span>' : '',
                '<img src="' + esc(url(project.cover)) + '" alt="' + esc(project.title) + ' preview" loading="lazy">',
                '</div>',
                '<div class="project-card__body">',
                '<h3>' + esc(project.title) + '</h3>',
                '<p>' + esc(project.summary) + '</p>',
                tagList((project.technologies || []).slice(0, 3)),
                '<span class="project-card__cta">View case study',
                '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>',
                '</div>',
                '</a>'
            ].join('');
        },

        /** The homepage projects grid. */
        renderProjectsGrid: function () {
            return mount('projects-grid', PROJECTS.map(Components.projectCard).join(''));
        },

        /* ---------- Project detail page pieces ---------- */

        breadcrumb: function (project) {
            return [
                '<nav class="breadcrumb" aria-label="Breadcrumb">',
                '<a href="' + esc(url('index.html')) + '">Home</a>',
                '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>',
                '<a href="' + esc(url('index.html#projects')) + '">Projects</a>',
                '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>',
                '<span aria-current="page">' + esc(project.title) + '</span>',
                '</nav>'
            ].join('');
        },

        heroActions: function (project, ghostSecond) {
            var buttons = [];
            if (project.demo) {
                buttons.push('<a class="btn" href="' + esc(project.demo) + '" target="_blank" rel="noopener">' +
                    '<i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Live Demo</a>');
            }
            if (project.github) {
                buttons.push('<a class="btn' + (ghostSecond && buttons.length ? ' btn-ghost' : '') + '" href="' +
                    esc(project.github) + '" target="_blank" rel="noopener">' +
                    '<i class="fa-brands fa-github" aria-hidden="true"></i> GitHub Repository</a>');
            }
            return buttons;
        },

        hero: function (project) {
            var meta = [
                { label: 'Role', value: project.role },
                { label: 'Timeline', value: project.timeline },
                { label: 'Tools', value: project.tools }
            ].filter(function (entry) { return !!entry.value; });

            var metaHtml = meta.length
                ? '<dl class="project-hero__meta">' + meta.map(function (entry) {
                    return '<div><dt>' + esc(entry.label) + '</dt><dd>' + esc(entry.value) + '</dd></div>';
                }).join('') + '</dl>'
                : '';

            var actions = Components.heroActions(project, true);

            return [
                '<header class="project-hero">',
                '<div class="container">',
                Components.breadcrumb(project),
                project.category ? '<span class="project-hero__eyebrow">' + esc(project.category) +
                    (project.year ? ' &middot; ' + esc(project.year) : '') + '</span>' : '',
                '<h1 class="project-hero__title">' + esc(project.title) + '</h1>',
                project.tagline ? '<p class="project-hero__tagline">' + esc(project.tagline) + '</p>' : '',
                metaHtml,
                actions.length ? '<div class="project-hero__actions">' + actions.join('') + '</div>' : '',
                '</div>',
                '</header>'
            ].join('');
        },

        /** Slider markup. Behaviour is wired up by slider.js. */
        gallery: function (project) {
            var images = project.images || [];
            if (!images.length) return '';

            var slides = images.map(function (image, index) {
                return [
                    '<figure class="slide' + (index === 0 ? ' is-current' : '') + '"',
                    ' role="group" aria-roledescription="slide"',
                    ' aria-label="' + (index + 1) + ' of ' + images.length + '">',
                    '<img src="' + esc(url(image.src)) + '" alt="' + esc(image.alt || project.title) + '"',
                    (index === 0 ? '' : ' loading="lazy"') + ' draggable="false">',
                    image.caption ? '<figcaption>' + esc(image.caption) + '</figcaption>' : '',
                    '</figure>'
                ].join('');
            }).join('');

            var dots = images.map(function (image, index) {
                return '<button type="button" class="slider__dot' + (index === 0 ? ' is-active' : '') + '"' +
                    ' data-slide-to="' + index + '" aria-label="Go to slide ' + (index + 1) + '"></button>';
            }).join('');

            return [
                '<section class="project-gallery" aria-label="Project screenshots">',
                '<div class="container">',
                '<div class="slider' + (images.length < 2 ? ' slider--single' : '') + '" data-slider data-autoplay="6000" data-reveal>',
                '<div class="slider__viewport" aria-roledescription="carousel" aria-label="' + esc(project.title) + ' screenshots">',
                '<div class="slider__track" data-slider-track>' + slides + '</div>',
                '<button class="slider__nav slider__nav--prev" type="button" data-slide="prev" aria-label="Previous slide">',
                '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button>',
                '<button class="slider__nav slider__nav--next" type="button" data-slide="next" aria-label="Next slide">',
                '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>',
                '</div>',
                '<div class="slider__footer">',
                '<div class="slider__dots" role="tablist" aria-label="Choose slide">' + dots + '</div>',
                '<div class="slider__tools">',
                '<p class="slider__count" data-slider-count aria-live="polite">1 / ' + images.length + '</p>',
                '<button class="slider__play" type="button" data-slider-play aria-label="Pause slideshow">',
                '<i class="fa-solid fa-pause" aria-hidden="true"></i></button>',
                '</div>',
                '</div>',
                '<div class="slider__progress"><span data-slider-progress></span></div>',
                '</div>',
                '</div>',
                '</section>'
            ].join('');
        },

        body: function (project) {
            var paragraphs = (project.description || []).map(function (text) {
                return '<p>' + esc(text) + '</p>';
            }).join('');

            var cards = [];

            if (project.technologies && project.technologies.length) {
                cards.push([
                    '<div class="info-card" data-reveal>',
                    '<h2 class="info-card__title"><i class="fa-solid fa-layer-group" aria-hidden="true"></i> Technologies Used</h2>',
                    tagList(project.technologies),
                    '</div>'
                ].join(''));
            }

            var actions = Components.heroActions(project, false).map(function (button) {
                return button.replace('class="btn"', 'class="btn btn-secondary"');
            });

            if (actions.length) {
                cards.push([
                    '<div class="info-card" data-reveal style="--reveal-delay:.08s">',
                    '<h2 class="info-card__title"><i class="fa-solid fa-link" aria-hidden="true"></i> Project Links</h2>',
                    '<div class="link-stack">' + actions.join('') + '</div>',
                    '</div>'
                ].join(''));
            }

            return [
                '<div class="project-body">',
                '<div class="project-prose" data-reveal>',
                '<h2>About this project</h2>',
                paragraphs,
                '</div>',
                cards.length ? '<aside class="project-aside">' + cards.join('') + '</aside>' : '',
                '</div>'
            ].join('');
        },

        features: function (project) {
            if (!project.features || !project.features.length) return '';
            var items = project.features.map(function (feature, index) {
                return [
                    '<li class="feature-item" data-reveal style="--reveal-delay:' + (index * 0.06).toFixed(2) + 's">',
                    '<i class="fa-solid fa-circle-check" aria-hidden="true"></i>',
                    '<p>' + esc(feature) + '</p>',
                    '</li>'
                ].join('');
            }).join('');

            return [
                '<section class="project-features">',
                '<h2 data-reveal>Features</h2>',
                '<ul class="feature-grid">' + items + '</ul>',
                '</section>'
            ].join('');
        },

        /** Previous / next project links, wrapping around the list. */
        pager: function (project) {
            if (PROJECTS.length < 2) return '';
            var index = PROJECTS.indexOf(project);
            var previous = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
            var next = PROJECTS[(index + 1) % PROJECTS.length];

            function link(target, direction) {
                var isNext = direction === 'next';
                return [
                    '<a class="pager-link pager-link--' + direction + '" href="' + esc(projectHref(target)) + '">',
                    '<span class="pager-link__label">',
                    isNext ? '' : '<i class="fa-solid fa-arrow-left" aria-hidden="true"></i>',
                    isNext ? 'Next project' : 'Previous project',
                    isNext ? '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i>' : '',
                    '</span>',
                    '<span class="pager-link__title">' + esc(target.title) + '</span>',
                    '</a>'
                ].join('');
            }

            return '<nav class="project-pager" aria-label="More projects">' +
                link(previous, 'prev') + link(next, 'next') + '</nav>';
        },

        /** Assembles a full case-study page from a project slug. */
        renderProjectDetail: function (slug) {
            var host = byId('project-detail');
            if (!host) return null;

            var project = getProject(slug);
            if (!project) {
                host.innerHTML = [
                    '<section class="section"><div class="container">',
                    '<h2>Project not found</h2>',
                    '<p style="text-align:center">',
                    '<a class="btn" href="' + esc(url('index.html#projects')) + '">Back to all projects</a></p>',
                    '</div></section>'
                ].join('');
                return null;
            }

            document.title = project.title + ' | ' + SITE.name;

            host.innerHTML = [
                Components.hero(project),
                Components.gallery(project),
                '<div class="container">',
                Components.body(project),
                Components.features(project),
                Components.pager(project),
                '</div>'
            ].join('');

            return project;
        },

        /** Boots whichever page we are on. Called by main.js. */
        init: function () {
            var body = document.body;
            Components.base = body.getAttribute('data-base') || '';

            var page = body.getAttribute('data-page');
            var isProject = page === 'project';

            Components.renderHeader();
            Components.renderNav(isProject ? 'projects' : null);
            Components.renderFooter();

            if (isProject) {
                Components.renderProjectDetail(body.getAttribute('data-project'));
            } else {
                Components.renderProjectsGrid();
            }
        }
    };

    window.Components = Components;
})();
