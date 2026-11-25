---
title: Docs for AI agents
description: Every public portal has an MCP server, llms.txt and a Markdown copy of each page, so that AI apps read your docs.
---

People ask ChatGPT, Claude and coding agents about your product. Every public portal gives those AI apps your docs, without sign-in.

| Address | What it gives |
| --- | --- |
| `<portal>/mcp` | An MCP server with three read-only tools: `search_docs`, `read_page` and `list_pages`. |
| `<portal>/llms.txt` | The pages by section, with a summary of each page. |
| `<portal>/llms-full.txt` | Every page in one file. |
| `<page>.md` | The Markdown of one page: its address with `.md` in place of the last slash, such as `/docs/guides/setup.md`. |
| `<portal>/_revdoku/search?q=` | Search results as JSON. |
| `<portal>/.well-known/mcp` | The discovery document that names the MCP server. |

The footer of every page links these addresses under **For AI agents**.

## Add your docs to an AI app

Add `<portal>/mcp` as a remote MCP server with the Streamable HTTP transport. It needs no sign-in. In Claude Code:

```sh
claude mcp add --transport http acme-docs https://acme.revdoku.net/mcp
```

The page menu beside the title of each page also has **Copy MCP server URL**.

## What AI agents can read

The MCP server reads only the published pages of your portal: your docs and your articles. It never reads private notes, articles marked **Do not publish** or support tickets.

Too many requests from one network get `429` with `Retry-After`. **Analytics** shows which AI agents read your docs, and what they search.

## Manage your projects from an AI app

The MCP server of a portal only reads its docs. To let an AI app publish your portal, write articles or answer tickets, connect the Revdoku MCP server: see [MCP](/mcp).
