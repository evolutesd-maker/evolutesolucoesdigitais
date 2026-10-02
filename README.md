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

Todos os botões de WhatsApp, o formulário e os links de e-mail usam esses dados.

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicação

Funciona em qualquer hospedagem estática: GitHub Pages, Netlify, Vercel, Cloudflare Pages etc.
