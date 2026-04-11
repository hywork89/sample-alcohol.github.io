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

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("introOverlay");

  // SP判定
  const isSP = window.innerWidth <= 768;

  // 初回判定
  const isFirstVisit = !sessionStorage.getItem("visited");

  if (!isSP || !isFirstVisit) {
    if (overlay) overlay.style.display = "none";
    return;
  }

  // 初回フラグ保存
  sessionStorage.setItem("visited", "true");

  // 3秒後にフェードアウト
  setTimeout(() => {
    overlay.classList.add("hide");
  }, 3000);

  // 4秒後に完全削除
  setTimeout(() => {
    overlay.style.display = "none";
  }, 4000);
});
// =========================
// 初回イントロ（SPのみ）
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("introOverlay");

  if (!overlay) return;

  const isMobile = window.innerWidth <= 768;
  const hasSeen = sessionStorage.getItem("introShown");

  if (isMobile && !hasSeen) {
    overlay.classList.add("active");

    setTimeout(() => {
      overlay.classList.add("show");
    }, 50);

    setTimeout(() => {
      overlay.classList.add("fade-out");
      sessionStorage.setItem("introShown", "true");
    }, 2000);

    setTimeout(() => {
      overlay.style.display = "none";
    }, 3000);
  } else {
    overlay.style.display = "none";
  }
});


// =========================
// TOPボタン
// =========================
const btn = document.querySelector(".back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
});

btn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});


// =========================
// 軽いパララックス（和柄）
/* heroに style="--fv-pattern-y" が入ってる前提 */
// =========================
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const y = window.scrollY * 0.15;
  hero.style.setProperty("--fv-pattern-y", `${y}px`);
});