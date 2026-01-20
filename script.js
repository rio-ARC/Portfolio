/* ============================================
   MARIO PORTFOLIO - JAVASCRIPT
   Navigation, Scroll Effects & Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initNavigation();
    initScrollReveal();
    initSmoothScroll();
    initActiveNavHighlight();
    initFormHandler();
    initParallaxEffects();
    initSkillsCarousel();
});

/* ============================================
   SKILLS CAROUSEL - Auto-scroll with controls
   ============================================ */
function initSkillsCarousel() {
    const row1 = document.getElementById('skills-row-1');
    const row2 = document.getElementById('skills-row-2');

    if (!row1 || !row2) return;

    const track1 = row1.querySelector('.skills-track');
    const track2 = row2.querySelector('.skills-track');

    // State for each row
    const rowStates = {
        1: { paused: false, manualScrolling: false, resumeTimeout: null },
        2: { paused: false, manualScrolling: false, resumeTimeout: null }
    };

    // Handle arrow button clicks
    document.querySelectorAll('.scroll-arrow').forEach(arrow => {
        const rowNum = arrow.dataset.row;
        const direction = arrow.classList.contains('arrow-left') ? 'left' : 'right';
        const row = document.getElementById(`skills-row-${rowNum}`);
        const track = row.querySelector('.skills-track');
        const state = rowStates[rowNum];

        arrow.addEventListener('click', () => {
            // Pause the animation
            track.classList.add('paused');
            state.paused = true;
            arrow.classList.add('active');

            // Clear any existing resume timeout
            if (state.resumeTimeout) {
                clearTimeout(state.resumeTimeout);
            }

            // Scroll manually in the direction
            const scrollAmount = direction === 'left' ? -150 : 150;
            const currentTransform = getComputedStyle(track).transform;
            let currentX = 0;

            if (currentTransform !== 'none') {
                const matrix = new DOMMatrix(currentTransform);
                currentX = matrix.m41;
            }

            // Apply the manual scroll
            track.style.transform = `translateX(${currentX + scrollAmount}px)`;

            // Resume after 3 seconds of inactivity
            state.resumeTimeout = setTimeout(() => {
                track.classList.remove('paused');
                track.style.transform = '';
                state.paused = false;
                arrow.classList.remove('active');

                // Remove active from sibling arrow too
                const siblingArrow = arrow.parentElement.querySelector(
                    direction === 'left' ? '.arrow-right' : '.arrow-left'
                );
                if (siblingArrow) siblingArrow.classList.remove('active');
            }, 3000);
        });

        // Hold to continuously scroll
        let holdInterval = null;

        arrow.addEventListener('mousedown', () => {
            holdInterval = setInterval(() => {
                const scrollAmount = direction === 'left' ? -50 : 50;
                const currentTransform = getComputedStyle(track).transform;
                let currentX = 0;

                if (currentTransform !== 'none') {
                    const matrix = new DOMMatrix(currentTransform);
                    currentX = matrix.m41;
                }

                track.style.transform = `translateX(${currentX + scrollAmount}px)`;
            }, 50);
        });

        arrow.addEventListener('mouseup', () => {
            if (holdInterval) {
                clearInterval(holdInterval);
                holdInterval = null;
            }
        });

        arrow.addEventListener('mouseleave', () => {
            if (holdInterval) {
                clearInterval(holdInterval);
                holdInterval = null;
            }
        });
    });

    // Pause on hover over skill cards
    [track1, track2].forEach((track, index) => {
        const rowNum = index + 1;
        const state = rowStates[rowNum];

        track.addEventListener('mouseenter', () => {
            track.classList.add('paused');
        });

        track.addEventListener('mouseleave', () => {
            if (!state.paused) {
                track.classList.remove('paused');
                track.style.transform = '';
            }
        });
    });
}



/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Play a "coin" sound effect visually
            const coinIcon = document.querySelector('.coin-icon');
            if (coinIcon) {
                coinIcon.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    coinIcon.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

/* ============================================
   SMOOTH SCROLLING
   ============================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   ACTIVE NAVIGATION HIGHLIGHT
   ============================================ */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        let currentSection = '';
        const navHeight = document.querySelector('.navbar').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', throttle(highlightNav, 100));
    highlightNav(); // Initial call
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
    // Add reveal class to elements
    const revealElements = [
        '.brick-card',
        '.skill-category',
        '.project-card',
        '.achievement-card',
        '.contact-info',
        '.contact-form'
    ];

    revealElements.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    // Intersection Observer for reveal
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: unobserve after revealing
                // revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
}

/* ============================================
   PARALLAX EFFECTS
   ============================================ */
function initParallaxEffects() {
    const clouds = document.querySelectorAll('.cloud');
    const hills = document.querySelectorAll('.hill');

    window.addEventListener('scroll', throttle(function () {
        const scrollY = window.scrollY;

        // Parallax for clouds - different speeds
        clouds.forEach((cloud, index) => {
            const speed = 0.1 + (index * 0.05);
            cloud.style.transform = `translateY(${scrollY * speed}px)`;
        });

        // Parallax for hills
        hills.forEach((hill, index) => {
            const speed = 0.05 + (index * 0.02);
            hill.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }, 16));
}

/* ============================================
   FORM HANDLER
   ============================================ */
function initFormHandler() {
    const form = document.getElementById('contact-form');
    const YOUR_EMAIL = 'arc.nbg11@gmail.com';

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields!', 'error');
                return;
            }

            // Show sending animation
            const submitBtn = form.querySelector('.btn-submit');
            submitBtn.innerHTML = '<span>OPENING EMAIL...</span>';
            submitBtn.disabled = true;

            // Create mailto link with form data
            const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
            const body = encodeURIComponent(
                `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
            );
            const mailtoLink = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;

            // Short delay for animation, then open mail client
            setTimeout(() => {
                // Open email client
                window.location.href = mailtoLink;

                // Success animation
                submitBtn.innerHTML = '<span>EMAIL CLIENT OPENED!</span><span class="coin-burst">+1000</span>';
                submitBtn.style.background = '#43B047';

                // Create coin explosion effect
                createCoinExplosion(submitBtn);

                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = '<span>SEND MESSAGE</span><span class="coin-burst">+100</span>';
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;

                    showNotification('Your email client should be open. Send the message from there!', 'success');
                }, 2000);
            }, 500);
        });
    }
}

/* ============================================
   COIN EXPLOSION EFFECT
   ============================================ */
function createCoinExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
        const coin = document.createElement('div');
        coin.innerHTML = '★';
        coin.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            font-size: 1.5rem;
            color: #FFD700;
            pointer-events: none;
            z-index: 9999;
            text-shadow: 0 0 10px #FFD700;
        `;

        document.body.appendChild(coin);

        const angle = (i / 8) * Math.PI * 2;
        const velocity = 100 + Math.random() * 50;
        const endX = Math.cos(angle) * velocity;
        const endY = Math.sin(angle) * velocity - 100;

        coin.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${endX}px, ${endY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => coin.remove();
    }
}

/* ============================================
   NOTIFICATION SYSTEM
   ============================================ */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.mario-notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `mario-notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '★' : '!'}</span>
        <span class="notification-text">${message}</span>
    `;

    // Styles
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: ${type === 'success' ? '#43B047' : '#E52521'};
        color: white;
        padding: 15px 25px;
        font-family: 'Press Start 2P', monospace;
        font-size: 0.6rem;
        border: 4px solid ${type === 'success' ? '#008000' : '#9C3800'};
        box-shadow: 0 6px 0 ${type === 'success' ? '#008000' : '#9C3800'};
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 90%;
        text-align: center;
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.transition = 'transform 0.3s ease';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/* ============================================
   SKILL BLOCK INTERACTIONS
   ============================================ */
document.addEventListener('click', function (e) {
    const skillBlock = e.target.closest('.skill-block');
    if (skillBlock) {
        // Create coin pop effect
        const rect = skillBlock.getBoundingClientRect();
        const coin = document.createElement('div');
        coin.innerHTML = '+10';
        coin.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top}px;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.6rem;
            color: #FFD700;
            pointer-events: none;
            z-index: 9999;
            text-shadow: 2px 2px 0 #000;
        `;

        document.body.appendChild(coin);

        coin.animate([
            { transform: 'translateY(0) translateX(-50%)', opacity: 1 },
            { transform: 'translateY(-50px) translateX(-50%)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => coin.remove();
    }
});

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
window.addEventListener('scroll', throttle(function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)';
        navbar.style.boxShadow = 'none';
    }
}, 100));

/* ============================================
   PROJECT CARD HOVER SOUND EFFECT (Visual)
   ============================================ */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.querySelector('.world-number').style.textShadow = '2px 2px 0 #000, 0 0 20px #FFD700';
    });

    card.addEventListener('mouseleave', function () {
        this.querySelector('.world-number').style.textShadow = '2px 2px 0 #000';
    });
});

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    }
}

/* ============================================
   EASTER EGG - Konami Code
   ============================================ */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', function (e) {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateKonamiMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateKonamiMode() {
    // Rainbow mode!
    document.body.style.animation = 'rainbow 2s linear infinite';

    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    showNotification('🌟 SUPER STAR MODE ACTIVATED! 🌟', 'success');

    // Create star explosion
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.innerHTML = '★';
            star.style.cssText = `
                position: fixed;
                left: ${Math.random() * window.innerWidth}px;
                top: ${Math.random() * window.innerHeight}px;
                font-size: ${1 + Math.random() * 2}rem;
                color: #FFD700;
                pointer-events: none;
                z-index: 9999;
                text-shadow: 0 0 20px #FFD700;
            `;
            document.body.appendChild(star);

            star.animate([
                { transform: 'scale(0) rotate(0deg)', opacity: 1 },
                { transform: 'scale(1.5) rotate(360deg)', opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => star.remove();
        }, i * 50);
    }

    // Reset after 5 seconds
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

/* ============================================
   TYPING EFFECT FOR HERO (Optional Enhancement)
   ============================================ */
function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '3px solid #FFD700';

    let i = 0;
    function type() {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(type, 80);
        } else {
            subtitle.style.borderRight = 'none';
        }
    }

    // Start typing after a delay
    setTimeout(type, 1000);
}

// Uncomment to enable typing effect:
// initTypingEffect();

console.log('%c🍄 Welcome to Aritra\'s Mario Portfolio! 🍄', 'font-size: 20px; color: #E52521; font-weight: bold;');
console.log('%cPress ↑↑↓↓←→←→BA for a surprise!', 'font-size: 12px; color: #43B047;');
