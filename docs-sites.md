---
title: Docs sites
description: Publish a GitHub repository as a docs site with search, Ask, an API playground, an MCP server for AI agents and a support mailbox.
---

## Publish your first docs site

1. Open the [dashboard](https://app.revdoku.com/projects). The setup after signup is **Create and publish**.
2. Choose **Connect GitHub**. Install the Revdoku GitHub App on the GitHub account or organization that owns your docs
   repository, and choose the repositories that Revdoku can read. Then choose the repository and **Use this repository**.
   If your docs are in a folder of the repository, or on another branch, choose them under **Branch and folder**.
   A Mintlify repository works as it is.

   No repository yet? Choose **Create a GitHub repository from a template**, pick a template and choose **Create on GitHub**.
   GitHub copies the template into your account. Then choose that copy.
   Every template is a public GitHub repository: `template-api`, `template-product`, `template-mcp-server`, `template-sdk` and `template-mobile-app` at [github.com/revdoku](https://github.com/revdoku).
3. Revdoku copies the files into the project. Then it asks for the name and the subdomain of the site: choose **Publish**.
   Markdown and MDX pages, `docs.json` or `mint.json` navigation and an OpenAPI document become a docs site.
   [Files that sync and publish](#files-that-sync-and-publish) says which files stay out.
4. The site is at `https://<name>.revdoku.net`. Your docs pages are under `/docs/` (see [Site addresses](#site-addresses)).
   On a paid plan, connect your own domain in **Settings** → **Domain**.
   [Pricing](https://app.revdoku.com/pricing) lists what each plan includes.
5. To change a page, change it on GitHub. Each push to the connected branch syncs the files and publishes the site again.

## GitHub repository

Revdoku only reads your repository. It never changes it.

| Topic | What happens |
| --- | --- |
| Access | The Revdoku GitHub App reads only the repositories that you choose on GitHub. It asks for read-only access to their contents and metadata, and read-only access to the members of an organization. |
| Files | The project's folder `_repo/` is a read-only copy of one branch of the repository, or of one folder of it. Change them on GitHub. |
| Knowledge base | Articles that you write in Revdoku, in the folder `_kb/`. The public ones are published with the site under `/help/`. See [Knowledge base](/knowledge-base). |
| Pushes | Each push to the connected branch syncs the files. With **Auto-publish GitHub updates** on (the default), the site then publishes again. Turn it off in **Settings** → **GitHub** to publish by hand. |
| Other branches | Ask for a 24-hour preview of another branch from the menu beside **Republish** in the dashboard, or with the API. A push to another branch builds nothing. |
| A project that has files | Connecting a repository to a project that already has files replaces those files with the repository's files, after you agree. The earlier files stay in the project's versions. The site and its address stay. |
| Disconnect | The project keeps its files, and the site stays live. |

## Publish from code

A publish builds the site in the background. Publish, then read the site until `status` is `ready` or `failed`.

| Task | REST | SDK (TypeScript / Python) | CLI | MCP |
| --- | --- | --- | --- | --- |
| Find the docs folder of a repository | `GET /v1/projects/{project_id}/github/scan` | `scanGithubRepository` / `scan_github_repository` | `revdoku github scan OWNER/NAME --project-id ID` | `project_github` with `action: "scan"` |
| Connect a GitHub repository | `POST /v1/projects/{project_id}/github` | `connectGithubRepository` / `connect_github_repository` | `revdoku github connect OWNER/NAME --project-id ID` | `project_github` with `action: "connect"` |
| Read the GitHub sync state | `GET /v1/projects/{project_id}/github` | `getGithubSync` / `get_github_sync` | `revdoku github --project-id ID` | `project_github` with `action: "get"` |
| Publish or republish | `POST /v1/projects/{project_id}/publication` | `client.api.publishProject` / `client.api.publish_project` | `revdoku publish --project-id ID` | `project_publish` |
| Read the site and its build state | `GET /v1/projects/{project_id}/publication` | `getPublication` / `get_publication` | `revdoku site --project-id ID` | `project_publication_get` |
| Make a 24-hour preview (`branch` previews a repository branch) | `POST /v1/projects/{project_id}/publication/preview` | `previewProject` / `preview_project` | `revdoku preview --project-id ID [--branch NAME]` | `project_publish` with `action: "preview"` |
| Read the preview | `GET /v1/projects/{project_id}/publication/preview` | `getPublicationPreview` / `get_publication_preview` | `revdoku site --preview --project-id ID` | `project_publication_get` with `action: "preview"` |
| Change the site settings | `PATCH /v1/projects/{project_id}/site_settings` | `updateSiteSettings` / `update_site_settings` | `revdoku settings set --file FILE --project-id ID` | `project_publish` with `action: "settings"` |
| Take the site down | `DELETE /v1/projects/{project_id}/publication` | `unpublishProject` / `unpublish_project` | `revdoku unpublish --project-id ID` | `project_publish` with `action: "unpublish"` |

1. Scan the repository and connect its docs folder to the project (see [GitHub repositories](/api#github-repositories)).
   Read the link until `status` is `ready`: the first copy is done.
2. Publish. The response has `status` `queued`. A publish before the first copy is done also has `waiting_for` `github_sync`:
   the site publishes when the copy finishes.
3. Read the site every few seconds. When `status` is `ready`, `url` is the site address.
   When it is `failed`, `error` says why, with a `code` and a `message`.
4. Never repeat a publish automatically after an uncertain result, such as a timeout. Read the site first.

Uses credits; see https://app.revdoku.com/pricing.json.

- The site shows the connected branch. To change it, push to that branch on GitHub.
- Publishing needs **Full access**. Before the first publish, a read of the site answers `null`.
- A folder that looks like source code answers `409 PUBLICATION_SOURCE_CODE`: a site serves every file of the folder.
  Connect the docs folder, or publish with `confirm_source_code` after a person agrees.
- A change of the site settings never publishes. Publish again while the site's `republish_reasons` is not empty.

The [quickstart](/quickstart) has this code in TypeScript, Python and cURL.
See [Sites](/api#sites) for the fields and errors.

## What a docs site includes

A project publishes as a docs site when its root has `docs.json` or `mint.json`, or Markdown pages and no `index.html`.
Other files publish as an ordinary site.

| Feature | What it does |
| --- | --- |
| Pages | Markdown and MDX pages. Mintlify components such as `Card`, `Tabs`, `Steps` and `CodeGroup` become plain HTML. |
| Navigation | From `docs.json` or `mint.json`, or from the folders. |
| API reference | One page for each tag of your OpenAPI document. |
| API playground | Each endpoint of the reference has **Try it**: people send real requests to your API from the page and see the answer and a code sample. The browser sends the request, so your API must allow browser requests (CORS). See [Sites](/api#sites). |
| Search and layouts | Search on every site. The `sidebar`, `notebook` or `minimal` layout, set by `layout` in `docs.json`, when you publish or in **Settings** → **Appearance**. |
| Header and footer | Set in `docs.json`, as on Mintlify: the `logo` and its link, the `favicon`, `navbar` links and a button, `footer` links and a `banner`. **Settings** → **Navigation** in the dashboard sets the header links, the header button and the footer columns in place of the `docs.json` ones. |
| Sections | The header links the sections that have content: **Docs**, your articles (**Help**) and **Support**. |
| Page menu | Each page has Copy page beside its title, and View as Markdown. On a public site it also opens the page in ChatGPT or Claude and gives editors the site's MCP server. Choose the items with `contextual.options` in `docs.json`. |
| Ask | On a public site, readers ask questions. AI answers from your pages. Uses credits; see https://app.revdoku.com/pricing.json. When the AI cannot answer, Ask offers **Contact us**. On a site with Ask, each code block has **Ask about this code**. |
| Support page | `/support/` has a contact form, or your email address or a link to your own support page. Choose it in **Settings** → **Contact form**, or with `support` of the [site settings](/api#site-settings). |
| Page feedback | Each page asks "Was this page helpful?". On a public site with Ask, a reader who answers No can say what they were looking for. The comment shows in the dashboard as anonymous feedback in Analytics → Feedback. |
| Previews | A 24-hour preview of a branch, made when you ask for it from the menu beside **Republish**. |
| Domain | Your own domain for a public site, on a paid plan. |
| Analytics | Page views, searches, page feedback, questions asked with Ask and the AI agents that read your docs. Your code and AI agents read them with the API: see [Site analytics](/api#site-analytics). |

## Site addresses

One site holds your docs, your articles and a support page.

| Address | What it is |
| --- | --- |
| `/` | The main page. It links your docs, your articles and your support page. A site that has only docs shows the home page of the docs there. |
| `/docs/` | The pages of your repository. The repository file `guides/setup.md` is the page `/docs/guides/setup/`, and its index page is `/docs/`. |
| `/help/` | The public articles of the [knowledge base](/knowledge-base). **Settings** → **General** changes this address. |
| `/support/` | The support page, while the site has a way to reach a person. |

Write the links between your pages as before, such as `/guides/setup` or a relative link: a publish changes them to the `/docs/` addresses.
Images, the OpenAPI document and other files keep their address at the root of the site.
`llms.txt`, `/mcp` and the sitemap stay at the root and cover the whole site.

## Files that sync and publish

A project keeps the files of your repository, and the site shows some of them. Three groups:

**Never copied from GitHub.** These files never enter the project, so nothing can publish them. A sync skips them without an error.

| Group | Examples |
| --- | --- |
| Secrets and keys | `.env` and `.env.*`, `.npmrc`, `.pypirc`, `.netrc`, SSH keys such as `id_rsa`, certificates and keys (`.pem`, `.key`, `.p12`, `.crt`), `secrets.*`, `credentials.*`, service account files |
| Cloud and tool folders | `.aws`, `.kube`, `.docker`, `.ssh`, `.gnupg`, `kubeconfig`, `database.yml`, `wp-config.php` |
| Terraform state | `.tfstate`, `.tfvars` |
| Databases, dumps and logs | `.sql`, `.sqlite`, `.db`, `.dump`, `.bak`, `.log` |
| Archives and programs | `.zip`, `.tar`, `.gz`, `.7z`, `.exe`, `.dmg`, `.apk`, `.jar` |
| Workflows and tool state | `.github/workflows`, `.git`, `node_modules`, `.cache`, `.next`, `.DS_Store` |
| Revdoku's own folders | `_agents`, `_revdoku` |
| Too large | A file above the plan's size limit, or a Git LFS pointer. The GitHub page lists it with the reason. |

**Copied into the project, never published.** The project keeps these files, so an AI app that reads the project can read them, but the site never serves them. They are not pages, and they are not in `llms.txt`, search or the MCP server.

| Files | Why |
| --- | --- |
| `AGENTS.md`, `AGENTS.override.md`, `CLAUDE.md`, `CLAUDE.local.md`, `GEMINI.md` | Instructions for AI coding agents. The names match at any depth and in any letter case (`agents.md` too). A docs page with one of these names is not published: name it differently, for example `claude-code.md`. |
| Dot files and dot folders such as `.claude`, `.cursor` and `.github` | Tool settings. The one exception is `.well-known`, which is served. |
| `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`, `wrangler.toml` | Build files |
| `.sh`, `.bat`, `.cmd` and `.ps1` scripts, and `*.local` files | Scripts and local settings |

**Published.** Every other file of the published folder: Markdown and MDX pages, images, the OpenAPI document and other assets. A page that `docs.json` does not list stays out of the sidebar, but it is still published: it has a URL and it is in search and `llms.txt`.
Never keep private files in the published folder of a repository.

## Docs for AI agents

Every public docs site serves AI agents, without sign-in.

| Address | What it does |
| --- | --- |
| `POST <site>/mcp` | An MCP server (Streamable HTTP) with the read-only tools `search_docs`, `read_page` and `list_pages`. |
| `GET <site>/_revdoku/search?q=` | Full-text search as JSON. `limit` is 1 to 20 (default 8). |
| `GET <site>/llms.txt` | The pages by navigation group, with a summary of each page. |
| `GET <site>/llms-full.txt` | Every page in one file. |
| `GET <site>/.well-known/mcp` | The discovery document that names the MCP server. |
| `GET <page>.md` | The Markdown of one page: its URL with `.md` in place of the last slash, for example `<site>/docs/guides/setup.md`. |

To give an AI app your docs, add `<site>/mcp` as a remote MCP server with the Streamable HTTP transport. It needs no sign-in.
For example, in Claude Code:

```sh
claude mcp add --transport http acme-docs https://acme-api.revdoku.net/mcp
```

The **For AI agents** footer of each page links the MCP server, `llms.txt` and the Markdown of that page.
Too many requests from one network answer `429` with `Retry-After`.
The MCP server of a docs site reads only that site. To manage your projects from an AI app, connect the [hosted MCP server](/projects#connect-an-ai-client).

## Support mailbox

The project's mailbox is the support channel of its docs.

1. A reader asks a question with **Ask** on a public docs site. The answer comes from your pages and names them.
   A question that matches no page, such as "what is that?", gets an answer from the page where the reader asks it.
2. When the answer does not help, the reader chooses **Contact us** and enters an email address and the message. There is no code to enter.
   The support page of the site, `/support/`, has the same form.
   The form shows while the project's mailbox can receive email and reply to its senders.
3. The message arrives in the project's mailbox as an email. The dashboard shows each conversation as a support ticket.
4. The AI reply drafter writes a draft of the reply from your docs: when a person selects **Generate reply**, or by itself
   on plans with automatic drafts. A person reviews, edits and sends it in the dashboard.
   An AI app can also start a draft and send the reply with the API, MCP or the CLI (see [Draft a reply](/api#draft-a-reply)).

The site shows the project's email address only when you choose that in **Settings** → **Contact form**. There you can also send visitors to your own support page in place of the form. People can also email the address directly.
Your code reads the same email with the API: see [Receive and read email](/projects#receive-and-read-email).
