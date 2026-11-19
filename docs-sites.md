---
title: Docs sites
description: Publish a GitHub repository as a docs site with search, Ask, an API console, an MCP server for AI agents and a support mailbox.
---

## Publish your first docs site

1. Open the [dashboard](https://app.revdoku.com/buckets). The setup after signup is **Create and publish**.
2. Choose **Connect GitHub**. Install the Revdoku GitHub App on the GitHub account or organization that owns your docs
   repository, and choose the repositories that Revdoku can read. Then choose the repository and **Use this repository**.
   If your docs are in a folder of the repository, or on another branch, choose them under **Branch and folder**.
   A Mintlify repository works as it is.

   No repository yet? Choose **Create a GitHub repository from a template**, pick a template and choose **Create on GitHub**.
   GitHub copies the template into your account. Then choose that copy.
   Every template is a public GitHub repository: `template-api`, `template-product`, `template-mcp-server`, `template-sdk` and `template-mobile-app` at [github.com/revdoku](https://github.com/revdoku).
3. Revdoku copies the files into the bucket. Then it asks for a name: choose **Publish**.
   Markdown and MDX pages, `docs.json` or `mint.json` navigation and an OpenAPI document become a docs site.
   [Files that sync and publish](#files-that-sync-and-publish) says which files stay out.
4. The site is at `https://<name>.revdoku.site`. Connect your own domain on the site's **Domain** page.
   [Pricing](https://app.revdoku.com/pricing) lists what each plan includes.
5. To change a page, change it on GitHub. Each push to the connected branch syncs the files and publishes the site again.

## GitHub repository

Revdoku only reads your repository. It never changes it.

| Topic | What happens |
| --- | --- |
| Access | The Revdoku GitHub App reads only the repositories that you choose on GitHub. It asks for read-only access to their contents and metadata, and read-only access to the members of an organization. |
| Files | The bucket's folder `_repo/` is a read-only copy of one branch of the repository, or of one folder of it. Change them on GitHub. |
| Knowledge base | Articles that you write in Revdoku, in the folder `_kb/`. The public ones are published with the site under `/help/`. See [Knowledge base](/knowledge-base). |
| Pushes | Each push to the connected branch syncs the files. With **Auto-publish GitHub updates** on (the default), the site then publishes again. Turn it off in **Settings** → **GitHub** to publish by hand. |
| Other branches | Ask for a 24-hour preview of another branch with **New preview** on the Overview, or with the API. A push to another branch builds nothing. |
| A bucket that has files | Connecting a repository to a bucket that already has files replaces those files with the repository's files, after you agree. The earlier files stay in the bucket's versions. The site and its address stay. |
| Disconnect | The bucket keeps its files, and the site stays live. |

## Publish from code

A publish builds the site in the background. Publish, then read the site until `publish_state` is `ready` or `failed`.

| Task | REST | SDK (TypeScript / Python) | CLI | MCP |
| --- | --- | --- | --- | --- |
| Connect a GitHub repository | `POST /v1/buckets/{bucket_id}/github` | `connectGithubRepository` / `connect_github_repository` | `revdoku github connect OWNER/NAME --bucket-id ID` | `bucket_github` with `action: "connect"` |
| Read the GitHub sync state | `GET /v1/buckets/{bucket_id}/github` | `getGithubSync` / `get_github_sync` | `revdoku github --bucket-id ID` | `bucket_github` |
| Publish or republish | `POST /v1/buckets/{bucket_id}/publication` | `client.api.publishBucket` / `client.api.publish_bucket` | `revdoku publish --bucket-id ID` | `bucket_publish` |
| Read the site and its build state | `GET /v1/buckets/{bucket_id}/publication` | `getPublication` / `get_publication` | `revdoku site --bucket-id ID` | `bucket_publication_get` |
| Make a 24-hour preview (`branch` previews a repository branch) | `POST /v1/buckets/{bucket_id}/publication/preview` | `previewBucket` / `preview_bucket` | `revdoku preview --bucket-id ID [--branch NAME]` | `bucket_publish` with `action: "preview"` |
| Read the preview | `GET /v1/buckets/{bucket_id}/publication/preview` | `getPublicationPreview` / `get_publication_preview` | `revdoku site --preview --bucket-id ID` | `bucket_publication_get` with `preview: true` |
| Take the site down | `DELETE /v1/buckets/{bucket_id}/publication` | `unpublishBucket` / `unpublish_bucket` | `revdoku unpublish --bucket-id ID` | `bucket_publish` with `action: "unpublish"` |

1. Connect a GitHub repository to the bucket (see [GitHub repositories](/api#github-repositories)).
   Read the link until `last_synced_at` is set: the first sync is done.
2. Publish. The response has `publish_state` `queued`.
3. Read the site every few seconds. When `publish_state` is `ready`, `url` is the site address.
   When it is `failed`, `publish_error` says why.
4. Never repeat a publish automatically after an uncertain result, such as a timeout. Read the site first.

Publishing and previews use credits; see the [pricing page](https://app.revdoku.com/pricing) and [`/pricing.json`](https://app.revdoku.com/pricing.json).

- The site shows the connected branch. To change it, push to that branch on GitHub.
- Publishing needs **Full access**. Before the first publish, a read of the site answers `404 PUBLICATION_NOT_FOUND`.

The [quickstart](/quickstart) has this code in TypeScript, Python and cURL.
See [Sites](/api#sites) for the fields and errors.

## What a docs site includes

A bucket publishes as a docs site when its root has `docs.json` or `mint.json`, or Markdown pages and no `index.html`.
Other files publish as an ordinary site.

| Feature | What it does |
| --- | --- |
| Pages | Markdown and MDX pages. Mintlify components such as `Card`, `Tabs`, `Steps` and `CodeGroup` become plain HTML. |
| Navigation | From `docs.json` or `mint.json`, or from the folders. |
| API reference | One page for each tag of your OpenAPI document. |
| API console | At `/api-reference/console/`, people send real requests to your API. On a public site, the requests go through the site, so your API needs no CORS setup. See [Sites](/api#sites). |
| Search and layouts | Full-text search on every site. The `sidebar`, `notebook` or `minimal` layout, set by `layout` in `docs.json` or when you publish. |
| Header and footer | Set in `docs.json`, as on Mintlify: the `logo` and its link, the `favicon`, `navbar` links and a button, `footer` links and a `banner`. |
| Page menu | Each page has Copy page and View as Markdown. On a public site it also opens the page in ChatGPT or Claude and gives editors the site's MCP server. Choose the items with `contextual.options` in `docs.json`. |
| Ask | On a public site, readers ask questions. AI answers from your pages and uses credits: see https://app.revdoku.com/pricing. When the AI cannot answer, Ask offers a message to your support. |
| Page feedback | Each page asks "Was this page helpful?". On a public site with Ask, a reader who answers No can say what they were looking for. The comment shows in the dashboard as anonymous feedback in Analytics → Ask. |
| Previews | A 24-hour preview of your files or of a branch, made from the Overview when you ask for it. |
| Domain | Your own domain for a public site. |
| Analytics | Page views, searches, page feedback, questions asked with Ask and the AI agents that read your docs. Your code and AI agents read them with the API: see [Site analytics](/api#site-analytics). |

## Header and footer

The header and the footer of a docs site come from the file `docs.json` in the root of your docs folder
in your GitHub repository. Revdoku reads the same keys as Mintlify, so a Mintlify repository keeps its header and footer.
Change the file on GitHub and push: the site publishes again with the new links.

| What you see | Key in `docs.json` | Notes |
| --- | --- | --- |
| Text links in the header | `navbar.links` | At most 8. Each has `label` and `href`. `"type": "github"` or `"discord"` names a link without a label. Phones hide these links. |
| The button in the header | `navbar.primary` | One button in your primary color, with `label` and `href`. |
| The logo and where it leads | `logo.light`, `logo.dark`, `logo.href` | Without `logo.href` the logo opens the home page. |
| Link columns in the footer | `footer.links` | At most 4 columns. Each has `header` and `items`, and each item has `label` and `href`. |
| Social links in the footer | `footer.socials` | For example `"github"`, `"x"` and `"linkedin"`, each with its address. |
| A line above the header | `banner` | `content` is one line of Markdown. `type` is `info`, `warning` or `critical`. With `"dismissible": true` a visitor can close it. |
| The primary color | `colors.primary` | |

A link is a web address (`https://…`), an email link (`mailto:…`) or a page of your site (`/quickstart`).

```json
{
  "navbar": {
    "links": [
      { "label": "Dashboard", "href": "https://app.example.com" },
      { "type": "github", "href": "https://github.com/example/docs" }
    ],
    "primary": { "label": "Start free", "href": "https://app.example.com/signup" }
  },
  "footer": {
    "socials": { "github": "https://github.com/example", "x": "https://x.com/example" },
    "links": [
      { "header": "Product", "items": [ { "label": "Pricing", "href": "https://example.com/pricing" } ] },
      { "header": "Company", "items": [ { "label": "Contact", "href": "mailto:hello@example.com" } ] }
    ]
  },
  "banner": { "content": "Version 2 is out. [Read the notes](/changelog).", "type": "info", "dismissible": true }
}
```

Under your footer, every docs page has one row that Revdoku adds: the links for AI agents and **Privacy**.
You cannot change that row.

### Prompt for your coding agent

Open your docs repository in Claude Code, Codex, Cursor or another coding agent, and paste this prompt.
Replace the last paragraph with what you want.

```text
This repository holds the docs of a Revdoku docs site. Its header and footer come from docs.json in the docs folder.
Change only docs.json, and keep every key that I do not name below as it is. Keep the file valid JSON.

The keys:
- navbar.links: at most 8 text links in the header, each {"label", "href"}. {"type": "github", "href"} or
  {"type": "discord", "href"} needs no label.
- navbar.primary: one header button, {"label", "href"}.
- logo.href: where the logo leads.
- footer.links: at most 4 columns, each {"header", "items": [{"label", "href"}]}.
- footer.socials: an object such as {"github": "https://…", "x": "https://…", "linkedin": "https://…"}.
- banner: {"content": one line of Markdown, "type": "info" | "warning" | "critical", "dismissible": true | false}.
- A link is https://…, mailto:… or a path of the site such as /quickstart. Use no other link kind.

When you are done, show me the diff of docs.json, then commit it and push it to the branch that the site publishes
(ask me for the branch if you are not sure). The site publishes again after the push.

What I want: <for example: add a "Status" link to the header, remove the Discord link, and add a footer column
"Legal" with links to /terms and /privacy>
```

## Files that sync and publish

A bucket keeps the files of your repository, and the site shows some of them. Three groups:

**Never copied from GitHub.** These files never enter the bucket, so nothing can publish them. A sync skips them without an error.

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

**Copied into the bucket, never published.** The bucket keeps these files, so an AI app that reads the bucket can read them, but the site never serves them. They are not pages, and they are not in `llms.txt`, search or the MCP server.

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
| `GET <page>.md` | The Markdown of one page: its URL with `.md` in place of the last slash, for example `<site>/guides/setup.md`. |

To give an AI app your docs, add `<site>/mcp` as a remote MCP server with the Streamable HTTP transport. It needs no sign-in.
For example, in Claude Code:

```sh
claude mcp add --transport http acme-docs https://acme-api.revdoku.site/mcp
```

The **For AI agents** footer of each page links the MCP server, `llms.txt` and the Markdown of that page.
Too many requests from one network answer `429 RATE_LIMITED` with `Retry-After`.
The MCP server of a docs site reads only that site. To manage your buckets from an AI app, connect the [hosted MCP server](/buckets#connect-an-ai-client).

## Support mailbox

The bucket's mailbox is the support channel of its docs.

1. A reader asks a question with **Ask** on a public docs site. The answer comes from your pages and names them.
   A question that matches no page, such as "what is that?", gets an answer from the page where the reader asks it.
2. When the answer does not help, the reader chooses **Leave a message** and enters a name, an email address and the message. There is no code to enter.
   **Leave a message** shows while the bucket's mailbox can receive email and reply to its senders.
3. The message arrives in the bucket's mailbox as an email. The dashboard shows each conversation as a support ticket.
4. A built-in support agent drafts a reply from your docs. A person reviews, edits and sends each reply in the dashboard.
   The reader did not confirm the address, so API keys, MCP and agents only draft email to it: a person sends it.

The site never shows the bucket's email address. People can also email the address directly.
Your code reads the same email with the API: see [Receive and read email](/buckets#receive-and-read-email).
