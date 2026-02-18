'use strict';
/* =========================================================
    Mobile Navigation Module
    Handles:
    - Open / Close mobile menu
    - Accessibility state sync (ARIA)
    - Close on ESC
    - Close on outside click
    - Close on navigation link click
============================================================ */
// DOM elements
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');

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
    Handles all scroll-related UI updates:
    - Header blur effect
    - Scroll-up button visibility
    - Active navigation link highlighting
============================================================ */
// DOM elements
const header = document.getElementById('header');
const copyYear = document.getElementById('year');

const handleScroll = () => {
    const scrollY = window.scrollY;

    // 1. Header Blur Effect
    if (header) {
        scrollY >= 50 ? header.classList.add('blur-header') : header.classList.remove('blur-header');
    }
}
/* Attach a single scroll listener for performance */
window.addEventListener('scroll', handleScroll, { passive: true });

// Dynamic Year
if (copyYear) copyYear.textContent = new Date().getFullYear();