// Toggle menu visibility on mobile
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

mobileMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// Dropdown functionality
const dropdowns = document.querySelectorAll(".dropdown > a");

dropdowns.forEach(dropdown => {
    dropdown.addEventListener("click", (e) => {
        // Prevent default action only if clicking the dropdown link
        if (e.target.tagName === "A") {
            e.preventDefault();
        }

        // Prevent the click from propagating and closing the dropdown
        e.stopPropagation();

        // Find the closest dropdown container and toggle the active class
        const parentDropdown = e.target.closest(".dropdown");

        // Close all dropdowns before opening the clicked one
        dropdowns.forEach(d => {
            if (d !== parentDropdown.querySelector('a')) {
                d.parentElement.classList.remove("active");
            }
        });

        // Toggle the clicked dropdown's active class
        parentDropdown.classList.toggle("active");
    });
});

// Close all dropdowns if clicked outside
document.addEventListener("click", (e) => {
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
            dropdown.parentElement.classList.remove("active");
        }
    });
});
