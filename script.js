// Canvas animated stars background
(function () {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let width = 0, height = 0, deviceRatio = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    width = canvas.clientWidth = window.innerWidth;
    height = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(width * deviceRatio);
    canvas.height = Math.floor(height * deviceRatio);
    ctx.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
    initStars();
  }

  function initStars() {
    const area = width * height;
    const density = 0.00012; // stars per px
    const targetCount = Math.min(500, Math.floor(area * density));
    stars = new Array(targetCount).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.6 + 0.4,
      r: Math.random() * 1.6 + 0.2,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      tw: Math.random() * 2 * Math.PI,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    // subtle gradient
    const g = ctx.createRadialGradient(width * 0.7, height * 0.1, 0, width * 0.7, height * 0.1, Math.max(width, height));
    g.addColorStop(0, 'rgba(10,20,45,0.7)');
    g.addColorStop(1, 'rgba(7,11,20,0.7)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    for (const s of stars) {
      s.x += s.vx * s.z;
      s.y += s.vy * s.z;
      if (s.x < -10) s.x = width + 10; else if (s.x > width + 10) s.x = -10;
      if (s.y < -10) s.y = height + 10; else if (s.y > height + 10) s.y = -10;

      const alpha = 0.6 + Math.sin(s.tw += 0.02) * 0.3;
      ctx.beginPath();
      ctx.fillStyle = `rgba(83,243,255,${alpha})`;
      ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
      ctx.fill();
    }

    // draw connecting lines for near stars
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < i + 40 && j < stars.length; j++) {
        const a = stars[i], b = stars[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 110 * 110) {
          const alpha = 0.08 * (1 - dist2 / (110 * 110));
          ctx.strokeStyle = `rgba(154,77,255,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

// Slides navigation and transitions
(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const indicators = Array.from(document.querySelectorAll('#slide-indicators li'));
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let current = 0;
  let isAnimating = false;

  function setActive(index) {
    if (index === current || isAnimating) return;
    isAnimating = true;
    const from = slides[current];
    const to = slides[index];
    from.classList.remove('active');
    from.classList.add('exiting');
    to.classList.add('active');
    indicators[current]?.removeAttribute('aria-current');
    indicators[index]?.setAttribute('aria-current', 'true');
    current = index;
    setTimeout(() => { from.classList.remove('exiting'); isAnimating = false; }, 620);
  }

  function next() { setActive((current + 1) % slides.length); }
  function prev() { setActive((current - 1 + slides.length) % slides.length); }

  // Wheel / touch / keys
  let wheelTimeout = 0;
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - wheelTimeout < 650) return;
    wheelTimeout = now;
    if (e.deltaY > 0) next(); else prev();
  }, { passive: false });

  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', (e) => {
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dy) > 40) { if (dy < 0) next(); else prev(); }
  }, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') next();
    if (e.key === 'ArrowUp' || e.key === 'PageUp') prev();
  });

  // Indicator click
  indicators.forEach((dot, i) => dot.addEventListener('click', () => setActive(i)));

  // Buttons
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Anchor links inside slides (e.g., Contact Me)
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const idx = slides.findIndex((s) => s.id === id);
      if (idx !== -1) { e.preventDefault(); setActive(idx); }
    });
  });
})();

// Typewriter effect for hero name
(function () {
  const el = document.getElementById('typewriter-name');
  if (!el) return;
  const text = el.dataset.text || el.textContent || '';
  el.textContent = '';
  let i = 0;
  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      const delay = i < text.length ? 70 : 0;
      setTimeout(type, delay);
    }
  }
  setTimeout(type, 350);
})();


