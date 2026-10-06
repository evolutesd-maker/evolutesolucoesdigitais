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
  updateSearch();
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

/* ---------- Movimento-assinatura: a busca que se reescreve ----------
   Conforme a pessoa rola pelo cartão do Google, a consulta é apagada e
   redigitada com outra profissão. "Sua empresa" continua em primeiro.
   Ligado à rolagem (vai e volta junto com ela), sem prender a tela. */
const SEARCHES = [
  { q: "arquitetos perto de mim", area: "Arquitetura" },
  { q: "advogados perto de mim", area: "Advocacia" },
  { q: "clínica odontológica perto de mim", area: "Odontologia" },
  { q: "contabilidade perto de mim", area: "Contabilidade" },
  { q: "móveis planejados perto de mim", area: "Móveis planejados" }
];
const googleCard = document.getElementById("google");
const queryEl = document.getElementById("google-consulta");
const areaEl = document.getElementById("google-area");
let lastQuery = "";

function updateSearch() {
  if (!googleCard || reduceMotion) return;
  const rect = googleCard.getBoundingClientRect();
  const vh = window.innerHeight;
  // Acompanha o centro do cartão: começa quando ele chega a 72% da altura da
  // tela e termina em 22%, o trecho em que o cartão inteiro está legível.
  const center = rect.top + rect.height / 2;
  const p = Math.min(Math.max((vh * 0.72 - center) / (vh * 0.5), 0), 1);

  const t = p * (SEARCHES.length - 1);
  const i = Math.min(Math.floor(t), SEARCHES.length - 2);
  const f = t - i;
  const current = SEARCHES[i];
  const next = SEARCHES[i + 1];

  let text;
  let area = current.area;
  if (f < 0.2) {
    text = current.q;
  } else if (f < 0.5) {
    const k = (f - 0.2) / 0.3;
    text = current.q.slice(0, Math.round(current.q.length * (1 - k)));
  } else if (f < 0.8) {
    const k = (f - 0.5) / 0.3;
    text = next.q.slice(0, Math.round(next.q.length * k));
    area = next.area;
  } else {
    text = next.q;
    area = next.area;
  }

  if (text !== lastQuery) {
    queryEl.textContent = text;
    lastQuery = text;
  }
  if (areaEl.textContent !== area) areaEl.textContent = area;
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }
}, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
onScroll();
