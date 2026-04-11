const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const globalNav = document.querySelector(".global-nav");
const revealItems = document.querySelectorAll(".reveal");
const typeTarget = document.querySelector(".type-target");

window.addEventListener("scroll", () => {
  if (!header) return;
  if (window.scrollY > 20) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
});

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

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealItems.forEach((el) => revealObserver.observe(el));

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

window.addEventListener("load", () => {
  window.setTimeout(() => {
    typeWriter(typeTarget);
  }, 900);
});
const backToTopBtn = document.querySelector(".back-to-top");

if (backToTopBtn) {
  const toggleBackToTop = () => {
    if (window.scrollY > 420) {
      backToTopBtn.classList.add("is-visible");
    } else {
      backToTopBtn.classList.remove("is-visible");
    }
  };

  window.addEventListener("scroll", toggleBackToTop);
  toggleBackToTop();

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

const hero = document.querySelector(".hero");

function updateHeroParallax() {
  if (!hero) return;

  const scrollY = window.scrollY || window.pageYOffset;
  const heroHeight = hero.offsetHeight || 1;

  // FVの範囲内だけ効かせる
  const progress = Math.min(scrollY / heroHeight, 1);

  // 和柄はほんの少しだけ下へ流す
  const patternY = progress * 24;

  // 光はさらに控えめ
  const lightY = progress * 12;

  hero.style.setProperty("--fv-pattern-y", `${patternY}px`);
  hero.style.setProperty("--fv-light-y", `${lightY}px`);

  // Scroll表示は下に行くほど少し薄くする
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    const opacity = Math.max(1 - progress * 1.15, 0);
    scrollIndicator.style.opacity = String(opacity);
  }
}

window.addEventListener("scroll", updateHeroParallax, { passive: true });
window.addEventListener("load", updateHeroParallax);
window.addEventListener("resize", updateHeroParallax);

/* =========================
   Custom Cursor
========================= */

const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const hoverTargets = document.querySelectorAll("a, button, .btn, .back-to-top");

if (cursorDot && cursorRing && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let ringX = mouseX;
  let ringY = mouseY;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

    document.body.classList.add("cursor-active");
  });

  document.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-active");
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;

    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorRing.classList.add("is-hover");
    });

    el.addEventListener("mouseleave", () => {
      cursorRing.classList.remove("is-hover");
    });
  });
}