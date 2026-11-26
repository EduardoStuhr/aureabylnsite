# Auditoria de segurança da ÁURA BY LN

Base `de7bc7d233e443716d23f8f25db143d7469169bb`, merge do PR #29. Revisão dos PRs #22–#29, código, build e histórico local. Inspeção passiva de produção e testes ativos em preview. Referências — [OWASP Top 10:2025](https://top10.owasp.org/2025/pt-BR/), [OWASP ASVS](https://owasp.org/projects/asvs/), [Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/), [GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use), [React](https://react.dev/reference/react-dom/components/common) e [Vite](https://vite.dev/guide/env-and-mode).

## Arquitetura e dados

React, Vite e React Router geram arquivos estáticos. Rotas públicas — `/`, `/portfolio`, `/servicos`, `/servicos/:slug`, `/curso`, `/sobre`, `/diario` e `/contato`. O catálogo resolve `procedimento` e `tecnica` com dados locais. Cloudflare Pages hospeda produção e previews. GitHub Actions valida e também prepara publicação no GitHub Pages em job próprio.

O formulário mantém nome, procedimentos, complementos, data, período e observações em memória. Gera um link comercial e entrega os dados ao WhatsApp quando o visitante abre esse link. O envio da mensagem é feito no WhatsApp. As outras integrações identificadas foram Google Fonts e links do Instagram. GSAP e Three.js executam no cliente.

## Verificações obrigatórias

| ID | Verificação e evidência sanitizada | Gravidade | Componente | Correção e teste | Risco residual e status |
|---|---|---|---|---|---|
| 4.1 | Rotas administrativas, login, debug e API ausentes no código de deploy. | Informativo | `App.tsx`, `_redirects` | Teste da página de erro. | Fallback SPA pode retornar HTTP 200. Seguro nos testes executados. |
| 4.2 | Slugs públicos resolvem itens locais. Validação aceitava ID não vazio sem confirmar existência. | Baixo | Roteador e `studioLogic.ts` | Rejeita IDs desconhecidos, com testes unitários e de navegação. | Identificadores são públicos. Vulnerabilidade corrigida na lógica. |
| 4.3 | Prefixo público padrão e placeholders de serviços antigos. | Baixo | Vite, `.env.example`, build | Exposição por prefixo desativada, placeholders removidos e cópia de ativos filtrada. Canário, busca no bundle e Gitleaks. | Reavaliar em novas integrações. Seguro nos testes executados. |
| 4.4 | Estimativa usava objetos de preço passados ao gerador. | Baixo | `studioLogic.ts` | Valores, durações e adicionais resolvidos do catálogo pelo ID. Teste com estimativa sintética divergente. | Visitante pode editar o próprio navegador ou mensagem. O estúdio confirma valores. Vulnerabilidade corrigida na lógica. |
| 4.5 | Campos sem limites e validação parcial de data, período e telefone. | Baixo | Formulário e lógica | Limites e validação na interface e na lógica. Datas no fuso do estúdio. Testes unitários e de browser. | Triagem comercial continua no WhatsApp. Vulnerabilidade corrigida. |
| 4.6 | Pagamento, checkout e webhooks financeiros ausentes. | Informativo | Rotas, dependências e formulário | Inspeção do código e build. | Não aplicável. |
| 4.7 | Cupons e descontos automatizados ausentes. | Informativo | Catálogo e formulário | Inspeção dos cálculos e testes de preços. | Não aplicável. |
| 4.8 | Login, cadastro, sessão e área restrita ausentes. | Informativo | Roteador e build | Inspeção e teste da rota sem correspondência. | Não aplicável. |
| 4.9 | JS entregue é público. Cópia de ativos de origem não filtrava extensão. | Baixo | Vite e `dist` | Cópia limitada a formatos de imagem, busca de arquivos privados e sourcemaps. | Frontend continua público. Seguro nos testes executados. |
| 4.10 | SDK de IA residual, sem chamadas no código de aplicação. | Informativo | Dependências e build | Remoção do SDK e de placeholders, com build e regressões. | Prompt injection não aplicável. |
| 4.11 | Texto dinâmico renderizado pelo React. Produção consultada sem CSP. | Médio | React, `_headers` | Política sem script inline ou eval. Testes com marcador textual inerte em pesquisa e confirmação. | Estilos em atributos permitidos para preservar a interface. Seguro nos testes executados. |
| 4.12 | Nenhum campo de arquivo ou endpoint público de upload encontrado. | Informativo | Formulários e rotas | Inspeção. | Não aplicável. |
| 4.13 | Gitleaks sem sinalizações no histórico local disponível e no build. `.env.production` ignorado. | Informativo | Git, CI e `.gitignore` | Scan redigido e repetição na CI. | A cobertura depende das refs e regras acessíveis. Seguro nos testes executados. |
| 4.14 | Banco, API de persistência e armazenamento de clientes ausentes no projeto. | Informativo | Rotas, dependências e build | Inspeção e teste do fluxo no navegador. | SQL injection e acesso indevido ao banco não aplicáveis. |

## Verificações adicionais

| ID | Evidência e gravidade | Correção e teste | Risco residual e status |
|---|---|---|---|
| CF-01 | **Médio.** Produção já enviava nosniff e Referrer-Policy. Não apresentou CSP, HSTS, proteção explícita contra frames ou Permissions-Policy. HTTP redirecionou a HTTPS. | `public/_headers` adiciona políticas com origens explícitas. HSTS só para o host. Vite preview usa as mesmas regras. | Produção depende de merge e publicação. Configuração corrigida no PR. |
| DEP-01 | **Alto na dependência.** Bun sinalizou 13 avisos na versão anterior do React Router, sete altos. Vários atingem SSR, endpoints ou APIs ausentes nesta SPA. | Atualiza React Router para 7.18.7. Nova auditoria vazia. Remove SDK de IA, Express, dotenv e Motion sem uso. | Resultado pontual do feed. Vulnerabilidade corrigida na dependência. |
| CI-01 | **Baixo.** Actions referenciadas por tags mutáveis. Token padrão de leitura, elevação restrita ao deploy e ausência de `pull_request_target`. | Pins por SHA, checkout sem persistir credenciais, auditoria de dependências, Gitleaks por checksum e regressões de navegador. Dependabot versionado para Bun e Actions. | Status de Secret Scanning e CodeQL no painel não verificado. Vulnerabilidade corrigida na configuração versionada. |
| CI-02 | **Médio.** API da branch informou proteção desativada e nenhum check obrigatório na consulta disponível. | Nenhuma alteração administrativa. | Confirmar rulesets e, mediante autorização, exigir revisão e CI na `main`. Vulnerabilidade pendente. |
| WA-01 | **Baixo.** WhatsApp fixo em `https://wa.me/5527999202100`. Links de nova aba usam `noopener noreferrer`. | `URLSearchParams`, campos canônicos e texto sanitizado em uma linha por campo. Testes de destino e decodificação sem abrir a conversa. | A conversa e retenção seguem no fornecedor externo. Seguro nos testes executados. |
| PRIV-01 | **Baixo.** Formulário retinha dados em memória depois de fechar. Google Fonts, WhatsApp e Instagram são terceiros. | Limpeza de dados e link ao fechar. Aviso contextual de transferência. Teste de cookies, Storage e preenchimento após reabertura. | Confirmar aviso de privacidade e política de retenção com a responsável. Vulnerabilidade corrigida no estado local. |

## Regressões, limites e publicação

- Typecheck via `npm run lint`, testes unitários via `npm test`, auditoria Bun e build de produção.
- Suíte de interface em Chromium a 320, 375, 390, 768, 1024, 1440 e 1920 px. A suíte de segurança cobre formulário, cabeçalhos, rotas sem correspondência, texto inerte e retenção em 390 e 1440 px.
- Gitleaks verificou histórico acessível e artefato. O build foi conferido com canário sintético e sem sourcemaps públicos. Nenhuma mensagem comercial foi disparada.
- Configurações privadas de conta e DNS, retenção no WhatsApp, refs inacessíveis e GPU física não foram verificadas. O relatório não constitui certificação ASVS ou LGPD.
- O PR aguarda revisão. Reverter o PR restaura a versão anterior. Verificar os cabeçalhos de produção após merge.
