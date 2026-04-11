const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const globalNav = document.querySelector(".global-nav");
const revealItems = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
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
  });

  globalNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("is-open");
      globalNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealItems.forEach((item) => observer.observe(item));