/* =========================================================
   Evolute Soluções Digitais — scripts
   ========================================================= */

/* ---------- CONFIGURAÇÃO DE CONTATO ----------
   Edite aqui os dados de contato. Todos os botões do site usam estes valores.
   - whatsapp: formato internacional, só dígitos (55 + DDD + número)
   - instagram: o @ do perfil, sem o "@" */
const CONTACT = {
  whatsapp: "5500000000000",
  whatsappLabel: "(00) 00000-0000",
  instagram: "seuperfil",
  email: "contato@seudominio.com.br",
  emailSubject: "Agendar reunião com a Evolute",
  defaultMessage: "Olá! Conheci a Evolute pelo site e gostaria de conversar sobre um projeto."
};

document.documentElement.classList.remove("no-js");

const waLink = (text) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text || CONTACT.defaultMessage)}`;

/* Links de contato */
document.querySelectorAll("[data-whatsapp]").forEach((el) => {
  el.href = waLink(el.dataset.waText);
  el.target = "_blank";
  el.rel = "noopener";
});
document.querySelectorAll("[data-instagram]").forEach((el) => {
  el.href = `https://instagram.com/${CONTACT.instagram}`;
  el.target = "_blank";
  el.rel = "noopener";
});
document.querySelectorAll("[data-email]").forEach((el) => {
  el.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(CONTACT.emailSubject)}`;
});
document.querySelectorAll("[data-phone-label]").forEach((el) => (el.textContent = CONTACT.whatsappLabel));
document.querySelectorAll("[data-instagram-label]").forEach((el) => (el.textContent = `@${CONTACT.instagram}`));
// Quebra de linha só depois do "@" em telas estreitas
document.querySelectorAll("[data-email-label]").forEach((el) => {
  const [user, domain] = CONTACT.email.split("@");
  el.replaceChildren(`${user}@`, document.createElement("wbr"), domain);
});

/* Portfólio: sem print real, mantém a ilustração do projeto */
document.querySelectorAll(".project__screen img").forEach((img) => {
  const drop = () => img.remove();
  if (img.complete && !img.naturalWidth) drop();
  else img.addEventListener("error", drop);
});

/* Ano no rodapé */
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Header ao rolar, barra de progresso e botões flutuantes */
const root = document.documentElement;
const header = document.querySelector(".header");
const waFloat = document.querySelector(".wa-float");
const toTop = document.querySelector(".to-top");
const ringBar = document.querySelector(".to-top__bar");
let ticking = false;
const onScroll = () => {
  const y = window.scrollY;
  const max = root.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(y / max, 1) : 0;
  header.classList.toggle("is-scrolled", y > 10);
  waFloat.classList.toggle("is-visible", y > 600);
  toTop.classList.toggle("is-visible", y > 600);
  root.style.setProperty("--progress", progress.toFixed(4));
  ringBar.style.strokeDashoffset = String(100 - progress * 100);
  ticking = false;
};
window.addEventListener("scroll", () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
onScroll();

/* Rolagem suave para âncoras, descontando a altura do header fixo */
const scrollToY = (top) => window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
toTop.addEventListener("click", () => scrollToY(0));
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const hash = link.getAttribute("href");
  if (hash === "#") return;
  if (hash === "#topo") {
    e.preventDefault();
    scrollToY(0);
    return;
  }
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  e.preventDefault();
  scrollToY(target.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 1);
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
});

/* Inclinação 3D que acompanha o mouse (mockups do hero e do portfólio) */
const tilt = (area, { rx = 0, ry = 0, range = 8, parallax = false }) => {
  if (!area) return;
  area.addEventListener("pointermove", (e) => {
    const r = area.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    area.classList.add("is-tilting");
    area.style.setProperty("--ry", `${ry + x * range}deg`);
    area.style.setProperty("--rx", `${rx - y * range * 0.7}deg`);
    if (parallax) {
      area.style.setProperty("--px", x.toFixed(3));
      area.style.setProperty("--py", y.toFixed(3));
    }
  });
  area.addEventListener("pointerleave", () => {
    area.classList.remove("is-tilting");
    ["--ry", "--rx", "--px", "--py"].forEach((v) => area.style.removeProperty(v));
  });
};

/* Efeitos de mouse: só em telas com mouse e sem preferência por menos movimento */
if (finePointer && !reduceMotion) {
  tilt(document.querySelector(".hero__visual"), { rx: 3, ry: -8, range: 10, parallax: true });
  tilt(document.querySelector(".project__media"), { range: 7 });

  // Brilho que segue o cursor nos cartões
  document.querySelectorAll(".card, .pillar, .founder").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

/* Menu mobile */
const toggle = document.querySelector(".menu-toggle");
const setMenu = (open) => {
  document.body.classList.toggle("menu-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
};
toggle.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

/* Animações de entrada */
const reveals = document.querySelectorAll(".reveal, .timeline__item");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // Escalona itens irmãos para um efeito em cascata
        const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
        el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 80}ms`;
        el.classList.add("is-visible");
        io.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

/* Link ativo na navegação */
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]:not(.btn)')];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
}

/* FAQ: mantém apenas um item aberto */
document.querySelectorAll(".faq__item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq__item[open]").forEach((o) => o !== item && (o.open = false));
  });
});
