/* =========================================================
   Evolute Soluções Digitais — scripts da página
   (os efeitos de rolagem genéricos vêm de assets/fx/sites-incriveis.js;
   aqui fica só o que é desta página)
   ========================================================= */

/* ---------- CONFIGURAÇÃO DE CONTATO ----------
   Edite aqui os dados de contato. Todos os botões do site usam estes valores.
   - whatsapp: formato internacional, só dígitos (55 + DDD + número)
   - instagram: o @ do perfil, sem o "@"
   Cada botão de WhatsApp pode ter a própria mensagem pronta no atributo
   data-wa-text do HTML; sem ele, usa defaultMessage. */
const CONTACT = {
  whatsapp: "5500000000000",
  whatsappLabel: "(00) 00000-0000",
  instagram: "seuperfil",
  email: "contato@seudominio.com.br",
  emailSubject: "Quero um site para a minha empresa",
  defaultMessage: "Olá! Conheci a Evolute pelo site e gostaria de conversar sobre um projeto."
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const year = document.getElementById("ano");
if (year) year.textContent = new Date().getFullYear();

/* ---------- Header, barra de leitura e botões flutuantes ---------- */
const root = document.documentElement;
const header = document.querySelector(".header");
const waFloat = document.querySelector(".wa-float");
const toTop = document.querySelector(".to-top");
const ringBar = document.querySelector(".to-top__barra");

const onScroll = () => {
  const y = window.scrollY;
  const max = root.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(y / max, 1) : 0;
  header.classList.toggle("is-scrolled", y > 10);
  waFloat.classList.toggle("is-visible", y > 600);
  toTop.classList.toggle("is-visible", y > 600);
  root.style.setProperty("--progress", progress.toFixed(4));
  ringBar.style.strokeDashoffset = String(100 - progress * 100);
};

/* ---------- Menu no celular ---------- */
const toggle = document.querySelector(".menu-toggle");
const setMenu = (open) => {
  document.body.classList.toggle("menu-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
};
toggle.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
document.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

/* ---------- Âncoras com rolagem suave, descontando o header ---------- */
const scrollToY = (top) => window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
toTop.addEventListener("click", () => scrollToY(0));
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const hash = link.getAttribute("href");
  if (hash === "#") return;
  e.preventDefault();
  if (hash === "#topo") return scrollToY(0);
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  scrollToY(target.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 1);
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
});

/* ---------- Movimento-assinatura: motion graphic da busca ----------
   Um loop que conta, em poucos segundos, o que a Evolute vende:
   alguém pesquisa → a "Sua empresa" sobe para o primeiro lugar →
   recebe o clique → vira mensagem no WhatsApp. Depois, outra profissão.
   Só roda com o cartão visível e a aba ativa; com movimento reduzido,
   mostra o estado final parado. */
const SEARCHES = [
  { q: "arquitetos perto de mim", area: "Arquitetura" },
  { q: "advogados perto de mim", area: "Advocacia" },
  { q: "clínica odontológica perto de mim", area: "Odontologia" },
  { q: "contabilidade perto de mim", area: "Contabilidade" },
  { q: "móveis planejados perto de mim", area: "Móveis planejados" }
];

function initSearchMotion() {
  const card = document.getElementById("google");
  if (!card || reduceMotion || !card.animate) return;
  const queryEl = document.getElementById("google-consulta");
  const areaEl = document.getElementById("google-area");
  const list = document.getElementById("google-resultados");
  const ours = list.querySelector(".resultado--seu");
  const pointer = card.querySelector(".google__ponteiro");
  const toast = card.querySelector(".google__aviso");
  const EASE = "cubic-bezier(.22, 1, .36, 1)";

  let visible = false;
  let wake = null;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && wake) { wake(); wake = null; }
  }, { threshold: 0.35 }).observe(card);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && visible && wake) { wake(); wake = null; }
  });
  // Espera o cartão estar visível (e a aba ativa) antes de cada passo
  const gate = () => (visible && !document.hidden) ? Promise.resolve() : new Promise((r) => { wake = r; });
  const wait = async (ms) => { await gate(); await new Promise((r) => setTimeout(r, ms)); };

  // Reordena a lista animando a diferença de posição (técnica FLIP)
  const reorder = (mutate, duration) => {
    const items = [...list.children];
    const before = new Map(items.map((el) => [el, el.getBoundingClientRect().top]));
    mutate();
    return Promise.all(items.map((el) => {
      const dy = before.get(el) - el.getBoundingClientRect().top;
      if (!dy) return null;
      return el.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }],
        { duration, easing: EASE }).finished;
    }));
  };

  async function type(text) {
    for (let i = 1; i <= text.length; i++) {
      queryEl.textContent = text.slice(0, i);
      // ritmo de digitação humano: pausa um pouco mais depois de espaços
      await wait(text[i - 1] === " " ? 70 : 32 + (i % 3) * 10);
    }
  }
  async function erase() {
    let text = queryEl.textContent;
    while (text.length) {
      text = text.slice(0, -3);
      queryEl.textContent = text;
      await wait(16);
    }
  }

  async function cycle({ q, area }) {
    // estado inicial: campo vazio, sem resultados, "Sua empresa" lá embaixo
    [...list.children, pointer].forEach((el) => el.getAnimations().forEach((an) => an.cancel()));
    queryEl.textContent = "";
    card.classList.add("is-vazio");
    ours.classList.remove("is-topo");
    list.appendChild(ours);
    areaEl.textContent = area;
    await wait(200);
    await type(q);
    await wait(150);

    card.classList.add("is-buscando");
    await wait(450);
    card.classList.remove("is-buscando");
    card.classList.remove("is-vazio");
    [...list.children].forEach((el, i) => el.animate(
      [{ opacity: 0, transform: "translateY(10px)" }, { opacity: el === ours ? 0.6 : 1, transform: "none" }],
      { duration: 350, delay: i * 50, easing: EASE, fill: "both" }));
    await wait(550);

    // a subida: "Sua empresa" passa os outros resultados e chega ao topo
    ours.getAnimations().forEach((a) => a.cancel());
    await gate();
    await reorder(() => list.prepend(ours), 750);
    ours.classList.add("is-topo");
    await wait(500);

    // o clique: ponteiro vai até o título e clica
    const cardBox = card.getBoundingClientRect();
    const title = ours.querySelector(".resultado__titulo").getBoundingClientRect();
    const x = title.left - cardBox.left + Math.min(title.width * 0.35, 140);
    const y = title.top - cardBox.top + title.height * 0.55;
    const from = `translate(${cardBox.width - 40}px, ${cardBox.height - 30}px)`;
    const to = `translate(${x}px, ${y}px)`;
    await gate();
    await pointer.animate([{ transform: from, opacity: 0 }, { opacity: 1, offset: 0.3 }, { transform: to, opacity: 1 }],
      { duration: 550, easing: EASE, fill: "forwards" }).finished;
    pointer.animate([{ transform: to }, { transform: `${to} scale(.82)` }, { transform: to }], { duration: 220, fill: "forwards" });
    const ripple = document.createElement("span");
    ripple.className = "clique";
    ripple.style.left = `${x + 4}px`;
    ripple.style.top = `${y + 4}px`;
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    await wait(200);

    // e vira conversa
    toast.classList.add("is-visivel");
    await wait(1500);

    // saída
    toast.classList.remove("is-visivel");
    pointer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" });
    card.classList.add("is-vazio");
    await wait(250);
    await erase();
  }

  let started = false;
  const start = async () => {
    if (started) return;
    started = true;
    let i = 0;
    for (;;) {
      await cycle(SEARCHES[i]);
      i = (i + 1) % SEARCHES.length;
    }
  };
  gate().then(start);
}
initSearchMotion();

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }
}, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
onScroll();
