# fraseefeito1

Frase guardada a pedido do cliente (09/10/2026) para uso futuro. Saiu do site por não
ter encaixe na página atual.

## Texto

> **Quem precisa do seu negócio não procura na rua. Pesquisa.**
>
> Se a sua empresa não aparece quando alguém procura, essa pessoa escolhe outra.
> Um site bem construído é o que coloca você nessa disputa.

"rua." e "Pesquisa." ficam sempre na mesma linha (`&nbsp;` entre elas).

## HTML (como estava no site)

```html
    <!-- ============ A VIRADA (antes do fechamento) ============ -->
    <section class="cena virada-cena" data-fx-fundo="#ffffff" data-fx-tinta="#0a1b33">
      <div class="wrap">
        <div class="virada">
          <p class="virada__frase" data-fx="esquerda">
            Quem precisa do seu negócio não procura na rua.&nbsp;<span>Pesquisa.</span>
          </p>
          <div class="virada__rodape" data-fx="surgir" data-fx-atraso="250">
            <p>
              Se a sua empresa não aparece quando alguém procura, essa pessoa escolhe
              outra. Um site bem construído é o que coloca você nessa disputa.
            </p>
          </div>
      </div>
    </section>
```

## CSS

```css
/* Frase "Quem precisa do seu negócio…": seção própria antes do fechamento */
.virada-cena .virada { margin-top: 0; padding-top: 0; border-top: 0; }
.virada { margin-top: 64px; padding-top: 48px; border-top: 1px solid var(--linha); }
.virada__frase { font-family: var(--fonte-titulo); font-size: var(--t-56); font-weight: 700; letter-spacing: -.035em; line-height: 1.1; max-width: 20ch; color: var(--tinta); }
.virada__frase span { white-space: nowrap; }
.virada__rodape { margin-top: 32px; display: grid; grid-template-columns: minmax(0, 1fr); gap: 32px 64px; align-items: end; max-width: 940px; }
.virada__rodape p { font-size: var(--t-18); color: var(--tinta-suave); max-width: 52ch; }
  .virada { margin-top: 48px; padding-top: 36px; }
  .virada__rodape { grid-template-columns: minmax(0, 1fr); }
  .virada { margin-top: 40px; padding-top: 28px; }
```

Para recolocar: cole o HTML como uma seção dentro de `<main>` no `index.html` e o CSS em
`assets/css/style.css` (as linhas indentadas vão dentro dos `@media` de 900px e 600px).
