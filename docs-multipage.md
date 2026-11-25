# Experiência institucional multipáginas

A navegação usa React Router com basename derivado de BASE_URL. O Cloudflare Pages recebe public/_redirects para servir index.html nas URLs internas. O build para GitHub Pages conserva o prefixo do repositório, mas o GitHub Pages não oferece esse mesmo fallback de SPA.

As páginas reutilizam os trabalhos disponíveis e os serviços em studioData.ts. Os formulários de consulta usam o WhatsApp comercial definido em `STUDIO_PROFILE.whatsappPhone`. O Instagram oficial permanece disponível. A seção do curso utiliza a descrição cadastrada e solicita confirmação de datas e condições.

O portfólio usa grid editorial e proporções naturais das fotografias. A revelação é um aprimoramento CSS com view timeline nos navegadores compatíveis. O conteúdo aparece normalmente nos demais navegadores e com movimento reduzido. Nenhum pin é criado.

Títulos, descrições e Open Graph são atualizados por rota no cliente. O projeto continua noindex durante homologação. O sitemap usa o domínio Pages existente. A renderização client-side limita os previews de redes sociais e indexadores que não executam JavaScript. Pré-renderização permanece uma decisão posterior à homologação e à confirmação do domínio público definitivo.

Validação automatizada de navegação, acesso direto, retorno de foco, busca, filtros e consulta nas larguras 320, 375, 390, 768, 1024, 1440 e 1920 está em tests/gallery_scroll.py.
