# Runlog

Runlog is a personal running dashboard built with SvelteKit. It renders a training overview and recent session history from flat JSON files, with sample data included so the app still works cleanly in fresh forks, CI, and preview deploys.

## Quick Start

Install dependencies:

```sh
pnpm install
```

Start the development server:

```sh
pnpm dev
```

Build a production bundle:

```sh
pnpm build
```

## How Data Works

Runlog loads data from two places:

- `src/data/*.json` contains your personal runs. These files are gitignored on purpose, so you can keep private training data out of the main repo.
- `src/data/example/*.json` contains committed sample runs. The app uses these when no personal data is present.

The loading behavior lives in `src/lib/data/runs.ts`:

- if `src/data/*.json` exists, Runlog uses your personal runs
- otherwise it falls back to `src/data/example/*.json`

The JSON schema for each run lives in `src/lib/types/runlog.ts`.

## Adding Your Own Runs

You do not need a private repository, token, or Cloudflare setup to add data locally.

Just place one JSON file per run in `src/data/`, using this filename format:

```text
YYYY-MM-DD-HHMM.json
```

Example:

```text
src/data/2026-04-10-0601.json
```

Each file should match the schema in `src/lib/types/runlog.ts`.

### End-to-End Local Workflow

1. Run `pnpm install`
2. Add one or more JSON files to `src/data/`
3. Start the app with `pnpm dev`
4. Open the site and confirm it no longer shows the `Example data` badge

That is enough for local development.

## Privacy Model

Personal run files in `src/data/*.json` are ignored by git through `.gitignore`, so your private data does not get committed to the main repo by default.

This setup gives you two modes:

- local/private usage: keep your real data only on your machine in `src/data/`
- public/fork-friendly usage: let the app fall back to committed sample data in `src/data/example/`

## Optional: Deploy With Private Data on Cloudflare Pages

If you want to deploy the site with your personal data without committing that data publicly, you can keep the JSON files in a separate private GitHub repository and let the Cloudflare Pages build fetch them at build time.

This is an optional production workflow, not a requirement for local development.

The fetch logic lives in `scripts/cf-build.sh`.

### Setup

1. Create a private GitHub repository, for example `runlog-data`
2. Put your `*.json` run files at the root of that private repo
3. Create a fine-grained GitHub PAT with read-only access to that repo
4. In Cloudflare Pages, add these environment variables:
   - `RUNLOG_DATA_TOKEN` = your GitHub token
   - `RUNLOG_DATA_REPO` = `<your-username>/runlog-data`
5. Set the Cloudflare build command to:

```sh
pnpm build:cf
```

During that build, `scripts/cf-build.sh` will:

- clone the private data repo into `/tmp/runlog-data`
- copy any `*.json` files into `src/data/`
- run the normal app build

If `RUNLOG_DATA_TOKEN` or `RUNLOG_DATA_REPO` is missing, the build falls back to the committed example data instead.

## Project Notes

- `src/lib/types/runlog.ts` defines the run schema
- `src/lib/data/runs.ts` defines personal-data vs example-data loading
- `scripts/cf-build.sh` defines the optional Cloudflare private-data fetch flow

## Preview

To preview the production build locally:

```sh
pnpm preview
```
