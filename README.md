# Evolute Soluções Digitais — site institucional

Site estático (HTML, CSS e JavaScript puros, sem dependências nem build).

## Estrutura

```
index.html            Página única com todas as seções
assets/css/style.css  Estilos (cores da marca em :root)
assets/js/main.js     Interações da página, movimento-assinatura + CONFIGURAÇÃO DE CONTATO
assets/fx/            Motor de rolagem "Sites Incríveis" (não editar; efeitos via atributos data-fx-*)
assets/img/           Logos, favicons e imagem de compartilhamento (og-image)
```

## Antes de publicar

Edite o objeto `CONTACT` no topo de `assets/js/main.js`:

- `whatsapp`: número no formato internacional, só dígitos (ex.: `5511912345678`)
- `whatsappLabel`: número como deve aparecer no site
- `instagram`: o @ do perfil, sem o "@"
- `email`: e-mail de contato (os links já abrem com o assunto "Agendar reunião com a Evolute")

Todos os botões de contato do site (WhatsApp, Instagram e e-mail) usam esses dados.
Cada botão de WhatsApp tem a própria mensagem pronta no atributo `data-wa-text` do HTML.
Os links também já vêm prontos no HTML (com o número de exemplo) para funcionarem mesmo sem
JavaScript: ao trocar o número, atualize `CONTACT` e substitua `5500000000000`, `seuperfil` e
`contato@seudominio.com.br` no `index.html`.

O plano da página (cenas, pico, chamadas para ação) está em `BRIEF.md`.

## Portfólio

O print do projeto fica em `assets/img/portfolio/protestoijui.jpg`. Para atualizar, substitua o arquivo
por outro print do topo da página (proporção aproximada de 1471x843). Sem o arquivo, o site mostra uma
ilustração no lugar.

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicação

Funciona em qualquer hospedagem estática: GitHub Pages, Netlify, Vercel, Cloudflare Pages etc.
