document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. خلفية شبكة عصبية تفاعلية (Neural Network Constellation)
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

        // متابعة حركة الماوس لتفاعل العقد
        const mouse = {
            x: null,
            y: null,
            radius: 150
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // إنشاء العقد (Nodes)
        const particles = [];
        const particleCount = Math.floor((width * height) / 10000); // إعداد عدد العقد حسب حجم الشاشة

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.2; // السرعة الأفقية
                this.vy = (Math.random() - 0.5) * 1.2; // السرعة الرأسية
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                // تحريك العقد
                this.x += this.vx;
                this.y += this.vy;

                // الارتداد عند حواف الشاشة
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // التفاعل مع الماوس
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const angle = Math.atan2(dy, dx);
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= Math.cos(angle) * force * 3;
                        this.y -= Math.sin(angle) * force * 3;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = "#00ff66";
                ctx.shadowBlur = 8;
                ctx.shadowColor = "#00ff66";
                ctx.fill();
                ctx.shadowBlur = 0; // إعادة ضبط التظليل للأداء
            }
        }

        // تهيئة العقد
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // توصيل العقد بخطوط النيون العصبية
        function connect() {
            const maxDistance = 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = 1 - (distance / maxDistance);
                        ctx.strokeStyle = `rgba(0, 255, 102, ${opacity * 0.4})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // دورة التحريك الرئيسية
        function animate() {
            ctx.fillStyle = "#080810";
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            connect();
            requestAnimationFrame(animate);
        }

        animate();
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
