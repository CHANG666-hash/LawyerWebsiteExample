// DOM 載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 導航選單元素
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // LINE 按鈕
    const lineButton = document.getElementById('line-button');
    
    // 預約 Modal 元素
    const appointmentBtn = document.getElementById('appointment-btn');
    const appointmentModal = document.getElementById('appointment-modal');
    const closeModal = document.getElementById('close-modal');
    const appointmentForm = document.querySelector('.appointment-form');
    
    // 導航選單切換（手機版）
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // 切換按鈕動畫
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bar.style.transform = '';
                bar.style.opacity = '1';
            }
        });
    });
    
    // 導航連結點擊處理
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // 計算偏移量（考慮固定導航列的高度）
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                // 平滑滾動
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // 關閉手機版選單
            navMenu.classList.remove('active');
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.transform = '';
                bar.style.opacity = '1';
            });
        });
    });
    
    // 滾動時更新導航列樣式
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        // 高亮當前區塊的導航連結
        highlightActiveNavLink();
    });
    
    // 高亮當前區塊的導航連結
    function highlightActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navHeight = document.querySelector('.navbar').offsetHeight;
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
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
    
    // LINE 按鈕點擊事件
    lineButton.addEventListener('click', function() {
        // 這裡可以放置實際的 LINE 連結
        const lineUrl = 'https://line.me/ti/p/你的LINE ID'; // 請替換為實際的 LINE 官方帳號連結
        
        // 顯示提示訊息（因為沒有真實的 LINE ID）
        showNotification('請聯絡 LINE ID：@lawyerchang 或電話 (02) 2388-9999', 'info');
        
        // 如果有真實的 LINE ID，可以取消註解下面這行
        // window.open(lineUrl, '_blank');
    });
    
    // 預約按鈕點擊事件
    appointmentBtn.addEventListener('click', function() {
        appointmentModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 防止背景滾動
    });
    
    // 關閉 Modal
    function closeAppointmentModal() {
        appointmentModal.style.display = 'none';
        document.body.style.overflow = ''; // 恢復滾動
    }
    
    closeModal.addEventListener('click', closeAppointmentModal);
    
    // 點擊 Modal 背景關閉
    appointmentModal.addEventListener('click', function(e) {
        if (e.target === appointmentModal) {
            closeAppointmentModal();
        }
    });
    
    // ESC 鍵關閉 Modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && appointmentModal.style.display === 'block') {
            closeAppointmentModal();
        }
    });
    
    // 預約表單提交處理
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 取得表單資料
        const formData = new FormData(appointmentForm);
        const appointmentData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            caseType: formData.get('case-type'),
            message: formData.get('message')
        };
        
        // 驗證表單
        if (!validateAppointmentForm(appointmentData)) {
            return;
        }
        
        // 顯示處理中狀態
        const submitBtn = appointmentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '提交中...';
        submitBtn.disabled = true;
        
        // 模擬提交處理（實際使用時應該發送到後端）
        setTimeout(() => {
            showNotification('預約申請已送出！我們會盡快與您聯絡。', 'success');
            appointmentForm.reset();
            closeAppointmentModal();
            
            // 恢復按鈕狀態
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // 實際應用中，這裡應該發送資料到後端
            console.log('預約資料：', appointmentData);
            
        }, 1500);
    });
    
    // 表單驗證
    function validateAppointmentForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9\-\(\)\s\+]+$/;
        
        if (!data.name.trim()) {
            showNotification('請填寫姓名', 'error');
            return false;
        }
        
        if (!data.phone.trim() || !phoneRegex.test(data.phone)) {
            showNotification('請填寫有效的聯絡電話', 'error');
            return false;
        }
        
        if (!data.email.trim() || !emailRegex.test(data.email)) {
            showNotification('請填寫有效的電子郵件', 'error');
            return false;
        }
        
        if (!data.caseType) {
            showNotification('請選擇案件類型', 'error');
            return false;
        }
        
        return true;
    }
    
    // 顯示通知訊息
    function showNotification(message, type = 'info') {
        // 移除現有通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 創建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 設置樣式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            fontSize: '14px',
            zIndex: '10000',
            maxWidth: '400px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
        });
        
        // 設置背景顏色
        switch (type) {
            case 'success':
                notification.style.background = '#10b981';
                break;
            case 'error':
                notification.style.background = '#ef4444';
                break;
            case 'warning':
                notification.style.background = '#f59e0b';
                break;
            default:
                notification.style.background = '#3b82f6';
        }
        
        document.body.appendChild(notification);
        
        // 顯示動畫
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 點擊關閉
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // 自動關閉
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    // 平滑滾動到指定區塊的函數（全域函數）
    window.scrollToSection = function(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };
    
    // 滾動觸發動畫系統
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('service-card') || entry.target.classList.contains('testimonial-card')) {
                        // 服務卡片和見證卡片的特殊動畫
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                        }, entry.target.dataset.delay || 0);
                    } else {
                        // 其他元素的通用動畫
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }
                }
            });
        }, observerOptions);
        
        // 服務卡片動畫
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.dataset.delay = index * 150;
            observer.observe(card);
        });
        
        // 客戶見證卡片動畫
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach((card, index) => {
            card.dataset.delay = index * 100;
            observer.observe(card);
        });
        
        // 其他元素動畫
        const otherElements = document.querySelectorAll('.victory-card, .knowledge-card, .firm-card, .about-text, .about-image');
        otherElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px) scale(0.95)';
            el.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
            observer.observe(el);
        });
        
        // 數字計數動畫
        const stats = document.querySelectorAll('.stat-number');
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    animateCounter(entry.target);
                }
            });
        }, observerOptions);
        
        stats.forEach(stat => {
            statObserver.observe(stat);
        });
    }
    
    // 初始化滾動動畫
    initScrollAnimations();
    
    // 初始高亮當前區塊
    highlightActiveNavLink();
    
    // 馬上諮詢功能
    window.openConsultModal = function(serviceType) {
        appointmentModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 預設選擇對應的服務類型
        const caseTypeSelect = document.getElementById('case-type');
        const serviceMapping = {
            '民事訴訟': 'civil',
            '刑事辯護': 'criminal', 
            '公司法務': 'corporate',
            '智慧財產權': 'ip',
            '房地產法律': 'real-estate',
            '家事法律': 'family'
        };
        
        if (serviceMapping[serviceType]) {
            caseTypeSelect.value = serviceMapping[serviceType];
        }
        
        // 在案件說明中預填服務類型
        const messageField = document.getElementById('message');
        messageField.placeholder = `您好，我想諮詢${serviceType}相關的法律問題...`;
        
        showNotification(`已為您選擇「${serviceType}」服務，請填寫詳細資訊`, 'info');
    };
    
    // 添加視差滾動效果
    function addParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            // 首頁背景視差效果
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.style.transform = `translateY(${rate * 0.3}px)`;
            }
            
            // 律師照片微動效果
            const lawyerPhotos = document.querySelectorAll('.lawyer-photo, .lawyer-photo-large');
            lawyerPhotos.forEach(photo => {
                const rect = photo.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                if (isVisible) {
                    const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;
                    photo.style.transform = `translateY(${scrollPercent * 10}px) scale(${1 + scrollPercent * 0.02})`;
                }
            });
        });
    }
    
    // 添加滑鼠跟隨效果
    function addMouseFollowEffects() {
        // 為服務卡片添加磁性效果
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - centerX) * 0.08;
                const deltaY = (e.clientY - centerY) * 0.08;
                
                card.style.transform = `translateY(-12px) scale(1.02) rotateX(${-deltaY * 0.1}deg) rotateY(${deltaX * 0.1}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    
    // 添加打字機效果
    function addTypingEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && !heroTitle.dataset.typed) {
            const originalText = heroTitle.textContent;
            heroTitle.textContent = '';
            heroTitle.dataset.typed = 'true';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < originalText.length) {
                    heroTitle.textContent += originalText.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 80);
        }
    }
    
    // 單個數字計數動畫
    function animateCounter(element) {
        const target = parseInt(element.dataset.count || element.textContent);
        const duration = 2000; // 2秒動畫
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        element.textContent = '0';
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
    
    // 添加頁面載入動畫
    function addPageLoadAnimation() {
        document.body.style.opacity = '0';
        document.body.style.transform = 'scale(1.05)';
        document.body.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
            document.body.style.transform = 'scale(1)';
            
            // 延遲執行打字機效果
            setTimeout(addTypingEffect, 500);
        }, 100);
    }
    
    // 初始化所有效果
    addParallaxEffects();
    addMouseFollowEffects();
    addPageLoadAnimation();
    
    // 載入完成提示
    console.log('🎉 張德謙律師事務所網站已載入完成 - 包含完整動畫效果');
});