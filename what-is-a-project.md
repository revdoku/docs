---
title: What is a project
description: A project holds your files, your docs site, its analytics, its support email and the agents that work on that email.
---

A project is the unit of work in Revdoku. Most teams make one project for each docs site.

## What a project holds

| Part | What it is |
| --- | --- |
| Files | A read-only copy of a GitHub repository, or of one folder of it. Change the files on GitHub; each push syncs them. The [knowledge base](/knowledge-base) holds the articles that you write in Revdoku. |
| Site | The docs website that Revdoku publishes from the files. It has search, Ask, an MCP server for AI agents and `llms.txt`. See [Docs sites](/docs-sites). |
| Analytics | The traffic of the site, split into AI agents, humans and bots. |
| Support | The email address of the project and its tickets. A message that a reader leaves on the site becomes a ticket. On a paid plan an email that someone sends to the address does too; on the Free plan an email only continues a ticket. You reply from the dashboard, the API or MCP. See [Pricing](https://app.revdoku.com/pricing). |
| Agents | Agents that work on incoming email. The AI reply drafter writes draft replies from your docs for a person to send. |

## Project and site

A project is the whole: the files, the site, the analytics, the support and the agents. The site is the published docs website of a project.
The dashboard, the API, the MCP tools, the CLI and the SDKs all say project (`/v1/projects`, `project_*` tools, `--project-id`). A project ID starts with `prj_`.

## One name for the site and the email

A project has one name. The same name is the site address and the name of the support email.
For example, the project `acme-docs` has the site `acme-docs.revdoku.net` and the email `support@acme-docs.revdoku.net`.

Use a custom domain for the site when you want your own address (paid plans). See [Docs sites](/docs-sites).

## Next steps

- [Quickstart](/quickstart): create a project and publish a site from your code.
- [Docs sites](/docs-sites): connect a GitHub repository and publish it.
- [Projects, email and files](/projects): create projects and work with email and files through the API.
- [API guide](/api), [MCP](/mcp) and [CLI](/cli): the interfaces that manage projects.
