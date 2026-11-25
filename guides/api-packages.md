---
title: Revdoku packages and integrations
sidebarTitle: Packages and integrations
description: Choose the TypeScript or Python SDK, n8n, Zapier, the CLI or MCP to work with projects, docs sites and support email.
---

Choose the TypeScript or Python SDK for backend code, n8n or Zapier for automation, the CLI for terminal work, or hosted MCP for an AI connection. All use the same Revdoku accounts and projects. Each project has a support email address and a read-only copy of a GitHub repository.

## Install a package

| Language or platform | Package | Install | Guide |
| --- | --- | --- | --- |
| TypeScript and JavaScript (Node.js 22 or later) | `revdoku` on npm | [Command below](#typescript-and-javascript) | [TypeScript SDK](/sdks/typescript) · [source](https://github.com/revdoku/revdoku-typescript) |
| Python 3.10 or later | `revdoku` on PyPI | [Command below](#python) | [Python SDK](/sdks/python) · [source](https://github.com/revdoku/revdoku-python) |
| n8n | `n8n-nodes-revdoku` | [Build and install on self-hosted n8n](https://github.com/revdoku/revdoku-n8n/blob/main/USAGE.md#install-from-source) | [n8n usage](https://github.com/revdoku/revdoku-n8n/blob/main/USAGE.md) |
| Zapier | Revdoku | [Request Zapier access](mailto:support@revdoku.com?subject=Revdoku%20Zapier%20access) | [Zapier tutorial](https://github.com/revdoku/revdoku-zapier/blob/main/TUTORIAL.md) |

### TypeScript and JavaScript

```sh
npm install revdoku
```

### Python

```sh
pip install revdoku
```

The `revdoku` packages are API libraries. For the `revdoku` command-line tool, see the [CLI guide](/cli).

n8n is available for self-hosted n8n, not n8n Cloud. For Zapier, request access from support before you start.

To make your first request, follow the [quickstart](/quickstart). For direct HTTP calls without an SDK, use the [JavaScript, TypeScript and Python examples](https://github.com/revdoku/docs/tree/main/examples). For AI agents, use the [skill or plugin](https://github.com/revdoku/revdoku#local-ai-apps) or [hosted MCP](/mcp).

## What each package covers

The TypeScript and Python SDKs are generated from [OpenAPI](/openapi.json), which lists every public REST operation. The [API reference](/api-reference) shows each operation with SDK and cURL examples.
n8n and Zapier are for a person who runs a docs site on Revdoku and wants its support requests in other tools.

| Capability | SDKs | n8n | Zapier |
| --- | --- | --- | --- |
| Choose a project | `listProjects` / `list_projects` | Project dropdown | Project dropdown |
| Create projects, connect GitHub, publish, site settings, website scan | Yes | Use direct HTTP | Use direct HTTP |
| New support requests | Poll `listTickets` / `list_tickets` with `updatedAfter`, or a webhook | Revdoku Trigger: New Support Request | Trigger: New Support Request |
| Read tickets and messages | Yes | Ticket Get and Get Many, Message Get and Get Many | Find Ticket |
| Reply to the requester | Yes | Ticket Reply | Reply to Ticket |
| Solve, reopen or label a ticket | Yes | Ticket Update | Solve or Reopen Ticket (no labels) |
| Let the AI draft a reply | `startTicketDraft` / `start_ticket_draft` | Use direct HTTP | Use direct HTTP |
| Download an attachment or the original email | `downloadAttachment` / `download_attachment` return bytes; the other download operations return a temporary link | Download Attachment, Download Original (binary data) | Use direct HTTP |
| Read and write files | Yes | Use direct HTTP | Use direct HTTP |
| Webhooks and live subscriptions | Yes; the receiver/WebSocket loop is application code | The trigger polls | The trigger polls |
| Address changes, aliases, sender restrictions and custom email domains | Dashboard only | Dashboard only | Dashboard only |

A project's `_repo/` files are a read-only copy of its GitHub repository: change them on GitHub. See [Files](/api#files) and [GitHub repositories](/api#github-repositories).

`account_id` selects a granted account. Omitting it uses the key's default; a project ID or a dashboard account switch does not select another account for that key. Discover accounts through `GET /v1/accounts`, `client.api.listAccounts` / `client.api.list_accounts`, CLI `revdoku accounts`, or MCP `account_list`.

| ID | Use |
| --- | --- |
| `acct_...` | Account containing the project |
| `prj_...` | Project ID |
| `tkt_...` | Ticket ID |
| `eml_...` | Message ID (`message_id` in paths and in ticket events) |
| `eat_...` | Attachment ID: one entry's `id` from the message's `attachments` array |
| `headers.message_id` | The sender's Message-ID header; it is not the Revdoku message ID |

## URLs and response fields

| Caller | API configuration | Message text |
| --- | --- | --- |
| Raw HTTP | Requests go to `https://api.revdoku.com`; every path starts with `/v1`, for example `https://api.revdoku.com/v1/projects` | `response.data.message.body_text` |
| TypeScript SDK | Default origin `https://api.revdoku.com`, without `/v1` | `(await client.getTicketMessage({ projectId, ticketId, messageId })).data.message.bodyText` |
| Python SDK | Same default origin | `client.get_ticket_message(project_id, ticket_id, message_id).data.message.body_text` |
| n8n trigger | Configured by the node | `$json.body_text` |
| Zapier trigger | Configured by the integration | Map **Message Text** |

JSON and Python use snake_case names; TypeScript uses camelCase. Success responses keep `data` with a named resource. The messages of a ticket carry their text: 20 on a page by default, at most 50.

## New support request processing

| Approach | First run | Later runs and recovery |
| --- | --- | --- |
| Application with a saved check time (SDK or HTTP) | Starts where the application chooses | Save the newest ticket `updated_at` after processing and pass it as `updated_after`; keep the account and project fixed and deduplicate effects by message ID |
| n8n New Support Request | The first poll after activation starts no workflow: it marks the requests of the last 24 hours as seen | Each later poll emits each new request once, oldest first |
| Zapier New Support Request | Samples recent requests during setup | Reads the tickets with activity in the last 24 hours; Zapier deduplicates message IDs |
| CLI `tickets` / MCP `project_ticket_list` | Lists according to the supplied filters | The caller must save the newest `updated_at` and pass it as `updated_after` for continued polling |

Reading or downloading does not mark a message read. Read status is shared with dashboard users and other integrations, so it cannot identify what one consumer has processed. See the [API polling workflow](/api#poll-for-new-tickets) and the [webhook and live-event examples](https://github.com/revdoku/docs/blob/main/examples/README.md#ticket-events).

## Downloads

| Surface | Result | Next step |
| --- | --- | --- |
| SDK `downloadAttachment` / `download_attachment` | Attachment bytes, up to a size limit you can change | Save or process the bytes |
| SDK download-link operations | `data.download` with `url`, `name`, `content_type`, `size_bytes` and `expires_in_seconds` | Fetch that URL with an ordinary HTTP client without the API key |
| n8n Download Attachment, Download Original | Binary field `data` by default | Select that binary field on the next upload/storage node |
| CLI `ticket-download ... --output PATH` | Saved local file | Open or process that path |
| MCP `project_ticket_download` | Temporary download link | Use the returned link; hosted agents need an available download tool to retrieve bytes |

Temporary URLs expire after 15 minutes. Request another link when needed; do not store it as a permanent attachment URL. Body text can be null or truncated, so inspect `body_status`. Attachments remain separate files, and the original EML is available for the full original message.

## Errors and creation recovery

An API error has an HTTP status and `error.code`, `error.message`, `error.details` (or `null`), `error.next_action` and `error.request_id`. API error responses raise `RevdokuError`. Network, timeout and TLS failures raise the runtime's own errors (Node: `FetchError` from the SDK with the original error as `cause`; Python: urllib3 exceptions such as `urllib3.exceptions.SSLError`). Do not expect `data` on a failed call.

For `EMAIL_NOT_READY`, inspect `error.details.project_id` and read that retained project's receiving state. For a timeout with no response, reconcile the project list before another creation attempt. Repeating creation can create a second project and consume more capacity. Any `429` or `503` response with `Retry-After` (for example `503 EMAIL_LABELING_PENDING` or `503 EMAIL_INDEX_BUILDING`): wait that many seconds, then try the read again. `429 EMAIL_SEND_RATE_LIMITED` sent nothing: the reply may be sent once more after `error.details.retry_after_seconds`. Never retry `EMAIL_LOOP_DETECTED`, and never retry creating a project, publishing or sending a reply automatically after an uncertain result. A monthly creation-capacity error requires waiting for its reset or changing capacity. [Full error reference](/api#errors).
