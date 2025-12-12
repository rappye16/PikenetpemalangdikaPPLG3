// Konfigurasi AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Hilangkan loader setelah halaman siap
    setTimeout(() => {
        document.querySelector('.loader').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 1000);

    // Inisialisasi semua komponen
    initNavigation();
    initSmoothScroll();
    initScrollEffects();
    initGalleryModal();
    initServiceHover();
    initContactForm();
    initScrollProgress();
    initParallax();
    initThemeToggle();
    initCounters();
    initParticleEffect();
    initInteractiveMap();
});

// ===== NAVIGASI RESPONSIF =====
function initNavigation() {
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');
    
    // Toggle menu mobile
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.innerHTML = nav.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Tutup menu saat klik link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
}

// ===== SMOOTH SCROLL =====
// ===== SMOOTH SCROLL DENGAN HEADER OFFSET =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Hitung offset berdasarkan section
                let headerOffset = 80; // Default
                
                if (targetId === '#home') {
                    headerOffset = 60; // Lebih kecil untuk home
                } else if (targetId === '#contact' || targetId === '#gallery') {
                    headerOffset = 90; // Sedikit lebih besar
                }
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL tanpa refresh
                history.pushState(null, null, targetId);
            }
        });
    });
}
// ===== UPDATE NAV LINK ACTIVE =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const headerHeight = document.querySelector('header').offsetHeight;
        
        if (scrollY >= (sectionTop - headerHeight - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== SCROLL EFFECTS =====
function initScrollEffects() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements untuk animasi
    document.querySelectorAll('.service-item, .gallery-item, .contact-info').forEach(el => {
        observer.observe(el);
    });
}

// ===== MODAL GALERI INTERAKTIF =====
function initGalleryModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <span class="close-modal">&times;</span>
        <img class="modal-content" src="" alt="">
    `;
    document.body.appendChild(modal);
    
    const modalImg = modal.querySelector('.modal-content');
    const closeBtn = modal.querySelector('.close-modal');
    
    // Buka modal saat klik gambar
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            modal.style.display = 'flex';
            modalImg.src = img.src;
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Tutup modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Tutup modal saat klik di luar gambar
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Navigasi dengan keyboard
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'flex') {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });
}

// ===== SERVICE HOVER EFFECT =====
function initServiceHover() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.05)';
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.zIndex = '1';
        });
    });
}

// ===== FORM KONTAK INTERAKTIF =====
function initContactForm() {
    // Jika ada form di kemudian hari
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Simulasi pengiriman
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.disabled = true;
            
            // Simulasi delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Reset form
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Tampilkan notifikasi
            showNotification('Pesan berhasil dikirim!', 'success');
        });
    });
}

// ===== NOTIFIKASI =====
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animasi masuk
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hapus setelah 3 detik
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--accent-red), var(--primary-blue));
        z-index: 9999;
        transition: width 0.3s;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// ===== PARALLAX EFFECT =====
function initParallax() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        if (hero) {
            hero.style.backgroundPosition = `center ${rate}px`;
        }
    });
}

// ===== ANIMATED COUNTERS =====
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / 200;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 10);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start counter ketika visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(counter);
            }
        });
        
        observer.observe(counter);
    });
}

// ===== PARTICLE EFFECT =====
function initParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = Math.random() > 0.5 ? 'rgba(22, 96, 136, 0.5)' : 'rgba(230, 57, 70, 0.5)';
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Initialize particles
    function initParticles() {
        particles = [];
        const particleCount = Math.min(100, Math.floor(canvas.width * canvas.height / 10000));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Connect particles with lines
    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.strokeStyle = `rgba(22, 96, 136, ${0.2 * (1 - distance/100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    
    // Initialize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    
    resizeCanvas();
    initParticles();
    animateParticles();
}

// ===== INTERACTIVE MAP =====
function initInteractiveMap() {
    const mapLink = document.querySelector('.map-link');
    if (mapLink) {
        mapLink.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create modal for map
            const mapModal = document.createElement('div');
            mapModal.className = 'modal';
            mapModal.innerHTML = `
                <span class="close-modal">&times;</span>
                <div class="map-container">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.715002179836!2d109.37967077486175!3d-7.269959292737278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e655b0a9d08d8b9%3A0x2e9e4b3b3b3b3b3b!2sPIKENET!5e0!3m2!1sid!2sid!4v1648039200000!5m2!1sid!2sid" 
                        width="100%" 
                        height="450" 
                        style="border:0;" 
                        allowfullscreen="" 
                        loading="lazy">
                    </iframe>
                </div>
            `;
            
            document.body.appendChild(mapModal);
            mapModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            const closeBtn = mapModal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                mapModal.remove();
                document.body.style.overflow = 'auto';
            });
            
            mapModal.addEventListener('click', (e) => {
                if (e.target === mapModal) {
                    mapModal.remove();
                    document.body.style.overflow = 'auto';
                }
            });
        });
    }
}

// ===== LAZY LOADING IMAGES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== ADDITIONAL CSS FOR JS EFFECTS =====
const additionalCSS = `
/* Notification Styles */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 10px;
    background: white;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    z-index: 9999;
}

.notification.show {
    transform: translateX(0);
}

.notification.success {
    border-left: 4px solid #4fc3a1;
}

.notification i {
    font-size: 1.2rem;
}

.notification.success i {
    color: #4fc3a1;
}

/* Dark Mode Styles */
.dark-mode {
    background: #121212;
    color: #e0e0e0;
}

.dark-mode .bg-light {
    background: linear-gradient(135deg, #1e1e1e, #2d2d2d);
}

.dark-mode .service-item,
.dark-mode .contact-info,
.dark-mode .vision-mission,
.dark-mode .history {
    background: #1e1e1e;
    color: #e0e0e0;
}

.dark-mode header {
    background: rgba(30, 30, 30, 0.95);
}

.dark-mode nav a {
    color: #e0e0e0;
}

/* Loaded image animation */
img[data-src] {
    opacity: 0;
    transition: opacity 0.5s ease;
}

img.loaded {
    opacity: 1;
}

/* Counter Styles */
.counter {
    font-size: 3rem;
    font-weight: bold;
    background: linear-gradient(45deg, var(--primary-blue), var(--accent-red));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    margin: 10px;
}

/* Map container */
.map-container {
    width: 90%;
    max-width: 800px;
    background: white;
    border-radius: 15px;
    overflow: hidden;
}

/* Progress bar animation */
.scroll-progress {
    transition: width 0.1s;
}
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// ===== FORUM KONSULTASI SIMPLE =====
function initSimpleForum() {
    initFAQAccordion();
    initConsultForm();
}

// FAQ Accordion
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all other FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Toggle current FAQ
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Consultation Form
function initConsultForm() {
    const form = document.getElementById('consultForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Get form data
        const formData = {
            name: this.querySelector('input[type="text"]').value,
            phone: this.querySelector('input[type="tel"]').value,
            email: this.querySelector('input[type="email"]').value,
            address: this.querySelector('input[placeholder*="Kecamatan"]').value,
            problem: this.querySelector('input[name="problem"]:checked').value,
            description: this.querySelector('textarea').value,
            timestamp: new Date().toLocaleString('id-ID')
        };
        
        // Show loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitBtn.disabled = true;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create success message
        const successHTML = `
            <div class="success-message">
                <i class="fas fa-check-circle"></i>
                <h5>Konsultasi Terkirim!</h5>
                <p>Terima kasih ${formData.name}, konsultasi Anda telah kami terima.</p>
                <p>Tim kami akan menghubungi via WhatsApp dalam 15 menit.</p>
                <p><small>No. Referensi: PIKE-${Date.now().toString().slice(-6)}</small></p>
            </div>
        `;
        
        // Replace form with success message
        const formContainer = form.parentElement;
        form.style.display = 'none';
        formContainer.insertAdjacentHTML('beforeend', successHTML);
        
        // Auto-scroll to success message
        document.querySelector('.success-message').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Optional: Send WhatsApp message (simulated)
        const whatsappMessage = `Halo PIKENET, saya ${formData.name} (${formData.phone}). Saya mau konsultasi tentang: ${formData.description}`;
        console.log('WhatsApp message:', whatsappMessage);
        // Uncomment to actually send WhatsApp:
        // window.open(`https://wa.me/6289528831414?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initSimpleForum();
});
