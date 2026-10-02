# Evolute Soluções Digitais — site institucional

Site estático (HTML, CSS e JavaScript puros, sem dependências nem build).

## Estrutura

```
index.html            Página única com todas as seções
assets/css/style.css  Estilos (cores da marca em :root)
assets/js/main.js     Interações + CONFIGURAÇÃO DE CONTATO
assets/img/           Logos, favicons e imagem de compartilhamento (og-image)
```

## Antes de publicar

Edite o objeto `CONTACT` no topo de `assets/js/main.js`:

- `whatsapp`: número no formato internacional, só dígitos (ex.: `5511912345678`)
- `whatsappLabel`: número como deve aparecer no site
- `email`: e-mail de contato
- `scheduleUrl` (opcional): link de uma agenda online (Calendly, Cal.com, página de agendamento do Google Agenda).
  Se preenchido, os botões "Agendar reunião" abrem essa agenda. Vazio, levam ao formulário do site, que envia
  o pedido de reunião (formato, dia e período) pelo WhatsApp.

Todos os botões de WhatsApp, o formulário e os links de e-mail usam esses dados.

## Portfólio

Para trocar a ilustração do projeto pelo print real do site, salve a imagem em
`assets/img/portfolio/protestoijui.jpg` (de preferência 1440x900, mostrando o topo da página).
Sem o arquivo, o site mostra uma ilustração no lugar.

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicação

Funciona em qualquer hospedagem estática: GitHub Pages, Netlify, Vercel, Cloudflare Pages etc.
