(function() {
    // --- TAB SWITCHING WITH INDICATOR ---
    const desktopNav = document.getElementById('desktopNav');
    const mobileMenuContainer = document.getElementById('mobileMenuContainer');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const header = document.getElementById('header');
    const tabContents = document.querySelectorAll('.tab-content');
    let indicator = document.querySelector('.tab-indicator');

    function updateIndicator(tabElement) {
        if (!indicator || window.innerWidth <= 900) return;
        const rect = tabElement.getBoundingClientRect();
        const parentRect = desktopNav.getBoundingClientRect();
        indicator.style.width = rect.width + 'px';
        indicator.style.left = (rect.left - parentRect.left) + 'px';
        indicator.style.height = rect.height + 'px';
        indicator.style.top = (rect.top - parentRect.top) + 'px';
    }

    function switchTab(tabId) {
        document.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(btn => btn.classList.add('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        const targetContent = document.getElementById(`tab-${tabId}`);
        if (targetContent) targetContent.classList.add('active');
        closeMobileMenu(); // закрываем мобильное меню после переключения
        const activeTabElem = document.querySelector('.nav-tab.active');
        if (activeTabElem && window.innerWidth > 900) updateIndicator(activeTabElem);
        if (history.pushState) history.pushState(null, null, '#' + tabId);
    }

    function populateMobileMenu() {
        const desktopBtns = desktopNav.querySelectorAll('.nav-tab');
        mobileMenuContainer.innerHTML = '';
        desktopBtns.forEach(btn => {
            const clone = btn.cloneNode(true);
            clone.classList.remove('active');
            mobileMenuContainer.appendChild(clone);
        });
    }
    populateMobileMenu();

    function openMobileMenu() {
        mobileOverlay.classList.add('show');
        mobileMenuBtn.innerHTML = '<span class="material-symbols-outlined">close</span>';
        document.body.style.overflow = 'hidden';
        const activeTabId = document.querySelector('.nav-tab.active')?.getAttribute('data-tab');
        if (activeTabId) {
            mobileMenuContainer.querySelectorAll('.nav-tab').forEach(btn => btn.classList.remove('active'));
            const activeMobile = mobileMenuContainer.querySelector(`[data-tab="${activeTabId}"]`);
            if (activeMobile) activeMobile.classList.add('active');
        }
    }

    function closeMobileMenu() {
        mobileOverlay.classList.remove('show');
        mobileMenuBtn.innerHTML = '<span class="material-symbols-outlined">menu</span>';
        document.body.style.overflow = '';
    }

    // Обработчик кликов для ВСЕХ кнопок .nav-tab (и в десктопной, и в мобильной версии)
    document.body.addEventListener('click', (e) => {
        const tabBtn = e.target.closest('.nav-tab');
        if (tabBtn) {
            e.preventDefault();
            const tabId = tabBtn.getAttribute('data-tab');
            if (tabId) switchTab(tabId);
        }
    });

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileOverlay.classList.contains('show') ? closeMobileMenu() : openMobileMenu();
    });

    mobileOverlay.addEventListener('click', (e) => {
        if (e.target === mobileOverlay) closeMobileMenu();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileOverlay.classList.contains('show')) closeMobileMenu();
    });

    document.getElementById('logoLink').addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('home');
    });

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const activeTabElem = document.querySelector('.nav-tab.active');
            if (activeTabElem && window.innerWidth > 900) updateIndicator(activeTabElem);
        }, 100);
    });

    // --- SLIDER GALLERY ---
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');

    function updateSlider() {
        slides.forEach((slide, idx) => {
            slide.classList.toggle('active', idx === currentSlide);
        });
        document.querySelectorAll('.dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentSlide);
        });
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === currentSlide) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentSlide = idx;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        });
    }

    if (prevBtn && nextBtn && slides.length) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateSlider();
        });
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        });
        createDots();
    }

    // --- ROUTE BUILDER ---
    const buildBtn = document.getElementById('buildRouteBtn');
    const startInput = document.getElementById('startPoint');
    const destination = 'Минск, ул. Макаёнка, 8';

    if (buildBtn && startInput) {
        buildBtn.addEventListener('click', () => {
            const start = startInput.value.trim();
            if (!start) {
                alert('Пожалуйста, введите точку отправления');
                return;
            }
            const url = `https://yandex.ru/maps/?rtext=${encodeURIComponent(start)}~${encodeURIComponent(destination)}&rtt=auto`;
            window.open(url, '_blank');
        });
    }

    function restoreFromHash() {
        const hash = window.location.hash.slice(1);
        if (['home','history','teacher','gallery','works','program','directions'].includes(hash)) {
            switchTab(hash);
        } else {
            switchTab('home');
        }
    }

    window.addEventListener('load', () => {
        if (indicator && window.innerWidth > 900) {
            const activeTab = document.querySelector('.nav-tab.active');
            if (activeTab) updateIndicator(activeTab);
        }
    });
    restoreFromHash();
    window.addEventListener('hashchange', restoreFromHash);
})();