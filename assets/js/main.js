'use strict';
/* =========================================================
    DOM elements
============================================================ */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.getElementById('header');
const scrollUp = document.getElementById('scroll-up');
const sections = document.querySelectorAll('section[id]');

/* =========================================================
    Mobile Navigation Module
    Handles:
    - Open / Close mobile menu
    - Accessibility state sync (ARIA)
    - Close on ESC
    - Close on outside click
    - Close on navigation link click
============================================================ */
// Guard clause – prevent execution if required elements are missing
if (navMenu && navToggle && navClose) {
    // Constants
    const ACTIVE_CLASS = 'nav__menu--active';
    const NO_SCROLL_CLASS = 'no-scroll';

    // State Check if menu is currently open
    const isMenuOpen = () => navMenu.classList.contains(ACTIVE_CLASS);

    // Open menu: add classes and accessibility attributes
    const openMenu = () => {
        navMenu.classList.add(ACTIVE_CLASS);
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add(NO_SCROLL_CLASS);
    };

    // Close menu: remove classes and reset accessibility attributes
    const closeMenu = () => {
        navMenu.classList.remove(ACTIVE_CLASS);
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove(NO_SCROLL_CLASS);
    };

    // Toggle menu on hamburger button click
    const toggleMenu = () => isMenuOpen() ? closeMenu() : openMenu();;

    /* ========= Event Listeners ========= */
    // Toggle menu on hamburger button click
    navToggle.addEventListener('click', toggleMenu);

    // Close menu on "X" button click
    navClose?.addEventListener('click', closeMenu);

    // Close menu when clicking any navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isMenuOpen()) {
            closeMenu();
        }
    });

    // Close when clicking outside the menu
    document.addEventListener('click', (event) => {
        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedToggle = navToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle && isMenuOpen()) {
            closeMenu();
        }
    });
};

/* =========================================================
 * Map section IDs to their corresponding navigation links.
 * This avoids querying the DOM on every scroll event
 * and gives us O(1) access when determining the active link.
============================================================ */
const navLinkMap = {};

navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Only process internal anchor links (e.g. #about, #services)
    // Optional chaining prevents runtime errors if href is null
    if (href?.startsWith('#')) {
        navLinkMap[href.replace('#', '')] = link;
    }
});

/* =========================================================
    Handles all scroll-related UI updates:
    - Header blur effect
    - Scroll-up button visibility
    - Active navigation link highlighting
============================================================ */
const handleScroll = () => {
    // Cache header height once per scroll execution
    const scrollY = window.scrollY;
    // Used to offset active section detection
    const headerHeight = header?.offsetHeight || 0;

    /**
    * UI state: Header blur effect after scrolling past threshold
    */
    if (header) {
        header.classList.toggle('blur-header', scrollY >= 50);
    }
    /**
     * UI state: Show scroll-to-top button
     */
    if (scrollUp) {
        scrollUp.classList.toggle('show-scroll', scrollY >= 50);
    }

    /**
    * Determine which section is currently in view
    * and activate corresponding nav link
    */
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        // Adjust top offset by header height to account for fixed header
        const sectionTop = section.offsetTop - headerHeight;
        const sectionId = section.id;

        const navLink = navLinkMap[sectionId];

        // Skip if section has no corresponding nav link
        if (!navLink) return;

        const isActive =
            scrollY > sectionTop &&
            scrollY <= sectionTop + sectionHeight;

        navLink.classList.toggle('active-link', isActive);
    });
};
/* Attach a single scroll listener for performance */
window.addEventListener('scroll', handleScroll, { passive: true });

/* =========================================================
    Handle Dynamic Year
============================================================ */
const copyYear = document.getElementById('year');
if (copyYear) copyYear.textContent = new Date().getFullYear();