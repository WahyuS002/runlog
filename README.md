# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.14.1 create --template minimal --types ts --add prettier tailwindcss="plugins:typography,forms" --install pnpm runlog.wahyusyahputra.com
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Data

Runlog entries live as one JSON file per run under `src/data/`, named `YYYY-MM-DD-HHMM.json` (date + start time, no colon — sorts chronologically). The schema is defined in `src/lib/types/runlog.ts`.

- `src/data/*.json` — your personal runlog data. **Gitignored** so forks stay clean.
- `src/data/example/*.json` — sample runs that ship with the repo. Used as a fallback when no personal data is present (fresh forks, CI, etc).

The loader at `src/lib/data/runs.ts` shows personal data when available, otherwise falls back to the example set.

### Adding your own runs

Drop new files into `src/data/` following the naming convention and schema. They will be picked up automatically by Vite glob import.

### Deploying with private data (Cloudflare Pages)

Personal data is intentionally kept out of this repo. For production deploys, store your data in a separate **private** GitHub repo and let the Cloudflare Pages build pull it in:

1. Create a private repo (e.g. `runlog-data`) containing only your `*.json` files at the root.
2. Generate a GitHub fine-grained PAT with read-only access to that repo.
3. In Cloudflare Pages → your project → Settings → Environment variables, add:
   - `RUNLOG_DATA_TOKEN` = the PAT
   - `RUNLOG_DATA_REPO` = `<your-username>/runlog-data`
4. Set the build command to `pnpm build:cf` (uses `scripts/cf-build.sh`).

If those env vars are not set, the build falls back to the example data — so a fresh fork deploys cleanly out of the box.

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
