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