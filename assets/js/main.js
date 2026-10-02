/* =========================================================
   Evolute Soluções Digitais — scripts
   ========================================================= */

/* ---------- CONFIGURAÇÃO DE CONTATO ----------
   Edite aqui o número de WhatsApp (formato internacional, só dígitos:
   55 + DDD + número) e o e-mail. Todos os botões do site usam estes dados.

   scheduleUrl (opcional): link de uma agenda online, como Calendly, Cal.com
   ou a página de agendamento do Google Agenda. Se preenchido, os botões
   "Agendar reunião" abrem essa agenda. Se ficar vazio, levam ao formulário
   do site, que envia o pedido de reunião pelo WhatsApp. */
const CONTACT = {
  whatsapp: "5500000000000",
  whatsappLabel: "(00) 00000-0000",
  email: "contato@seudominio.com.br",
  scheduleUrl: "",
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
if (CONTACT.scheduleUrl) {
  document.querySelectorAll("[data-schedule], [data-schedule-external]").forEach((el) => {
    el.href = CONTACT.scheduleUrl;
    el.target = "_blank";
    el.rel = "noopener";
    el.hidden = false;
  });
}
document.querySelectorAll("[data-phone-label]").forEach((el) => (el.textContent = CONTACT.whatsappLabel));
document.querySelectorAll("[data-email-label]").forEach((el) => (el.textContent = CONTACT.email));

/* Portfólio: sem print real, mantém a ilustração do projeto */
document.querySelectorAll(".project__screen img").forEach((img) => {
  const drop = () => img.remove();
  if (img.complete && !img.naturalWidth) drop();
  else img.addEventListener("error", drop);
});

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

/* Formulário de agendamento -> WhatsApp */
const form = document.getElementById("schedule-form");
if (form) {
  const error = form.querySelector(".field__error");
  const dateInput = form.elements.data;
  const pad = (n) => String(n).padStart(2, "0");
  const now = new Date();
  dateInput.min = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  const fail = (input, message) => {
    input.setAttribute("aria-invalid", "true");
    error.textContent = message;
    error.hidden = false;
    input.focus();
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const nome = (data.get("nome") || "").trim();
    const dia = data.get("data");
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    error.hidden = true;

    if (!nome) return fail(form.elements.nome, "Informe seu nome para continuarmos.");
    if (!dia) return fail(dateInput, "Escolha o melhor dia para a reunião.");
    if (dia < dateInput.min) return fail(dateInput, "Escolha uma data a partir de hoje.");

    const [ano, mes, d] = dia.split("-").map(Number);
    const dataFmt = new Date(ano, mes - 1, d).toLocaleDateString("pt-BR", {
      weekday: "long", day: "2-digit", month: "2-digit", year: "numeric"
    });
    const empresa = (data.get("empresa") || "").trim();
    const mensagem = (data.get("mensagem") || "").trim();
    const linhas = [
      `Olá! Meu nome é ${nome}${empresa ? `, da ${empresa}` : ""}.`,
      "Gostaria de agendar uma reunião com a Evolute.",
      "",
      `Formato: ${data.get("formato")}`,
      `Preferência: ${dataFmt} (${String(data.get("periodo")).toLowerCase()})`
    ];
    if (mensagem) linhas.push(`Assunto: ${mensagem}`);

    const url = waLink(linhas.join("\n"));
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url;
  });
}
