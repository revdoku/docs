---
title: Docs sites
description: Publish a GitHub repository as a docs site with search, Ask AI, an API console, an MCP server for AI agents and a support mailbox.
---

## Publish your first docs site

1. Open the [dashboard](https://app.revdoku.com/buckets). The setup after signup asks where your docs come from.
2. Choose **Connect a GitHub repository**, give the Revdoku GitHub App access to the repository, and choose its branch.
   A Mintlify repository works as it is. If your docs are in a folder of the repository, choose that folder.
   Or choose **Start from the docs template**. On Free, it first copies the template to a new repository in your GitHub account.
   On paid plans you can also **Upload files**. On Free, sites publish from a connected GitHub repository.
3. Revdoku copies the files into the bucket. Markdown and MDX pages, `docs.json` or `mint.json` navigation and an OpenAPI document become a docs site.
4. Choose **Publish**. Choose the address and a layout.
   The site is at `https://<name>.revdoku.site`. Connect your own domain on the site's **Domain** page.
   [Pricing](https://app.revdoku.com/pricing) lists what each plan includes.
5. After the first publish, each push to the connected branch publishes the site again.
   A push to another branch makes a 24-hour preview, and GitHub shows its link on the commit.
6. Edits that you make in Revdoku go back to the branch as a commit or a pull request.
   Choose how on the site's **GitHub** page.

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

1. Add the docs to the bucket. Connect a GitHub repository (see [GitHub repositories](/api#github-repositories)),
   or [upload files](/api#upload-a-file). Publish after the link has `last_synced_at`.
2. Publish. The response has `publish_state` `queued`.
3. Read the site every few seconds. When `publish_state` is `ready`, `url` is the site address.
   When it is `failed`, `publish_error` says why.
4. Never repeat a publish automatically after an uncertain result, such as a timeout. Read the site first.

Publishing and previews use credits; see the [pricing page](https://app.revdoku.com/pricing) and [`/pricing.json`](https://app.revdoku.com/pricing.json).

- On Free, sites publish from a connected GitHub repository that synced at least once.
  A publish of uploaded files answers `403 PUBLICATION_UPGRADE_REQUIRED` with `details.github_required: true` and `details.upgrade_url`.
  On paid plans you can also publish uploaded files.
- With a GitHub link, the site shows the connected branch. Edits made in Revdoku reach the site after they are on the branch.
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
| Ask | On a public site, readers ask questions. While the account has credits, AI answers from your pages; without credits, Ask shows the matching pages. When the AI cannot answer, Ask offers a message to your support. |
| Page feedback | Each page asks "Was this page helpful?". On a public site with Ask, a reader who answers No can say what they were looking for. The comment reaches your support as anonymous feedback. |
| Previews | A 24-hour preview for each pushed branch. |
| Domain | Your own domain for a public site. |
| Analytics | Page views, searches, page feedback, questions asked with Ask and the AI agents that read your docs. |

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
