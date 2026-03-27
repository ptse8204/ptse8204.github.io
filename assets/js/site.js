document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("has-js");

  const header = document.querySelector(".site-header");
  const revealNodes = document.querySelectorAll("[data-reveal]");

  const syncHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 4);
  };

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

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
});
