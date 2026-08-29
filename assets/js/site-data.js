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
            cover: 'assets/images/Screenshot 2026-08-29 141608.png',
            role: 'Data Analyst',
            timeline: '2026',
            tools: 'Power BI, Power Query, DAX',
            images: [
                {
                    src: 'assets/images/Screenshot 2026-08-29 141608.png',
                    alt: 'Power BI executive dashboard showing overall sales, revenue, customers, products, and business performance.',
                    caption: 'Executive overview of business performance, highlighting key KPIs, revenue trends, product performance, sales channels, and geographic distribution.'
                },
                {
                    src: 'assets/images/Screenshot 2026-08-29 141621.png',
                    alt: 'Power BI sales analysis dashboard showing revenue trends, orders, sales channels, and daily performance.',
                    caption: 'Sales performance analysis covering revenue trends, order patterns, average order value, sales channels, and opportunities over time.'
                },
               {
                    src: 'assets/images/Screenshot 2026-08-29 141632.png',
                    alt: 'Power BI product analysis dashboard comparing revenue, product performance, quantity sold, and product contribution.',
                    caption: 'Product performance analysis identifying top and bottom products, category contribution, revenue distribution, and average selling prices.'
                },
               {
                    src: 'assets/images/Screenshot 2026-08-29 141644.png',
                    alt: 'Power BI customer analysis dashboard showing customer revenue, returning customers, locations, and transaction methods.',
                    caption: 'Customer analysis exploring purchasing behavior, customer revenue, returning customers, geographic distribution, and payment methods.'
                },
               {
                    src: 'assets/images/Screenshot 2026-08-29 141659.png',
                    alt: 'Power BI employee performance dashboard showing payroll, salaries, job roles, experience, and employee demographics.',
                    caption: 'Employee performance overview analyzing payroll, salary distribution, job roles, experience levels, seniority, and workforce demographics.'
                },
               {
                    src: 'assets/images/Screenshot 2026-08-29 141713.png',
                    alt: 'Power BI geographic analysis dashboard showing revenue, customers, and orders across five countries.',
                    caption: 'Geographic analysis comparing revenue, customers, orders, and average order value across Egypt, Saudi Arabia, Iraq, Syria, and the United Arab Emirates.'
                },
               {
                    src: 'assets/images/Screenshot 2026-08-29 141727.png',
                    alt: 'Power BI detailed report showing transaction-level sales data with interactive filters and key performance indicators.',
                    caption: 'Detailed transaction-level view with interactive filters for date, country, category, product, payment method, and sales channel.'
                },
                {
                    src: 'assets/images/Screenshot 2026-08-29 141754.png',
                    alt: 'Power BI data model showing relationships between orders, customers, products, employees, countries, dates, and departments.',
                    caption: 'Structured Power BI data model connecting sales transactions with customer, product, employee, geographic, date, and department dimensions.'
                }
            ],
            description: [
                'This report provides a comprehensive view of business performance, analyzing sales, products, customers, employees, and geographic performance across five countries. It explores how revenue is distributed across products and categories, which sales channels and countries perform best, how customers behave, and how employee performance and payroll contribute to the overall business.',
                'The raw data was cleaned, transformed, and prepared for analysis before being modeled in Power BI. A star schema connects the Orders fact table with dedicated dimensions for date, country, product, customers, employees, departments, and money transfer types, creating a structured model for efficient reporting and analysis.',
                'Measures written in DAX calculate key business metrics including total revenue, total orders, average order value, customer revenue, product contribution, revenue percentage, employee payroll, and geographic performance. Interactive filters and navigation allow users to move from the executive overview into detailed sales, product, customer, employee, geographic, and transaction-level analysis.',
                'The headline findings: the business generated approximately $374K in revenue from 3,472 orders, with electronics contributing 50.4% of total revenue. Egypt generated the highest revenue at approximately $123.5K, while the Dealer channel recorded the highest number of opportunities. At the product level, HDD and mobile were the top revenue-generating products, contributing approximately $27K and $25K, respectively.'
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
