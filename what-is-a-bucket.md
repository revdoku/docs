---
title: What is a bucket
description: A bucket is one Revdoku project. It holds your files, your docs site, its analytics, its support email and the agents that work on that email.
---

A bucket is one Revdoku project. Most teams make one bucket for each docs site.

## What a bucket holds

| Part | What it is |
| --- | --- |
| Files | The bucket root. It can be a copy of a GitHub repository, or files that you upload. |
| Site | The docs website that Revdoku publishes from the files. It has search, Ask, an MCP server for AI agents and `llms.txt`. See [Docs sites](/docs-sites). |
| Analytics | The traffic of the site, split into AI agents, humans and bots. |
| Support | The email address of the bucket and its tickets. A message that a reader leaves in the Ask panel of the site and an email that someone sends to the address both become a ticket. You reply from the dashboard, the API or MCP. See [Support](/support). |
| Agents | Agents that work on incoming email. The built-in support agent drafts replies from your docs for a person to send. |

## Bucket and site

The dashboard says site. The API, MCP tools, CLI and SDKs say bucket. Both words name the same thing.

| Dashboard | API, MCP, CLI and SDKs |
| --- | --- |
| Site | Bucket (`/v1/buckets`, `bucket_*` tools, `--bucket-id`) |
| Site ID | Bucket ID, which starts with `bkt_` |
| Site settings | Bucket and `publication` settings |
| Support | Tickets (`/v1/buckets/{bucket_id}/tickets`, `bucket_ticket_*` tools) |

## One name for the site and the email

A bucket has one name. The same name is the site address and the name of the support email.
For example, the bucket `acme-docs` has the site `acme-docs.<sites domain>` and the email `acme-docs@revdokumail.com`.

Use a custom domain for the site when you want your own address. See [Docs sites](/docs-sites).

## Next steps

- [Quickstart](/quickstart): create a bucket and publish a site from your code.
- [Docs sites](/docs-sites): connect a GitHub repository and publish it.
- [Buckets, email and files](/buckets): create buckets and work with email and files through the API.
- [API guide](/api), [MCP](/mcp) and [CLI](/cli): the interfaces that manage buckets.
