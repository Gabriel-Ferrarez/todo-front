# todo-front

Interface web para gerenciamento de tarefas, desenvolvida com React + Vite.

## Tecnologias

- React 18
- Vite
- CSS customizado (sem frameworks)

## CI/CD

Deploy automatizado via **GitHub Actions**, acionado exclusivamente por push de tags SemVer (`vX.Y.Z`).

### Secrets necessários no GitHub

- `VERCEL_TOKEN` — Token de acesso da Vercel
- `VERCEL_ORG_ID` — ID da organização na Vercel
- `VERCEL_PROJECT_ID` — ID do projeto na Vercel
- `VITE_API_URL` — URL da API back-end em produção (ex: `https://todo-back.onrender.com`)

## Como rodar localmente

```bash
npm install
npm run dev
```

> Crie um arquivo `.env` com `VITE_API_URL=http://localhost:3001` para apontar ao back-end local.

## Versões

- `v1.0.0` — Versão inicial
- `v1.0.1` — Ajustes e melhorias
