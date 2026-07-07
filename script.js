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
  const items = document.querySelectorAll(".reveal, .story-item");
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


// ============================================================
// Countdown gate: live timer, daily surprises, auto-unlock
// ============================================================
(function gate() {
  const cfg = document.getElementById("config");
  const gateEl = document.getElementById("gate");
  if (!cfg || !gateEl) return;

  // 🔓 Secret preview: add ?preview to the URL (or #preview) to skip the
  // countdown and view the full site. Great for checking things before the day.
  const isPreview = /[?&]preview\b/i.test(location.search) ||
                    location.hash.toLowerCase() === "#preview";
  if (isPreview) {
    document.body.classList.remove("gate-active");
    gateEl.style.display = "none";
    return;
  }

  // Birthday target (local midnight). Change data-birthday in index.html.
  const birthday = new Date((cfg.dataset.birthday || "2026-07-12") + "T00:00:00");
  const name = cfg.dataset.name || "My Love";
  const gn = document.getElementById("gateName");
  if (gn) gn.textContent = name;

  const elDays = document.getElementById("cd-days");
  const elHours = document.getElementById("cd-hours");
  const elMins = document.getElementById("cd-mins");
  const elSecs = document.getElementById("cd-secs");
  const gateMsg = document.getElementById("gateMsg");

  const messages = [
    "Something special is coming 💕",
    "Can't wait to celebrate you 🥳",
    "Counting every second, my love ⏳",
    "A surprise made just for you 🎁",
  ];
  let msgIdx = 0;

  // Daily surprises, keyed by how many days before the birthday they unlock.
  // ✏️ CUSTOMIZE these little messages if you like!
  const surprises = [
    { day: 5, emoji: "💌", text: "5 days to go! Just had to say — you make my whole world brighter every single day. 💕" },
    { day: 4, emoji: "🌸", text: "4 days! Did you know your smile is my favorite thing in the entire world?" },
    { day: 3, emoji: "⭐", text: "3 days! I keep thinking about how incredibly lucky I am to have you in my life." },
    { day: 2, emoji: "💞", text: "2 days! Almost time to celebrate the most amazing person I know — you." },
    { day: 1, emoji: "🎈", text: "1 more sleep! Get ready... tomorrow is ALL about you, my love. 💝" },
  ];

  function unlockDateFor(daysBefore) {
    const d = new Date(birthday);
    d.setDate(d.getDate() - daysBefore);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function pad(n) { return String(n).padStart(2, "0"); }

  let unlocked = false;
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    document.body.classList.remove("gate-active");
    gateEl.classList.add("hidden");
    if (typeof Confetti !== "undefined") {
      Confetti.burst(220);
      setTimeout(() => Confetti.burst(180), 600);
    }
  }

  function tick() {
    const now = new Date();
    const diff = birthday - now;
    if (diff <= 0) {
      unlock();
      return true;
    }
    elDays.textContent = pad(Math.floor(diff / 86400000));
    elHours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    elMins.textContent = pad(Math.floor((diff % 3600000) / 60000));
    elSecs.textContent = pad(Math.floor((diff % 60000) / 1000));
    return false;
  }

  // Surprise cards + popup
  const row = document.getElementById("surpriseRow");
  const popup = document.getElementById("surprisePopup");
  const popupText = document.getElementById("surprisePopupText");

  function renderSurprises() {
    if (!row) return;
    const now = new Date();
    row.innerHTML = "";
    surprises.forEach((s) => {
      const isOpen = now >= unlockDateFor(s.day);
      const card = document.createElement("button");
      card.className = "surprise-card " + (isOpen ? "unlocked" : "locked");
      card.innerHTML =
        '<span class="surprise-emoji">' + (isOpen ? s.emoji : "🔒") + "</span>" +
        '<span class="surprise-day">Day ' + s.day + "</span>";
      card.addEventListener("click", () => {
        if (!popup || !popupText) return;
        if (isOpen) {
          popupText.textContent = s.text;
        } else {
          const d = unlockDateFor(s.day);
          const when = d.toLocaleDateString(undefined, { month: "long", day: "numeric" });
          popupText.textContent = "This surprise unlocks on " + when + ". Come back then! 💗";
        }
        popup.classList.add("show");
      });
      row.appendChild(card);
    });
  }

  if (popup) {
    popup.addEventListener("click", (e) => {
      if (e.target === popup || e.target.classList.contains("popup-close")) {
        popup.classList.remove("show");
      }
    });
  }

  // Init
  if (tick()) return; // already the birthday -> unlock immediately
  renderSurprises();
  setInterval(tick, 1000);
  setInterval(() => {
    msgIdx = (msgIdx + 1) % messages.length;
    if (gateMsg) gateMsg.textContent = messages[msgIdx];
  }, 3500);
})();
