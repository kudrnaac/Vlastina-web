/**
 * Vlastina Web POC - Application Logic (JavaScript)
 * Features: SPA Section Switching, Mobile Nav Toggle, About Gallery,
 * Event Archive Toggle, Lightbox Modal, Hash-based Routing
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- Selectors ---
    const navLinks = document.querySelectorAll(".nav-link, .hero-actions .btn, #nav-logo-btn");
    const sections = document.querySelectorAll(".tab-section");
    const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const btnShowArchive = document.getElementById("btn-show-archive");
    const eventsArchive = document.getElementById("events-archive");
    const lightboxModal = document.getElementById("lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-img");

    // --- SPA Tab Switching Logic ---
    function switchTab(targetId) {
        // Remove active class from all sections & nav links
        sections.forEach(sec => {
            sec.classList.remove("active");
        });
        document.querySelectorAll(".nav-link").forEach(link => {
            link.classList.remove("active");
        });

        // Add active class to target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add("active");
            // Scroll back to top of page on section switch
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        // Highlight matching link in header menu
        const matchingLink = document.querySelector(`.nav-menu a[data-target="${targetId}"]`);
        if (matchingLink) {
            matchingLink.classList.add("active");
        }

        // Close mobile nav menu if open
        if (navMenu.classList.contains("open")) {
            toggleMobileMenu();
        }
    }

    // Bind click events on all navigation triggers
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            // Check target data attribute
            let targetId = link.getAttribute("data-target");
            
            // Handle logo click (always goes to Úvod)
            if (link.id === "nav-logo-btn") {
                targetId = "uvod";
            }

            if (targetId) {
                e.preventDefault();
                // Update URL hash without causing page jump
                history.pushState(null, null, `#${targetId}`);
                switchTab(targetId);
            }
        });
    });

    // --- Hash-based Routing Initializer ---
    function handleInitialRoute() {
        const hash = window.location.hash.substring(1); // Remove '#'
        if (hash) {
            const exists = Array.from(sections).some(sec => sec.id === hash);
            if (exists) {
                switchTab(hash);
                return;
            }
        }
        // Default fall-back to homepage
        switchTab("uvod");
    }

    // Monitor back/forward navigation history changes
    window.addEventListener("popstate", () => {
        const hash = window.location.hash.substring(1) || "uvod";
        switchTab(hash);
    });

    // Run routing check on initial load
    handleInitialRoute();


    // --- Mobile Navigation Menu Toggle ---
    function toggleMobileMenu() {
        mobileNavToggle.classList.toggle("open");
        navMenu.classList.toggle("open");
    }

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener("click", toggleMobileMenu);
    }


    // --- Event Archive Toggle ---
    if (btnShowArchive && eventsArchive) {
        btnShowArchive.addEventListener("click", () => {
            const isHidden = eventsArchive.classList.contains("hidden");
            if (isHidden) {
                eventsArchive.classList.remove("hidden");
                btnShowArchive.textContent = "Skrýt archiv akcí";
            } else {
                eventsArchive.classList.add("hidden");
                btnShowArchive.textContent = "Zobrazit archiv akcí";
            }
        });
    }
});

// --- About Gallery Image Switcher ---
// Placed in global window scope for direct onclick bindings in HTML
window.changeAboutImage = function(clickedThumb) {
    const mainImg = document.getElementById("about-gallery-display");
    if (!mainImg || !clickedThumb) return;

    // Set src of main display to the clicked thumb src
    mainImg.src = clickedThumb.src;

    // Toggle active class in thumbs list
    const thumbs = document.querySelectorAll(".gallery-thumbs .thumb");
    thumbs.forEach(t => t.classList.remove("active"));
    clickedThumb.classList.add("active");
};

// --- Custom Lightbox Modal logic ---
// Placed in global window scope for onclick bindings in HTML
window.openLightbox = function(imageSrc) {
    const modal = document.getElementById("lightbox-modal");
    const modalImg = document.getElementById("lightbox-img");
    
    if (modal && modalImg) {
        modal.classList.remove("hidden");
        modalImg.src = imageSrc;
        // Prevent body scroll when lightbox is open
        document.body.style.overflow = "hidden";
    }
};

window.closeLightbox = function() {
    const modal = document.getElementById("lightbox-modal");
    if (modal) {
        modal.classList.add("hidden");
        // Re-enable body scroll
        document.body.style.overflow = "auto";
    }
};
