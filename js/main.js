document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    const body = document.body;

    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate close
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            body.classList.toggle('no-scroll');
            console.log('Mobile menu toggled');
        });
    } else {
        console.error('Mobile toggle button not found');
    }

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });

    // Navigation Background on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Premium Hero Animation (Letter-by-Letter, Word-Safe)
    const heroLines = document.querySelectorAll('.animated-text .line');
    let totalDelay = 0;

    heroLines.forEach((line) => {
        const textStr = line.textContent.trim();
        line.textContent = ''; // Clear content

        // Split into words
        const words = textStr.split(/\s+/);

        words.forEach((wordText) => {
            const wordSpan = document.createElement('span');
            wordSpan.classList.add('word');

            // Split word into characters
            // Note: HTML spaces are handled by .word CSS margin to prevent layout bugs
            wordText.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.classList.add('char');
                charSpan.textContent = char;
                charSpan.style.animationDelay = `${totalDelay}s`;
                wordSpan.appendChild(charSpan);
                totalDelay += 0.04; // Smooth premium stagger
            });

            line.appendChild(wordSpan);
            totalDelay += 0.08; // Small pause between words
        });

        totalDelay += 0.4; // Pause between lines
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.hero-subtitle, .hero-actions, .service-card, .section-title, .glass-card, .minimal-list, .team-list');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add class 'visible' style dynamically or handle via CSS class addition
    // Let's modify the observer to just set the inline styles for simplicity here
    // But better to add a class:
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);

    // Contact Form Logic
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !message) return;

            const whatsappMessage = `Hello Mann Nandwal,

New Website Enquiry Received:

Name: ${name}
Message: ${message}`;

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/919826251184?text=${encodedMessage}`;

            window.open(whatsappURL, '_blank');
        });
    }

    // --- MARQUEE SCROLL CONTROL ---
    const marqueeContainers = document.querySelectorAll('.marquee-container');

    marqueeContainers.forEach(container => {
        const track = container.querySelector('.marquee-track');
        const prevBtn = container.querySelector('.prev-arrow');
        const nextBtn = container.querySelector('.next-arrow');

        if (track) {
            let scrollPos = 0;
            let velocity = -0.5; // Initial speed (moving left)
            const baseSpeed = -0.6; // Target auto-scroll speed
            let isDragging = false;
            let startX = 0;
            let startScrollPos = 0;
            let isPaused = false;
            let resumeTimeout;

            // Calculate single set width (assumes 3 duplicate sets)
            // We use a function to update it on resize
            const getSetWidth = () => {
                // If track has valid width, return 1/3
                // Fallback to a large number if not ready
                return (track.scrollWidth > 0) ? track.scrollWidth / 3 : 1;
            };
            let setWidth = getSetWidth();

            window.addEventListener('resize', () => {
                setWidth = getSetWidth();
            });

            // Animation Loop
            function animate() {
                if (!isDragging) {
                    // If paused, velocity targets 0
                    // If running, velocity targets baseSpeed
                    const targetV = isPaused ? 0 : baseSpeed;

                    // Smooth accel/decel (Physics)
                    velocity += (targetV - velocity) * 0.05;

                    scrollPos += velocity;
                }

                // Infinite Loop Reset (Seamless)
                // If scrolled too far left (negative)
                if (scrollPos <= -setWidth) {
                    scrollPos += setWidth;
                }
                // If scrolled too far right (positive)
                if (scrollPos > 0) {
                    scrollPos -= setWidth;
                }

                track.style.transform = `translateX(${scrollPos}px)`;
                requestAnimationFrame(animate);
            }

            // Start Loop
            requestAnimationFrame(animate);

            // --- Drag / Swipe ---
            const startDrag = (e) => {
                isDragging = true;
                startX = e.pageX || e.touches[0].pageX;
                startScrollPos = scrollPos;
                track.style.cursor = 'grabbing';
                track.classList.add('dragging');

                // Stop any resume timers
                clearTimeout(resumeTimeout);
                isPaused = true; // Pause auto logic (velocity reset)
                velocity = 0; // Stop momentum immediately on grab
            };

            const moveDrag = (e) => {
                if (!isDragging) return;
                const x = e.pageX || e.touches[0].pageX;
                const walk = x - startX;
                scrollPos = startScrollPos + walk;
            };

            const endDrag = (e) => {
                if (!isDragging) return;
                isDragging = false;
                track.style.cursor = 'grab';
                track.classList.remove('dragging');

                // Optionally calculate throw velocity here?
                // For now, simple resume
                resumeTimeout = setTimeout(() => {
                    isPaused = false;
                }, 1000);
            };

            track.addEventListener('mousedown', startDrag);
            track.addEventListener('touchstart', startDrag);

            window.addEventListener('mousemove', moveDrag);
            window.addEventListener('touchmove', moveDrag);

            window.addEventListener('mouseup', endDrag);
            window.addEventListener('touchend', endDrag);

            // --- Arrows ---
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    // Impulse Right
                    velocity = 15; // Fast burst right
                    isPaused = false; // Ensure it moves
                    // After impulse, it will decay back to baseSpeed
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    // Impulse Left
                    // Current speed is -0.5. We want a burst left.
                    velocity = -15;
                    isPaused = false;
                });
            }

            // --- Hover Pause (Desktop) ---
            container.addEventListener('mouseenter', () => {
                // Only pause if not dragging
                if (!isDragging) isPaused = true;
            });

            container.addEventListener('mouseleave', () => {
                if (!isDragging) {
                    isPaused = false;
                    clearTimeout(resumeTimeout);
                }
            });
        }
    });
});
