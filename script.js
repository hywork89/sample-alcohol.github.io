const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const globalNav = document.querySelector(".global-nav");
const revealItems = document.querySelectorAll(".reveal");
const typeTarget = document.querySelector(".type-target");
const backToTopBtn = document.querySelector(".back-to-top");
const hero = document.querySelector(".hero");
const scrollIndicator = document.querySelector(".scroll-indicator");
const introOverlay = document.getElementById("introOverlay");

/* =========================
   ヘッダーのスクロール制御
========================= */
function toggleHeaderScrolled() {
  if (!header) return;
  if (window.scrollY > 20) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
}

window.addEventListener("scroll", toggleHeaderScrolled, { passive: true });

/* =========================
   ハンバーガーメニュー
========================= */
if (navToggle && globalNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.classList.toggle("is-open");
    globalNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  globalNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("is-open");
      globalNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

/* =========================
   reveal
========================= */
if (revealItems.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((el) => revealObserver.observe(el));
}

/* =========================
   縦書きタイプ演出
========================= */
function getTypingDelay(char, index, total) {
  if (char === "、") return 220;
  if (char === "。") return 340;
  if (index < 3) return 180;
  if (index > total * 0.72) return 120;
  return 135;
}

function typeWriter(target) {
  if (!target) return;

  const sourceText = target.dataset.text || "";
  const chars = Array.from(sourceText);

  target.textContent = "";
  target.classList.add("is-typing");
  target.classList.remove("is-done");

  let index = 0;

  const writeNext = () => {
    const char = chars[index];

    if (char === undefined) {
      target.classList.remove("is-typing");
      target.classList.add("is-done");
      return;
    }

    const span = document.createElement("span");
    span.className = "typed-char";
    span.textContent = char;
    target.appendChild(span);

    requestAnimationFrame(() => {
      span.classList.add("is-visible");
    });

    index += 1;
    const delay = getTypingDelay(char, index, chars.length);
    window.setTimeout(writeNext, delay);
  };

  writeNext();
}

/* =========================
   TOPへ戻るボタン
========================= */
function toggleBackToTop() {
  if (!backToTopBtn) return;

  if (window.scrollY > 300) {
    backToTopBtn.classList.add("show", "is-visible");
  } else {
    backToTopBtn.classList.remove("show", "is-visible");
  }
}

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/* =========================
   FV 和柄パララックス
========================= */
function updateHeroParallax() {
  if (!hero) return;

  const scrollY = window.scrollY || window.pageYOffset;
  const heroHeight = hero.offsetHeight || 1;
  const progress = Math.min(scrollY / heroHeight, 1);

  const patternY = progress * 24;
  const lightY = progress * 12;

  hero.style.setProperty("--fv-pattern-y", `${patternY}px`);
  hero.style.setProperty("--fv-light-y", `${lightY}px`);

  if (scrollIndicator) {
    const opacity = Math.max(1 - progress * 1.15, 0);
    scrollIndicator.style.opacity = String(opacity);
  }
}

/* =========================
   SPイントロ
   - SPのみ
   - 初回もリロードも毎回表示
========================= */
function runIntroOverlay() {
  if (!introOverlay) return;

  const isMobile = window.innerWidth <= 768;

  if (!isMobile) {
    introOverlay.style.display = "none";
    return;
  }

  introOverlay.classList.remove("fade-out", "show");
  introOverlay.classList.add("active");
  introOverlay.style.display = "flex";

  window.setTimeout(() => {
    introOverlay.classList.add("show");
  }, 50);

  window.setTimeout(() => {
    introOverlay.classList.add("fade-out");
  }, 1800);

  window.setTimeout(() => {
    introOverlay.style.display = "none";
  }, 2800);
}

/* =========================
   初期実行
========================= */
document.addEventListener("DOMContentLoaded", () => {
  toggleHeaderScrolled();
  toggleBackToTop();
  updateHeroParallax();
  runIntroOverlay();
});

window.addEventListener("load", () => {
  window.setTimeout(() => {
    typeWriter(typeTarget);
  }, 900);
});

window.addEventListener("scroll", () => {
  toggleBackToTop();
  updateHeroParallax();
}, { passive: true });

window.addEventListener("resize", () => {
  updateHeroParallax();

  if (introOverlay && window.innerWidth > 768) {
    introOverlay.style.display = "none";
  }
});