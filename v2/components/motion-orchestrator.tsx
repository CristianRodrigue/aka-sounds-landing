"use client";

import { useEffect } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type MotionOrchestratorProps = {
  reversible?: boolean;
};

export function MotionOrchestrator({ reversible = false }: MotionOrchestratorProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const productPage = document.querySelector(".product-v2-page");
    if (productPage && window.location.hash) {
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      const target = document.getElementById(targetId);
      if (target) {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
          });
        });
      }
    }
    const updateNavState = () => {
      root.classList.toggle("nav-scrolled", window.scrollY > 18);
    };
    updateNavState();
    window.addEventListener("scroll", updateNavState, { passive: true });

    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-motion-reveal]"));
    revealNodes.forEach((node) => {
      const delay = node.dataset.motionDelay;
      if (delay) node.style.setProperty("--motion-delay", `${delay}ms`);
    });

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-in-view"));
    }

    let revealDirectionRaf = 0;
    const updateRevealExitDirection = () => {
      revealDirectionRaf = 0;
      if (!reversible || reducedMotion.matches) return;
      const aboveBoundary = window.innerHeight * 0.16;
      revealNodes.forEach((node) => {
        if (!node.classList.contains("is-in-view") && node.getBoundingClientRect().bottom <= aboveBoundary) {
          node.setAttribute("data-motion-exit", "above");
        } else if (node.getBoundingClientRect().bottom > aboveBoundary) {
          node.removeAttribute("data-motion-exit");
        }
      });
    };
    const requestRevealDirection = () => {
      if (!revealDirectionRaf) revealDirectionRaf = window.requestAnimationFrame(updateRevealExitDirection);
    };

    const observer = reducedMotion.matches || !("IntersectionObserver" in window)
      ? null
      : new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const node = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              node.removeAttribute("data-motion-exit");
              node.classList.add("is-in-view");
              if (!reversible) observer?.unobserve(node);
              return;
            }

            if (!reversible) return;
            node.classList.remove("is-in-view");
            if (entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? 0)) {
              node.setAttribute("data-motion-exit", "above");
            } else {
              node.removeAttribute("data-motion-exit");
            }
          });
        }, reversible
          ? { threshold: 0.14, rootMargin: "-16% 0px 8% 0px" }
          : { threshold: 0.14, rootMargin: "0px 0px -6%" });

    revealNodes.forEach((node) => observer?.observe(node));
    if (reversible && !reducedMotion.matches) {
      window.addEventListener("scroll", requestRevealDirection, { passive: true });
      window.addEventListener("resize", requestRevealDirection, { passive: true });
      requestRevealDirection();
    }

    const rail = document.querySelector<HTMLElement>(".free-h1-rail");
    const progressTrack = document.querySelector<HTMLElement>(".free-h1-progress-track");
    const progressPosition = document.querySelector<HTMLElement>(".free-h1-progress-position");
    const previousRailButton = document.querySelector<HTMLButtonElement>("[data-free-rail-prev]");
    const nextRailButton = document.querySelector<HTMLButtonElement>("[data-free-rail-next]");
    let dragging = false;
    let dragMoved = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    const getRailStep = () => {
      if (!rail) return 0;
      const product = rail.querySelector<HTMLElement>(".free-h1-product");
      if (!product) return rail.clientWidth;
      const railStyles = window.getComputedStyle(rail);
      const gap = parseFloat(railStyles.columnGap || railStyles.gap || "0") || 0;
      return product.getBoundingClientRect().width + gap;
    };

    const scrollRailByStep = (direction: -1 | 1) => {
      if (!rail) return;
      rail.scrollBy({
        left: direction * getRailStep(),
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    };

    const updateProgress = () => {
      if (!rail) return;
      const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const ratio = maxScroll ? rail.scrollLeft / maxScroll : 0;
      if (progressTrack && progressPosition) {
        const travel = Math.max(0, progressTrack.clientWidth - progressPosition.clientWidth);
        progressPosition.style.setProperty("--rail-progress-x", `${ratio * travel}px`);
        progressPosition.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
      }
      if (previousRailButton) previousRailButton.disabled = maxScroll <= 1 || rail.scrollLeft <= 1;
      if (nextRailButton) nextRailButton.disabled = maxScroll <= 1 || rail.scrollLeft >= maxScroll - 1;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!rail || (event.pointerType === "mouse" && event.button !== 0)) return;
      const target = event.target;
      if (target instanceof Element && target.closest("button, a, input, textarea, select")) return;
      dragging = true;
      dragMoved = false;
      dragStartX = event.clientX;
      dragStartScroll = rail.scrollLeft;
      rail.classList.add("is-dragging");
      rail.setPointerCapture?.(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!rail || !dragging) return;
      const delta = event.clientX - dragStartX;
      if (Math.abs(delta) > 4) dragMoved = true;
      if (!dragMoved) return;
      event.preventDefault();
      rail.scrollLeft = dragStartScroll - delta;
    };

    const stopDragging = (event: PointerEvent) => {
      if (!rail || !dragging) return;
      dragging = false;
      rail.classList.remove("is-dragging");
      rail.releasePointerCapture?.(event.pointerId);
    };

    const onWheel = (event: WheelEvent) => {
      if (!rail || Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 1) return;
      event.preventDefault();
      rail.scrollLeft += event.deltaX;
    };

    rail?.addEventListener("pointerdown", onPointerDown);
    rail?.addEventListener("pointermove", onPointerMove);
    rail?.addEventListener("pointerup", stopDragging);
    rail?.addEventListener("pointercancel", stopDragging);
    rail?.addEventListener("wheel", onWheel, { passive: false });
    rail?.addEventListener("scroll", updateProgress, { passive: true });
    const onPreviousRail = () => scrollRailByStep(-1);
    const onNextRail = () => scrollRailByStep(1);
    previousRailButton?.addEventListener("click", onPreviousRail);
    nextRailButton?.addEventListener("click", onNextRail);
    updateProgress();

    const heroVideo = document.querySelector<HTMLElement>(".hero-video-section");
    const heroScrollFadeNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-hero-scroll-fade]"));
    let heroFadeRaf = 0;
    const updateHeroVideoFade = () => {
      heroFadeRaf = 0;
      if (!heroVideo || reducedMotion.matches) return;
      const progress = clamp((-heroVideo.getBoundingClientRect().top) / Math.max(1, window.innerHeight * 0.78), 0, 1);
      const opacity = 1 - progress * 1.15;
      const offset = progress * -42;
      heroScrollFadeNodes.forEach((node) => {
        node.style.setProperty("--hero-video-opacity", String(Math.max(0, opacity)));
        node.style.setProperty("--hero-video-y", String(offset) + "px");
      });
    };
    const requestHeroVideoFade = () => {
      if (!heroFadeRaf) heroFadeRaf = window.requestAnimationFrame(updateHeroVideoFade);
    };
    if (heroVideo && reducedMotion.matches) {
      heroScrollFadeNodes.forEach((node) => {
        node.style.setProperty("--hero-video-opacity", "1");
        node.style.setProperty("--hero-video-y", "0px");
      });
    }
    window.addEventListener("scroll", requestHeroVideoFade, { passive: true });
    window.addEventListener("resize", requestHeroVideoFade, { passive: true });
    requestHeroVideoFade();

    const parallaxNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-motion-parallax]"));
    let raf = 0;
    const updateParallax = () => {
      raf = 0;
      if (reducedMotion.matches) return;
      parallaxNodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const centerOffset = window.innerHeight / 2 - (rect.top + rect.height / 2);
        node.style.setProperty("--motion-parallax-y", `${clamp(centerOffset * 0.012, -8, 8)}px`);
      });
    };
    const requestParallax = () => {
      if (!raf) raf = window.requestAnimationFrame(updateParallax);
    };

    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax, { passive: true });
    requestParallax();

    return () => {
      observer?.disconnect();
      root.classList.remove("motion-ready");
      root.classList.remove("nav-scrolled");
      window.removeEventListener("scroll", updateNavState);
      window.removeEventListener("scroll", requestRevealDirection);
      window.removeEventListener("resize", requestRevealDirection);
      if (revealDirectionRaf) window.cancelAnimationFrame(revealDirectionRaf);
      rail?.removeEventListener("pointerdown", onPointerDown);
      rail?.removeEventListener("pointermove", onPointerMove);
      rail?.removeEventListener("pointerup", stopDragging);
      rail?.removeEventListener("pointercancel", stopDragging);
      rail?.removeEventListener("wheel", onWheel);
      rail?.removeEventListener("scroll", updateProgress);
      previousRailButton?.removeEventListener("click", onPreviousRail);
      nextRailButton?.removeEventListener("click", onNextRail);
      window.removeEventListener("scroll", requestHeroVideoFade);
      window.removeEventListener("resize", requestHeroVideoFade);
      if (heroFadeRaf) window.cancelAnimationFrame(heroFadeRaf);
      window.removeEventListener("scroll", requestParallax);
      window.removeEventListener("resize", requestParallax);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}