/* =========================================================
   Evolute Soluções Digitais — scripts
   ========================================================= */

/* ---------- CONFIGURAÇÃO DE CONTATO ----------
   Edite aqui o número de WhatsApp (formato internacional, só dígitos:
   55 + DDD + número) e o e-mail. Todos os botões do site usam estes dados. */
const CONTACT = {
  whatsapp: "5500000000000",
  whatsappLabel: "(00) 00000-0000",
  email: "contato@seudominio.com.br",
  defaultMessage: "Olá! Conheci a Evolute pelo site e gostaria de conversar sobre um projeto."
};

document.documentElement.classList.remove("no-js");

const waLink = (text) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text || CONTACT.defaultMessage)}`;

/* Links de contato */
document.querySelectorAll("[data-whatsapp]").forEach((el) => {
  el.href = waLink();
  el.target = "_blank";
  el.rel = "noopener";
});
document.querySelectorAll("[data-email]").forEach((el) => {
  el.href = `mailto:${CONTACT.email}`;
});
document.querySelectorAll("[data-phone-label]").forEach((el) => (el.textContent = CONTACT.whatsappLabel));
document.querySelectorAll("[data-email-label]").forEach((el) => (el.textContent = CONTACT.email));

/* Ano no rodapé */
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* Header ao rolar + botão flutuante */
const header = document.querySelector(".header");
const waFloat = document.querySelector(".wa-float");
const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle("is-scrolled", y > 10);
  waFloat.classList.toggle("is-visible", y > 600);
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

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

/* Formulário -> WhatsApp */
const form = document.getElementById("contact-form");
if (form) {
  const error = form.querySelector(".field__error");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nome = (data.get("nome") || "").trim();
    const nomeInput = form.elements.nome;

    if (!nome) {
      nomeInput.setAttribute("aria-invalid", "true");
      error.hidden = false;
      nomeInput.focus();
      return;
    }
    nomeInput.removeAttribute("aria-invalid");
    error.hidden = true;

    const empresa = (data.get("empresa") || "").trim();
    const mensagem = (data.get("mensagem") || "").trim();
    const linhas = [
      `Olá! Meu nome é ${nome}${empresa ? `, da ${empresa}` : ""}.`,
      `Tenho interesse em: ${data.get("tipo")}.`,
      mensagem && `\n${mensagem}`
    ].filter(Boolean);

    window.open(waLink(linhas.join("\n")), "_blank", "noopener");
  });
}
