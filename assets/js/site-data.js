/* =========================================================
   site-data.js — the single source of truth for the site.
   -------------------------------------------------------
   Everything the pages render (nav, footer, project cards and
   the project case-study pages) is generated from the objects
   below, so content lives in ONE place only.

   💡 TO ADD / EDIT A PROJECT: edit the PROJECTS array below.
      - `slug` must match the folder name under /projects/
        (e.g. slug 'project-1'  ->  /projects/project-1/)
      - image paths are written from the SITE ROOT and are
        rewritten automatically for nested pages.
      - Any optional field (github, demo, features, ...) can be
        left out or set to null and its section is simply hidden.
   ========================================================= */

(function () {
    'use strict';

    /* ---------- Global site configuration ---------- */
    window.SITE = {
        name: 'Ziad Ayad',
        initials: 'ZA',
        role: 'Data Analyst | Power BI Developer',
        year: 2026,
        social: [
            { label: 'LinkedIn', icon: 'fa-brands fa-linkedin', href: 'https://www.linkedin.com/in/ziad-ayad-b94305297/', external: true },
            { label: 'GitHub', icon: 'fa-brands fa-github', href: 'https://github.com/Ziad-Ayad-199', external: true },
            { label: 'Download CV', icon: 'fa-solid fa-file-arrow-down', href: 'assets/Ziad_Ayad_Data_Analyst.pdf', download: true }
        ],
        /* One nav definition used by every page on the site. */
        nav: [
            { id: 'about', label: 'About', href: 'index.html#about' },
            { id: 'projects', label: 'Projects', href: 'index.html#projects' },
            { id: 'skills', label: 'Skills', href: 'index.html#skills' },
            { id: 'contact', label: 'Contact', href: 'index.html#contact' }
        ]
    };

    /* ---------- Reusable placeholder screenshots ---------- */
    var SHOT = {
        overview: 'assets/images/placeholders/dashboard-overview.svg',
        detail: 'assets/images/placeholders/dashboard-detail.svg',
        model: 'assets/images/placeholders/data-model.svg'
    };

    /* ---------- Projects ---------- */
    window.PROJECTS = [
        {
            slug: 'project-1',
            title: 'Business Insight',
            category: 'Power BI Dashboard',
            year: '2026',
            tagline: 'An interactive business analytics dashboard transforming sales data into actionable insights on revenue, product performance, customer behavior, and sales trends to support data-driven decision-making.',
            summary: 'A multi-page Power BI dashboard transforming raw sales data into actionable insights on revenue performance, product trends, customer behavior, and overall business performance.',
            cover: 'assets/images/US-Elec.png',
            role: 'Data Analyst',
            timeline: '2026',
            tools: 'Power BI, Power Query, DAX',
            images: [
                {
                    src: 'assets/images/US-Elec.png',
                    alt: 'US Electricity Overview dashboard showing KPIs, top states by generation, energy mix and CO2 emissions by state',
                    caption: 'Overview page — headline KPIs, top generating states, renewable vs non-renewable mix and a CO2 emissions map.'
                },
                {
                    src: SHOT.detail,
                    alt: 'Placeholder for a state level drill-through page',
                    caption: 'Replace with your state-level drill-through page.'
                },
                {
                    src: SHOT.model,
                    alt: 'Placeholder for the star schema data model view',
                    caption: 'Replace with the model view showing your star schema.'
                }
            ],
            description: [
                'This report explores how electricity generation in the United States changed between 2001 and 2023 — how much power was produced, how much of it came from renewable sources, and what that meant for CO2 emissions at the state level.',
                'The raw data was cleaned and reshaped in Power Query: inconsistent state names were standardised, energy-source categories were grouped into renewable and non-renewable buckets, and yearly fact tables were unpivoted into a tidy structure. A star schema with dedicated date, state and energy-source dimensions keeps the model fast and the DAX simple.',
                'Measures written in DAX calculate total generation, renewable share, year-over-year growth and emissions intensity. Slicers for year, state and energy source let a reader move from the national picture down to a single state without leaving the page.',
                'The headline finding: total generation grew from roughly 8.8M to 12.3M GWh over the period, while the renewable share climbed to about 16% — with Washington, California and Texas contributing the largest renewable volumes.'
            ],
            technologies: ['Power BI', 'Power Query (M)', 'DAX', 'Star Schema', 'Excel', 'Data Cleaning'],
            features: [
                'Headline KPI cards for total generation, renewable energy, renewable share and CO2 emissions.',
                'Cross-filtering slicers for year, state and energy source across every visual.',
                'Top-10 states ranking and a renewable vs non-renewable mix breakdown.',
                'Choropleth map of CO2 emissions by state for instant geographic comparison.',
                'A 2001–2023 trend line with data labels highlighting long-term growth.',
                'Star-schema data model built for fast filtering and reusable DAX measures.'
            ],
            github: 'https://github.com/Ziad-Ayad-199',
            demo: null
        },

        /* 💡 Projects 2–4 are scaffolds. Swap the copy and images
           for your real work — the pages update automatically. */
        {
            slug: 'project-2',
            title: 'Project Title Two',
            category: 'Power BI Dashboard',
            year: '2025',
            tagline: 'One sentence that explains what this project set out to answer and who it was for.',
            summary: 'A brief, one or two-sentence description of your project, what it does, and the tools you used.',
            cover: SHOT.overview,
            role: 'Data Analyst',
            timeline: '2025',
            tools: 'Power BI, SQL',
            images: [
                { src: SHOT.overview, alt: 'Project two overview screenshot', caption: 'Overview page — swap this for your own screenshot.' },
                { src: SHOT.detail, alt: 'Project two detail screenshot', caption: 'Detail page — swap this for your own screenshot.' }
            ],
            description: [
                'Describe the business question behind the project and why it mattered. Two or three sentences is plenty.',
                'Explain where the data came from, how you cleaned and modelled it, and any interesting decisions you had to make along the way.',
                'Finish with the outcome: what the dashboard revealed and what someone could do differently because of it.'
            ],
            technologies: ['Power BI', 'SQL', 'Power Query (M)', 'DAX'],
            features: [
                'Describe a key feature of the report here.',
                'Add another highlight — a calculation, an interaction, a design choice.',
                'Keep each one short and concrete.'
            ],
            github: 'https://github.com/Ziad-Ayad-199',
            demo: null
        },
        {
            slug: 'project-3',
            title: 'Project Title Three',
            category: 'Data Analysis',
            year: '2025',
            tagline: 'One sentence that explains what this project set out to answer and who it was for.',
            summary: 'A brief, one or two-sentence description of your project, what it does, and the tools you used.',
            cover: SHOT.detail,
            role: 'Data Analyst',
            timeline: '2025',
            tools: 'Excel, SQL',
            images: [
                { src: SHOT.detail, alt: 'Project three overview screenshot', caption: 'Overview page — swap this for your own screenshot.' },
                { src: SHOT.model, alt: 'Project three data model screenshot', caption: 'Data model — swap this for your own screenshot.' }
            ],
            description: [
                'Describe the business question behind the project and why it mattered.',
                'Explain where the data came from, how you cleaned and modelled it, and any interesting decisions you had to make.',
                'Finish with the outcome and what it enabled.'
            ],
            technologies: ['Advanced Excel', 'SQL', 'Google Sheets'],
            features: [
                'Describe a key feature of the analysis here.',
                'Add another highlight.',
                'Keep each one short and concrete.'
            ],
            github: 'https://github.com/Ziad-Ayad-199',
            demo: null
        },
        {
            slug: 'project-4',
            title: 'Project Title Four',
            category: 'Data Visualization',
            year: '2025',
            tagline: 'One sentence that explains what this project set out to answer and who it was for.',
            summary: 'A brief, one or two-sentence description of your project, what it does, and the tools you used.',
            cover: SHOT.model,
            role: 'Data Analyst',
            timeline: '2025',
            tools: 'Tableau, Excel',
            images: [
                { src: SHOT.model, alt: 'Project four overview screenshot', caption: 'Overview page — swap this for your own screenshot.' },
                { src: SHOT.overview, alt: 'Project four detail screenshot', caption: 'Detail page — swap this for your own screenshot.' }
            ],
            description: [
                'Describe the business question behind the project and why it mattered.',
                'Explain where the data came from, how you cleaned and modelled it, and any interesting decisions you had to make.',
                'Finish with the outcome and what it enabled.'
            ],
            technologies: ['Tableau', 'Excel Dashboards', 'ETL Processes'],
            features: [
                'Describe a key feature of the dashboard here.',
                'Add another highlight.',
                'Keep each one short and concrete.'
            ],
            github: 'https://github.com/Ziad-Ayad-199',
            demo: null
        }
    ];
})();
