document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle functionality for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const nav = document.querySelector('nav');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Logo click to go home
    const logoHome = document.getElementById('logo-home');
    logoHome.addEventListener('click', function() {
        // Hide all sections
        document.querySelectorAll('.project-section').forEach(section => section.classList.remove('active'));
        // Show home section
        document.getElementById('home').classList.add('active');
        // Update active class on nav links
        document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
        document.querySelector('.nav-menu a[data-project="home"]').classList.add('active');
        // Scroll to top
        window.scrollTo(0, 0);
    });

    // Dropdown menu functionality
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdown = document.querySelector('.dropdown');
    
    // Add click event for all screen sizes
    dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        dropdown.classList.toggle('active');
    });
    
    // Add event listener to close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });

    // Project navigation
    const navLinks = document.querySelectorAll('.nav-menu a[data-project], .dropdown-menu a[data-project], .footer-links a');
    const projectSections = document.querySelectorAll('.project-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
            projectSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link in the main menu
            const projectId = this.getAttribute('data-project');
            document.querySelector(`.nav-menu a[data-project="${projectId}"]`) && 
                document.querySelector(`.nav-menu a[data-project="${projectId}"]`).classList.add('active');
            
            // Show the corresponding section
            document.getElementById(projectId).classList.add('active');
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                nav.classList.remove('active');
            }
            
            // Close dropdown if open on mobile
            if (dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
            }
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
    });

    // Project card click handlers
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // The click handler is set inline in the HTML
        });
    });

    // Handle iframe loading issues
    const iframes = document.querySelectorAll('iframe');
    
    iframes.forEach(iframe => {
        iframe.addEventListener('load', function() {
            // Adjust iframe height to content if needed
            try {
                const height = this.contentWindow.document.body.scrollHeight;
                if (height > 0) {
                    this.style.height = height + 'px';
                }
            } catch (e) {
                console.log('Cannot access iframe content - likely cross-origin restriction');
            }
        });
        
        // Handle iframe load errors
        iframe.addEventListener('error', function() {
            this.parentElement.innerHTML = `
                <div class="error-container">
                    <h3>Error al cargar el proyecto</h3>
                    <p>No se pudo cargar el contenido del proyecto. Por favor, verifica que el archivo existe.</p>
                </div>
            `;
        });
    });
    
    // Add smooth scrolling for all anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Handle window resize for dropdown menu
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            dropdown.classList.remove('active');
        }
    });
}); 