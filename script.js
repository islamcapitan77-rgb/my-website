document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. خلفية حركية فاخرة (نجوم، شهب، وبرق)
    // ==========================================
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // إنشاء النجوم
        const stars = [];
        const numStars = 120;
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.8,
                alpha: Math.random(),
                speed: Math.random() * 0.02 + 0.005
            });
        }

        // شهاب متساقط
        let shootingStar = {
            x: 0,
            y: 0,
            length: 0,
            speed: 0,
            active: false
        };

        function resetShootingStar() {
            shootingStar.x = Math.random() * width;
            shootingStar.y = Math.random() * (height / 2);
            shootingStar.length = Math.random() * 80 + 40;
            shootingStar.speed = Math.random() * 10 + 6;
            shootingStar.active = true;
        }

        // وميض البرق
        let lightningAlpha = 0;

        function triggerLightning() {
            if (Math.random() < 0.008) { // احتمال حدوث البرق
                lightningAlpha = Math.random() * 0.3 + 0.1;
            }
        }

        // دورة الرسم
        function draw() {
            // خلفية سوداء عميقة مع تأثير وميض البرق
            ctx.fillStyle = `rgba(8, 8, 16, ${1 - lightningAlpha})`;
            ctx.fillRect(0, 0, width, height);

            if (lightningAlpha > 0) {
                ctx.fillStyle = `rgba(0, 255, 102, ${lightningAlpha})`;
                ctx.fillRect(0, 0, width, height);
                lightningAlpha *= 0.85; // اختفاء سريع للبرق
            }

            // رسم وتحديث النجوم
            ctx.fillStyle = "#00ff66";
            stars.forEach(star => {
                star.alpha += star.speed;
                if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
                
                ctx.globalAlpha = Math.abs(star.alpha);
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            // تحديث ورسم الشهاب
            if (shootingStar.active) {
                ctx.strokeStyle = '#00ff66';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(shootingStar.x, shootingStar.y);
                ctx.lineTo(shootingStar.x - shootingStar.length, shootingStar.y + shootingStar.length);
                ctx.stroke();

                shootingStar.x -= shootingStar.speed;
                shootingStar.y += shootingStar.speed;

                if (shootingStar.x < 0 || shootingStar.y > height) {
                    shootingStar.active = false;
                }
            } else if (Math.random() < 0.01) {
                resetShootingStar();
            }

            triggerLightning();
            requestAnimationFrame(draw);
        }

        draw();
    }

    // ==========================================
    // 2. حركة العدادات التفاعلية في الإحصائيات
    // ==========================================
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const startCounting = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(() => startCounting(counter), 25);
        } else {
            counter.innerText = target;
        }
    };

    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const countersInObserver = entry.target.querySelectorAll('.counter');
                countersInObserver.forEach(counter => startCounting(counter));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // ==========================================
    // 3. القائمة التفاعلية في الشاشات الصغيرة (الهواتف)
    // ==========================================
    const menuBtn = document.querySelector('.menu-btn');
    const navbar = document.querySelector('.navbar');

    if (menuBtn && navbar) {
        menuBtn.addEventListener('click', () => {
            if (navbar.style.display === 'flex') {
                navbar.style.display = 'none';
            } else {
                navbar.style.display = 'flex';
                navbar.style.flexDirection = 'column';
                navbar.style.position = 'absolute';
                navbar.style.top = '75px';
                navbar.style.right = '0';
                navbar.style.width = '100%';
                navbar.style.background = '#080810';
                navbar.style.padding = '20px';
                navbar.style.textAlign = 'center';
                navbar.style.borderBottom = '1px solid #00ff66';
            }
        });
    }
});