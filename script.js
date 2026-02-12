document.addEventListener('DOMContentLoaded', () => {

    // Cookie Consent Logic
    const cookieOverlay = document.getElementById('cookieConsent');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    const cookiePrefsBtn = document.getElementById('cookiePreferences');

    function checkCookieConsent() {
        if (!localStorage.getItem('cookieConsent')) {
            // Show modal after a short delay
            setTimeout(() => {
                cookieOverlay.classList.add('active');
            }, 1000);
        }
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieOverlay.classList.remove('active');
        });
    }

    if (cookiePrefsBtn) {
        cookiePrefsBtn.addEventListener('click', () => {
            // For now, treat as accept or just close, until a preferences modal is built.
            // Given the request was just "add a tab to accept", we'll just close it.
            cookieOverlay.classList.remove('active');
        });
    }

    checkCookieConsent();

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });



    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Special handling for progress bar
                if (entry.target.classList.contains('progress-bar-container')) {
                    const fill = entry.target.querySelector('.progress-fill');
                    if (fill) {
                        // Animate width from 0 to 70%
                        setTimeout(() => {
                            fill.style.width = '70%';
                        }, 200);
                    }
                }
            }
        });
    }, observerOptions);

    // Observe sections and elements
    document.querySelectorAll('section, .feature-card, .pricing-card, .image-content').forEach(el => {
        el.classList.add('fade-element');
        observer.observe(el);
    });

    // Observe progress bar specifically
    const progressBar = document.querySelector('.progress-bar-container');
    if (progressBar) observer.observe(progressBar);


    // Navbar scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            header.style.background = 'rgba(5, 5, 16, 0.95)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            header.classList.remove('scrolled');
            header.style.background = 'rgba(5, 5, 16, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // Floating CTA
    const floatingCta = document.querySelector('.floating-cta');

    // Show after scrolling past hero
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname.split('/').pop() === '';

    // Initial check for non-home pages
    if (floatingCta && !isHomePage) {
        floatingCta.classList.add('visible');
    }

    window.addEventListener('scroll', () => {
        if (!floatingCta) return;

        if (isHomePage) {
            // On Home page, only show after scrolling past Hero
            if (window.scrollY > 300) {
                floatingCta.classList.add('visible');
            } else {
                floatingCta.classList.remove('visible');
            }
        } else {
            // On other pages, ALWAYS show it (ensure it stays visible)
            floatingCta.classList.add('visible');
        }
    });

    if (floatingCta) {
        floatingCta.addEventListener('click', (e) => {
            // Check if #pricing exists on this page
            const pricingSection = document.querySelector('#pricing');
            if (pricingSection) {
                e.preventDefault();
                pricingSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            // If not found, do nothing and let the <a> tag default behavior work (navigate to href)
        });
    }

    // Modal logic
    const modal = document.getElementById('reservationModal');
    const modalContent = modal.querySelector('.modal-content');
    const closeBtn = modal.querySelector('.modal-close');
    const form = document.getElementById('reservationForm');
    let currentPlan = 'free'; // Default

    function openModal(planType = 'free') {
        currentPlan = planType;
        if (modal.classList.contains('active')) return;

        // Customize Modal based on plan
        const submitBtn = form.querySelector('button[type="submit"]');
        const modalTitle = modal.querySelector('.modal-header h3');
        const modalDesc = modal.querySelector('.modal-header p');

        if (currentPlan === 'early') {
            modalTitle.textContent = "Reserva Early Access";
            modalTitle.style.color = "var(--secondary)"; // Pink for premium
            modalDesc.textContent = "Plazas limitadas. Se requiere confirmar por WhatsApp.";
            submitBtn.textContent = "Confirmar y Enviar WhatsApp";
        } else {
            modalTitle.textContent = "Reserva tu Plaza";
            modalTitle.style.color = "var(--text-main)";
            modalDesc.textContent = "Únete a la lista de espera exclusiva";
            submitBtn.textContent = "Confirmar Reserva";
        }

        modal.classList.add('active');
        // Small delay for fade-in effect to work with display:none
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
    }

    function closeModal() {
        modal.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        setTimeout(() => {
            modal.classList.remove('active');
            // Reset form if submitted
            if (form.innerHTML.includes('success-icon')) {
                setTimeout(() => window.location.reload(), 500);
            }
        }, 300);
    }

    // Attach click events to buttons
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-nav').forEach(btn => {
        // If it's a link to another page (not # and not empty), let it navigate
        if (btn.tagName === 'A' && btn.getAttribute('href') && !btn.getAttribute('href').startsWith('#')) return;

        if (btn.getAttribute('href') && btn.getAttribute('href').startsWith('#')) return; // Ignore internal anchors handled by smooth scroll

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Check if it's the early access button
            const plan = btn.dataset.plan || 'free';
            openModal(plan);
        });
    });

    // Close events
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Form Submission (Google Sheets)
    // INSTRUCCIÓN: Pega aquí la URL de tu Google Apps Script (mira INSTRUCCIONES_GOOGLE_SHEETS.md)
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzvBhQP2T-6eT0_-HidazAXKeuWI75yQhgd22mviSDyzykV-lFjuVgP4dCh3nQBaFLKkQ/exec';

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const metatrader = document.getElementById('metatrader').value;

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Guardando...';
        btn.style.opacity = '0.7';
        btn.disabled = true;

        // Prepare data for Google Sheets
        const formData = new FormData();
        formData.append('nombre', name);
        formData.append('email', email);
        formData.append('metatrader_5', metatrader);
        formData.append('tipo_plan', currentPlan === 'early' ? 'Early Access (€97)' : 'Lista Espera (Free)');
        formData.append('fecha', new Date().toLocaleString());

        // Send data
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Important for Google Script due to CORS policy
        })
            .then(() => {
                // Success response (Google Script always returns opaque response with no-cors)
                if (currentPlan === 'early') {
                    // Redirect to WhatsApp for Early Access
                    const message = `Hola, soy ${name}. He rellenado el formulario y quiero acceder al servicio Early Access de Trader IA (€97). Mi correo es ${email}.`;
                    const whatsappUrl = `https://wa.me/34680763443?text=${encodeURIComponent(message)}`;

                    form.innerHTML = `
                    <div class="success-message">
                         <i class="fa-brands fa-whatsapp success-icon" style="color: #25D366;"></i>
                        <h3>¡Datos Guardados!</h3>
                        <p>Redirigiendo a WhatsApp para completar la reserva...</p>
                        <p style="font-size: 0.8rem; margin-top: 1rem;">Si no se abre automáticamente, <a href="${whatsappUrl}" target="_blank" style="color: var(--accent);">haz clic aquí</a>.</p>
                    </div>
                `;

                    // Slight delay before redirect
                    setTimeout(() => {
                        window.open(whatsappUrl, '_blank');
                    }, 1500);

                } else {
                    // Normal Success for Free Plan
                    form.innerHTML = `
                    <div class="success-message">
                        <i class="fa-solid fa-circle-check success-icon"></i>
                        <h3>¡Reserva Confirmada!</h3>
                        <p>Gracias <strong>${name}</strong>.</p>
                        <p>Tus datos se han guardado correctamente en nuestra lista de espera.</p>
                        <button class="btn-secondary" onclick="document.querySelector('.modal-close').click()" style="margin-top:2rem">Cerrar</button>
                    </div>
                `;
                }
            })
            .catch(error => {
                console.error('Error!', error.message);
                btn.innerHTML = 'Error. Inténtalo de nuevo.';
                btn.style.background = 'var(--danger)';
                btn.disabled = false;
            });
    });
    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        // Only if header exists (to avoid errors on pages without FAQ)
        if (header) {
            header.addEventListener('click', () => {
                // Close other items (accordion behavior - optional but cleaner)
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-body').style.maxHeight = null;
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
                const body = item.querySelector('.faq-body');

                if (item.classList.contains('active')) {
                    body.style.maxHeight = (body.scrollHeight + 200) + "px";
                } else {
                    body.style.maxHeight = null;
                }
            });
        }
    });

});
