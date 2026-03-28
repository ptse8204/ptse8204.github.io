document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("has-js");

  const header = document.querySelector(".site-header");
  const revealNodes = document.querySelectorAll("[data-reveal]");
  const roleCards = document.querySelectorAll(".role-card");
  const ambientNodes = document.querySelectorAll(".brief-panel, .frame-card, .surface-card, .archive-card, .hero-figure__frame");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHoverPrecisely = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const homeHero = document.querySelector(".home-hero");
  const heroFigure = document.querySelector(".hero-figure");
  const heroDepthLayers = homeHero ? homeHero.querySelectorAll("[data-parallax]") : [];

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

  const setupSurfaceActivity = () => {
    if (prefersReducedMotion) return;

    const activeNodes = document.querySelectorAll(".brief-panel, .frame-card, .surface-card, .archive-card");
    if (!activeNodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-active", entry.isIntersecting);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    activeNodes.forEach((node) => observer.observe(node));
  };

  const setupAmbientTracking = () => {
    if (!ambientNodes.length || prefersReducedMotion || !canHoverPrecisely) return;

    ambientNodes.forEach((node) => {
      node.addEventListener("pointermove", (event) => {
        const rect = node.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        node.style.setProperty("--ambient-x", `${x}%`);
        node.style.setProperty("--ambient-y", `${y}%`);
      });

      node.addEventListener("pointerleave", () => {
        node.style.removeProperty("--ambient-x");
        node.style.removeProperty("--ambient-y");
      });
    });
  };

  const setupHeroParallax = () => {
    if (!homeHero || !heroFigure || prefersReducedMotion || !canHoverPrecisely) return;

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId = null;

    const frame = homeHero.querySelector(".hero-figure__frame");

    const render = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      heroFigure.style.transform = `translate3d(${currentX * -0.9}px, ${currentY * -0.75}px, 0) rotate(${currentX * -0.08}deg)`;

      heroDepthLayers.forEach((layer) => {
        const depth = Number(layer.getAttribute("data-parallax")) || 0;
        layer.style.transform = `translate3d(${currentX * depth}px, ${currentY * depth}px, 0)`;
      });

      if (frame) {
        frame.style.setProperty("--ambient-x", `${50 + currentX * 1.35}%`);
        frame.style.setProperty("--ambient-y", `${50 + currentY * 1.35}%`);
      }

      if (Math.abs(targetX - currentX) < 0.08 && Math.abs(targetY - currentY) < 0.08) {
        rafId = null;
        return;
      }

      rafId = window.requestAnimationFrame(render);
    };

    const queueRender = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(render);
    };

    const resetHero = () => {
      targetX = 0;
      targetY = 0;
      queueRender();
    };

    homeHero.addEventListener("pointermove", (event) => {
      const rect = homeHero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 18;
      targetY = y * 14;
      queueRender();
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
  setupSurfaceActivity();
  setupAmbientTracking();
  setupHeroParallax();
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
});
