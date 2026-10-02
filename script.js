const nav = document.getElementById("nav");
const navMenu = document.getElementById("navMenu");
const navToggle = document.getElementById("navToggle");
const toTop = document.getElementById("toTop");
const navLinks = document.querySelectorAll(".nav__link");
const sections = document.querySelectorAll("main section[id]");

// ---------- Intro loader ----------
const loader = document.getElementById("loader");
const loaderStatus = document.getElementById("loaderStatus");
document.body.classList.add("loading");
setTimeout(() => (loaderStatus.textContent = "Profil ditemukan"), 650);
setTimeout(() => {
  loader.classList.add("done");
  document.body.classList.remove("loading");
  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("visible"), 120 * i);
  });
  countUp();
}, 1250);
setTimeout(() => loader.remove(), 2100);

// ---------- Smooth scroll untuk semua tombol [data-link] ----------
// Link ke #home selalu kembali ke paling atas halaman.
document.querySelectorAll("[data-link]").forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (!id || !id.startsWith("#")) return;
    e.preventDefault();

    if (id === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    }

    history.replaceState(null, "", id);
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
  });
});

// ---------- Menu mobile ----------
navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  navToggle.classList.toggle("open");
});

// ---------- Navbar, back-to-top, link aktif ----------
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 20);
  toTop.classList.toggle("show", y > 600);

  let current = "home";
  sections.forEach((sec) => {
    if (y >= sec.offsetTop - window.innerHeight / 3) current = sec.id;
  });
  if (window.innerHeight + y >= document.body.scrollHeight - 4) {
    current = sections[sections.length - 1].id;
  }
  navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${current}`));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Typing role ----------
const roles = ["Web Developer", "Front-End Dev", "UI Enthusiast", "Problem Solver"];
const typed = document.getElementById("typed");
let roleIdx = 0, charIdx = roles[0].length, deleting = true;
function typeLoop() {
  const word = roles[roleIdx];
  charIdx += deleting ? -1 : 1;
  typed.textContent = word.slice(0, charIdx);

  let delay = deleting ? 45 : 90;
  if (!deleting && charIdx === word.length) { deleting = true; delay = 1800; }
  else if (deleting && charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 300; }
  setTimeout(typeLoop, delay);
}
setTimeout(typeLoop, 3000);

// ---------- Counter angka di hero ----------
function countUp() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = +el.dataset.count;
    let n = 0;
    if (target === 0) return;
    const step = () => {
      n++;
      el.textContent = n;
      if (n < target) setTimeout(step, 900 / target);
    };
    step();
  });
}

// ---------- Skill bar bersegmen ----------
document.querySelectorAll(".skill__seg").forEach((seg) => {
  seg.innerHTML = "<i></i>".repeat(10);
});

// ---------- Reveal saat di-scroll ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll(".skill").forEach((skill) => {
        const level = +skill.dataset.level;
        skill.querySelectorAll(".skill__seg i").forEach((bar, i) => {
          if (i < level) setTimeout(() => {
            bar.classList.add("on");
            if (i === level - 1) bar.classList.add("tip");
          }, 60 * i);
        });
      });
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => {
  if (!el.closest(".hero")) observer.observe(el);
});

// ---------- Filter portofolio ----------
const filterBtns = document.querySelectorAll(".filter");
const works = document.querySelectorAll(".work");
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    works.forEach((w) => {
      const show = f === "all" || w.dataset.cat === f;
      w.classList.toggle("hide", !show);
      if (show) w.classList.add("visible");
    });
  });
});

// ---------- Lightbox screenshot project ----------
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbTitle = document.getElementById("lbTitle");
const lbCount = document.getElementById("lbCount");
let lbShots = [], lbIdx = 0, lbName = "";

function showShot() {
  lbImg.src = lbShots[lbIdx];
  lbImg.alt = `${lbName} — screenshot ${lbIdx + 1}`;
  lbTitle.textContent = lbName;
  lbCount.textContent = `${String(lbIdx + 1).padStart(2, "0")} / ${String(lbShots.length).padStart(2, "0")}`;
}
function openLightbox(shots, name) {
  lbShots = shots; lbIdx = 0; lbName = name;
  lightbox.classList.toggle("single", shots.length < 2);
  showShot();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}
function stepShot(dir) {
  lbIdx = (lbIdx + dir + lbShots.length) % lbShots.length;
  showShot();
}

document.querySelectorAll(".mission__thumb[data-gallery]").forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const shots = thumb.dataset.gallery.split(",").map((s) => s.trim()).filter(Boolean);
    openLightbox(shots, thumb.dataset.title || "");
  });
});
document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => stepShot(-1));
document.getElementById("lbNext").addEventListener("click", () => stepShot(1));
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepShot(-1);
  if (e.key === "ArrowRight") stepShot(1);
});

// ---------- Form kontak: buka aplikasi email ----------
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const subject = encodeURIComponent(`Pesan dari ${data.get("name")}`);
  const body = encodeURIComponent(`${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`);
  window.location.href = `mailto:email@kamu.com?subject=${subject}&body=${body}`;
});

document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Back-to-top berganti warna di section merah ----------
const contactSec = document.getElementById("contact");
function toTopColor() {
  const r = contactSec.getBoundingClientRect();
  const btnY = window.innerHeight - 50;
  toTop.classList.toggle("on-red", r.top < btnY && r.bottom > btnY);
}
window.addEventListener("scroll", toTopColor, { passive: true });
toTopColor();
