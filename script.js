// ============================================================
// Birthday website interactions
// ============================================================

// ---- Personalize the name from #config ----
(function setName() {
  const cfg = document.getElementById("config");
  const name = (cfg && cfg.dataset.name) || "My Love";
  const el = document.getElementById("heroName");
  if (el) el.textContent = name;
  document.title = "Happy Birthday " + name + "! 🎂";
})();

// ---- Floating hearts / balloons ----
(function floaties() {
  const container = document.querySelector(".floaties");
  if (!container) return;
  const emojis = ["💕", "💖", "🎈", "💗", "🌸", "✨", "🎀"];
  const COUNT = 22;
  for (let i = 0; i < COUNT; i++) {
    const s = document.createElement("span");
    s.className = "floaty";
    s.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    s.style.left = Math.random() * 100 + "vw";
    s.style.fontSize = 16 + Math.random() * 26 + "px";
    s.style.animationDuration = 8 + Math.random() * 12 + "s";
    s.style.animationDelay = Math.random() * 12 + "s";
    container.appendChild(s);
  }
})();

// ---- Reveal sections on scroll ----
(function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
})();

// ---- Slideshow ----
(function slideshow() {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("dots");
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");
  if (!slides.length) return;

  let idx = 0;
  let timer = null;

  slides.forEach((_, i) => {
    const d = document.createElement("span");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.addEventListener("click", () => go(i));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.children);

  function show(n) {
    slides.forEach((s, i) => s.classList.toggle("active", i === n));
    dots.forEach((d, i) => d.classList.toggle("active", i === n));
  }
  function go(n) {
    idx = (n + slides.length) % slides.length;
    show(idx);
    restart();
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(idx + 1), 5500);
  }

  show(0);
  restart();
  prev.addEventListener("click", () => go(idx - 1));
  next.addEventListener("click", () => go(idx + 1));
})();

// ---- Music toggle ----
(function music() {
  const btn = document.getElementById("musicToggle");
  const audio = document.getElementById("bgMusic");
  if (!btn || !audio) return;
  let playing = false;
  btn.addEventListener("click", () => {
    if (playing) {
      audio.pause();
      btn.textContent = "🔇";
    } else {
      audio.play().then(() => {
        btn.textContent = "🎵";
      }).catch(() => {
        btn.textContent = "🔇";
        alert("Add a song file at music/song.mp3 to enable music 🎶");
      });
    }
    playing = !playing;
  });
})();

// ---- Confetti ----
const Confetti = (function () {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  let pieces = [];
  let animId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const colors = ["#ff5c8a", "#ffd166", "#06d6a0", "#118ab2", "#ef476f", "#ffb3c6"];

  function burst(amount) {
    for (let i = 0; i < amount; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20,
        w: 6 + Math.random() * 8,
        h: 8 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: -3 + Math.random() * 6,
        vy: 2 + Math.random() * 4,
        rot: Math.random() * 360,
        vr: -6 + Math.random() * 12,
      });
    }
    if (!animId) loop();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    pieces = pieces.filter((p) => p.y < canvas.height + 30);
    if (pieces.length) {
      animId = requestAnimationFrame(loop);
    } else {
      animId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return { burst };
})();

// Confetti on load + on button tap
window.addEventListener("load", () => Confetti.burst(120));
const confettiBtn = document.getElementById("confettiBtn");
if (confettiBtn) confettiBtn.addEventListener("click", () => Confetti.burst(160));
