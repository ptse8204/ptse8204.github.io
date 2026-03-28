document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("has-js");

  const header = document.querySelector(".site-header");
  const revealNodes = document.querySelectorAll("[data-reveal]");
  const roleCards = document.querySelectorAll(".role-card");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const homeHero = document.querySelector(".home-hero");
  const heroFigure = document.querySelector(".hero-figure");

  const syncHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 4);
  };

  const setRevealDelays = () => {
    const staggerGroups = [
      [".hero-evidence__item", 110],
      [".project-grid--featured .project-card", 95],
      [".project-grid--secondary .project-card", 70],
      [".archive-grid .archive-card", 75],
      [".role-card", 105],
    ];

    staggerGroups.forEach(([selector, step]) => {
      document.querySelectorAll(selector).forEach((node, index) => {
        node.style.setProperty("--reveal-delay", `${index * step}ms`);
      });
    });
  };

  const setupRoleActivity = () => {
    if (!roleCards.length || prefersReducedMotion) return;

    const roleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-active", entry.isIntersecting);
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-8% 0px -18% 0px",
      }
    );

    roleCards.forEach((card) => roleObserver.observe(card));
  };

  const setupHeroParallax = () => {
    if (!homeHero || !heroFigure || prefersReducedMotion) return;

    const resetHero = () => {
      heroFigure.style.removeProperty("transform");
    };

    homeHero.addEventListener("pointermove", (event) => {
      const rect = homeHero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const translateX = `${x * -14}px`;
      const translateY = `${y * -10}px`;
      const rotate = `${x * -1.2}deg`;
      heroFigure.style.transform = `translate3d(${translateX}, ${translateY}, 0) rotate(${rotate})`;
    });

    homeHero.addEventListener("pointerleave", resetHero);
  };

  setRevealDelays();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }

  setupRoleActivity();
  setupHeroParallax();
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
});
