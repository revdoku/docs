---
title: Docs from GitHub
description: Connect the GitHub repository with your docs. Revdoku publishes it as the docs of your portal and updates it on every push.
---

Your docs stay in your GitHub repository. Revdoku keeps a read-only copy and publishes it under `/docs/` on your portal. To change a page, change it on GitHub: each push updates the portal.

## Connect a repository

The setup after signup does this for you. To connect a repository later:

1. Open your project and select **Settings** → **GitHub**.
2. Select **Connect GitHub**. GitHub opens: install the Revdoku GitHub App on the account or organization that owns the repository, and choose the repositories that Revdoku can read.
3. Choose the repository. Revdoku finds the folder with your docs. To use another folder or branch, change it under the detected folder.
4. Select **Import and publish**. Revdoku copies the files and publishes your portal.

The Revdoku GitHub App asks GitHub for read-only access to the contents and metadata of the repositories that you choose. Revdoku never changes your repository.

No docs repository yet? Start from a template on GitHub: [template-api](https://github.com/revdoku/template-api), [template-product](https://github.com/revdoku/template-product), [template-sdk](https://github.com/revdoku/template-sdk), [template-mcp-server](https://github.com/revdoku/template-mcp-server) or [template-mobile-app](https://github.com/revdoku/template-mobile-app). Select **Use this template** on GitHub, then connect your copy.

## What Revdoku publishes

A folder with `docs.json` or `mint.json`, or with Markdown pages and no `index.html`, becomes a docs site. A Mintlify repository works as it is.

| Feature | How it works |
| --- | --- |
| Pages | Markdown and MDX. Mintlify components, such as `Card`, `Tabs`, `Steps`, `Accordion` and `CodeGroup`, work. |
| Navigation | From `navigation` in `docs.json` or `mint.json`, or from your folders. |
| API reference | One page for each tag of your OpenAPI document. Each endpoint has **Try it**, which sends a real request from the visitor's browser. Your API must allow browser requests (CORS). |
| Search | Every page is in the search of the portal. |
| Header and footer | `logo`, `favicon`, `navbar`, `footer` and `banner` in `docs.json`. **Settings** → **Navigation** can change them. |
| Page menu | **Copy page** and a menu to view the page as Markdown or open it in ChatGPT or Claude. Choose the items with `contextual.options`. |

## Updates and previews

- Each push to the connected branch updates the files and publishes the portal again. To publish by hand, turn off **Auto-publish GitHub updates** in **Settings** → **GitHub**.
- To preview another branch, open the menu beside **Republish** and choose the branch. The preview has its own address and lasts 24 hours. A push to another branch builds nothing by itself.
- Each publish uses credits. See [Pricing](https://app.revdoku.com/pricing).
- Disconnect the repository in **Settings** → **GitHub**. The project keeps its files, and the portal stays live.

## Site addresses

| Address | What it is |
| --- | --- |
| `/docs/` | The pages of your repository. The file `guides/setup.md` is the page `/docs/guides/setup/`. |
| `/` | The main page of the portal. |
| `/help/` and `/support/` | Your [articles](/knowledge-base) and the [support page](/tickets). |

Write links between your pages as on Mintlify, such as `/guides/setup` or a relative link. Revdoku adds `/docs` when it publishes. Images, the OpenAPI document and other files keep their addresses at the root of the site.

## Files that sync and publish

| Group | Files | What happens |
| --- | --- | --- |
| Never copied | Secrets and keys (`.env`, `.pem`, `credentials.*`), cloud and tool folders (`.aws`, `.ssh`), databases and logs, archives and programs, `.git`, `node_modules`, `.github/workflows`, and files above your plan's size limit | They never enter the project. **Settings** → **GitHub** lists the files that were too large. |
| Copied, never published | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` and other instructions for AI coding agents, dot files and dot folders (except `.well-known`), lock files and scripts | The project keeps them, but the site never serves them. |
| Published | Every other file of the published folder: pages, images and the OpenAPI document | A page that `docs.json` does not list is not in the sidebar, but it still has an address and is in search. |

Never keep private files in the published folder of a repository.

## Docs for AI agents

Every public portal serves AI agents too: an MCP server at `/mcp`, `llms.txt` and the Markdown of each page. See [Docs for AI agents](/ai-agents).

## From code

The API, MCP and the CLI connect a repository and publish the portal with the same steps as the dashboard. See [Connect a GitHub repository](/quickstart#4-connect-your-github-repository) in the API quickstart, and the [GitHub](/api-reference/github) and [Publications](/api-reference/publications) reference.
