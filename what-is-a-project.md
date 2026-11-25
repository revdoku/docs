---
title: What is a project
description: A project is one support portal for one product, with docs, articles, AI answers and support tickets.
---

A project is one support portal for one product. It holds what your customers need to help themselves, and what your team needs to help them.

| Part | What it is | Where you manage it |
| --- | --- | --- |
| Docs | Your documentation, copied from a GitHub repository. Each push updates it. | GitHub, and **Settings** → **GitHub** |
| Articles | Help articles that visitors read, and private notes for your team. | **Help Center** |
| Site | The portal that people visit: your docs, your articles, search, Ask and a support page. | **Overview** and **Settings** |
| Ask | The AI Support Agent. It answers questions from your docs and articles. | **Settings** → **Search & Ask** |
| Support tickets | Requests from the contact form and from email. You reply by email. | **Tickets** |
| Analytics | Who reads your portal (people, AI agents and bots) and what they search and ask. | **Analytics** |

## How a visitor gets help

<Steps>

<Step title="Search and read">

A visitor opens your portal and searches your docs and articles.

</Step>
<Step title="Ask">

The visitor asks a question. The AI Support Agent answers from your pages and links them.

</Step>
<Step title="Contact a person">

When the answer does not help, the visitor selects **Contact us** and sends a message with an email address.

</Step>
<Step title="Your team replies">

The message becomes a support ticket. You reply in the dashboard, and the visitor gets the reply by email.

</Step>

</Steps>

## One name for the portal and its email

A project has one name. For the project `acme`:

- The portal is at `https://acme.revdoku.net`. You can connect your own domain, such as `help.acme.com`. See [Domain and design](/customize#custom-domain).
- The support email address is `support@acme.revdoku.net`. Your replies to visitors come from this address.

## Addresses of a portal

| Address | What it shows |
| --- | --- |
| `/` | The main page, with links to your docs, your articles and support. |
| `/docs/` | Your docs from GitHub. |
| `/help/` | Your articles. You can change this address in **Settings** → **General**. |
| `/support/` | The support page with the contact form. |

## Projects in the API

The API, MCP, the CLI and the SDKs use the same word: `/v1/projects`, the `project_*` tools and `--project-id`. A project ID starts with `prj_`. The published website of a project is its site, which the API calls a `publication`.

[Pricing](https://app.revdoku.com/pricing) shows how many projects each plan includes.
