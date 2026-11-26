# Preview no GitHub Pages

O build Pages usa /aureabylnsite/. Instalar com `npx --yes bun@1.4.4 install --frozen-lockfile`, executar `npm run lint`, `GITHUB_PAGES=true npm run build` e `GITHUB_PAGES=true npm run preview`. O lockfile original é preservado. O script lint executa TypeScript.

O workflow valida Pull Requests e publica somente após entrada na main. Em Settings → Pages → Build and deployment → Source, selecionar GitHub Actions. Após merge aprovado, acompanhar o workflow Preview on GitHub Pages. Destino previsto: https://eduardostuhr.github.io/aureabylnsite/.

Antes de aprovar o merge e a publicação, confirmar autorização de uso das fotografias e os textos comerciais existentes, incluindo formação, credenciais e disponibilidade do curso. Esses materiais foram preservados e sua presença no repositório não comprova autorização. O número comercial usado no agendamento e na página de contato é definido em `STUDIO_PROFILE.whatsappPhone`.

Homologação contém noindex/nofollow e robots restritivo. Isso não restringe acesso público aos arquivos. O site usa build estático e dispensa credenciais privadas ou variáveis VITE_. O Vite preview aplica os mesmos cabeçalhos globais de public/_headers usados no Cloudflare Pages.

O build apresenta aviso de bundle acima de 500 kB. A otimização do bundle está fora deste ajuste de portfólio.
