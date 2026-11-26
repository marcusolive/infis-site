# INFIS · novo site institucional

Site de página única, bilíngue (português e inglês), com linguagem editorial e sóbria para uma consultoria fiscal que atende grandes empresas. Segue o manual de identidade visual da INFIS.

## Rodar

```bash
npm install
npm run dev      # servidor local
npm run build    # gera dist/ estático, publicável em qualquer host
```

## Stack

- **Vite** para build e servidor.
- **WebGL próprio** (sem bibliotecas 3D) no hero: sequência de fotos com transição por deslocamento, zoom lento e paralaxe de profundidade com o mouse. Sem WebGL, cai para crossfade em CSS.
- **GSAP + ScrollTrigger**: títulos revelados linha a linha, linha do tempo da Reforma com rolagem horizontal fixa, contadores, máscaras de imagem e parallax.
- **Lenis**: rolagem suave.
- Respeita `prefers-reduced-motion`.

## Textos

Todo o conteúdo foi copiado do site oficial (infisconsultoria.com.br, páginas em `/pt-br` e `/en`) em novembro de 2026. Nada foi escrito do zero.

| Seção | Página oficial de origem |
|---|---|
| Hero e números | Home |
| Sobre Nós, metodologia, "Por que escolher a INFIS?", equipe | Sobre Nós |
| Clientes e descrições por setor | Principais Clientes |
| 13 soluções, com os serviços de cada uma | Home e a página de cada solução |
| Reforma Tributária | Reforma Tributária |
| Segmentos | Óleo & Gás, Tecnologia, Telecom, Varejo |
| Pilares de valor e blog | Home |
| FAQ | FAQs |
| Contato e campos do formulário | Contato |

### Inglês

- Usa o texto oficial da versão `/en` sempre que ela existe.
- A versão em inglês do site oficial não tem ConnectIVA, RAD, Inventário de Estoques, Capital de Giro nem Score Fiscal do Fornecedor. Esses itens também não aparecem no site novo em inglês.
- A biografia de Michel Souza não existe em inglês no site oficial e foi traduzida aqui.
- Também foram traduzidos aqui os rótulos do formulário que o site oficial não traduz: Company name, Company size, Job title e Service(s) of interest.

### O que foi removido por não estar no site oficial

- Avaliação de prontidão (quiz).
- Linha do tempo 2026–2033 da Reforma.
- Textos próprios de introdução, princípios e "Como trabalhamos".
- Legenda "Escritório da INFIS" na foto de banco de imagens.
- Prazo de retorno do contato.

### Divergências no próprio site oficial, a confirmar com a INFIS

- **Números:** a home mostra dois conjuntos diferentes. Um diz 500+ análises, 12+ anos e 120+ profissionais; o outro diz 300+ empresas, 13+ anos e 80+ profissionais. Foi usado o segundo, que é o mesmo da versão em inglês.
- **Anos de mercado:** a home também diz "Com mais de 10 anos de atuação" em outro bloco.
- **Endereço de São Paulo:** aparecem a Av. Nicolas Boer, 399 e a Rua Padre Péricles, 145. Foi usada a Av. Nicolas Boer, que é a da página de contato.
- **E-mail:** a página de contato usa `umeireles@`, e o rodapé da home usa `umeirelles@`. Foi usado o da página de contato, na unidade de Manaus.

## Idiomas

- Todo o texto fica em `src/content.js`, com os blocos `pt` e `en`.
- O idioma vem de `?lang=pt|en`, depois da escolha salva no navegador e, por fim, do idioma do navegador.
- O seletor PT / EN no cabeçalho troca com transição de cortina e mantém a posição da página.
- `hreflang` já declarado no `<head>`.

## Identidade aplicada

| Item | Uso no site |
|---|---|
| Pôr do Sol → Laranja Elétrico | botão principal, números, detalhes pontuais; gradiente a 135°, claro à esquerda |
| Eclipse, Grafite, Prata, Neve | fundos escuros, textos e linhas |
| Ouro | só o selo "Agora" na linha do tempo, sobre fundo escuro |
| DM Serif Display | títulos em caixa alta, itálico para ênfase |
| Roboto | textos corridos e rótulos |
| Círculo da marca | anel de progresso do hero e marcadores |

A logo em `src/logo.js` é uma reconstrução vetorial do manual, com o "in" recortado pelo círculo. Para produção, troque pelo SVG oficial.

## Clientes

Os 42 logos vêm da página de clientes do site atual, agrupados pelos mesmos setores. Hoje são carregados direto do armazenamento do site atual. Antes de publicar, copie os arquivos para a hospedagem nova e ajuste a função `LOGO` em `src/content.js`.

## Blog (noticiário)

- `npm run build` roda antes `scripts/blog.mjs`, que lê o blog oficial e grava os posts mais recentes em `src/blog.json`: 9 em português e 6 em inglês, com título, resumo, data, autoria, categoria e tempo de leitura.
- O blog oficial não permite leitura direta pelo navegador (não tem CORS), por isso a busca acontece no build. Para o noticiário acompanhar o blog, agende um build diário na hospedagem (Vercel, Netlify e Cloudflare Pages têm deploy hooks).
- Se o blog estiver fora do ar, o build mantém a última versão salva.
- Para atualizar sem gerar o build: `npm run blog`.

## Integrações (`src/config.js`)

| Campo | O que faz |
|---|---|
| `formEndpoint` | URL que recebe o formulário de contato em JSON (CRM, Formspree, API própria). Vazio: o lead abre o WhatsApp da unidade escolhida com a mensagem pronta. |
| `newsletterEndpoint` | URL que recebe `{ email, idioma }`. Vazio: mostra aviso de indisponível. |
| `ga4Id` | Google Analytics 4, carregado só após o aceite de cookies (LGPD). Eventos `generate_lead` e `sign_up`. |
| `units` | Endereços, telefones e WhatsApp de cada unidade. |
| `social`, `blog` | Links externos. |

## Pendências antes de publicar

- Resolver as divergências listadas em "Textos".
- **Fotos:** são do Unsplash (licença livre). Fotos reais dos escritórios e da equipe reforçam a credibilidade.
- **Marcas dos clientes:** confirmar que a autorização de uso vale também para o site novo.
