---
title: Domain and design
description: Use your own domain, and change the layout, colors, header and footer of your portal.
---

Changes of the appearance, the header and footer, and the general settings show on your portal after the next publish. Select **Republish** at the top of the page.

## Custom domain

Your portal starts at `https://<name>.revdoku.net`. You can serve it from your own domain instead, such as `help.acme.com`. A custom domain needs a paid plan.

1. Open **Settings** → **Domain**, enter your domain and select **Continue**.
2. Add the DNS records that the page shows at your DNS provider. Each record has a copy button.
3. Revdoku checks the records every few seconds. When they are correct, it gets an HTTPS certificate and the domain goes live.
4. Select **Republish** once, so that the sitemap and the links of your pages use the new domain.

| Record | Purpose |
| --- | --- |
| Ownership (`TXT`) | Proves that you own the domain. Add it within 72 hours. |
| Website routing (`CNAME`) | Sends visitors to your portal. |
| HTTPS | Lets Revdoku get the certificate for your domain. |

If your DNS is on Cloudflare, set each `CNAME` to **DNS only** (proxy off). Keep the records after the domain goes live: HTTPS renewal needs them.

On your own domain, add a security check for Ask: see [Security check on your domain](/guides/ask-security-check).

To change the `revdoku.net` address, select the pencil beside **Website address** on the same page. The support email address moves to the new name too.

## Appearance

**Settings** → **Appearance**:

| Setting | Choices |
| --- | --- |
| Layout | **Sidebar** (pages on the left, contents on the right), **Notebook** (one tab per section) or **Minimal** (one column, pages in a menu). |
| Colors | The primary color of links and buttons. White text must be easy to read on it. |
| Announcement | One line at the top of every page, such as news or a sale. Needs a paid plan. |
| Icon | The `favicon` in `docs.json`. |

`layout`, `logo`, `favicon` and `colors` in `docs.json` work too. A setting that you save in the dashboard wins over `docs.json`.

## Header and footer

**Settings** → **Navigation** has two tabs, **Header** and **Footer**. Each tab shows a preview.

- **Header**: up to 8 links and one button, such as **Sign up**. Revdoku adds the links of your sections (Docs, Articles and Support) itself.
- **Footer**: up to 4 columns of links.
- **Copy from** → **GitHub repository** fills the fields from `docs.json`.

## General settings

**Settings** → **General**:

| Setting | What it does |
| --- | --- |
| Name | The name of your portal. It is also the sender name of your replies. |
| Knowledge base address | The address of your articles, `/help/` by default. |
| Show Revdoku badge | The small "published with Revdoku" link. Paid plans can hide it. |
| Hide this site from search engines | Asks search engines not to list your portal. |
| Unpublish site… | Takes the portal offline. Your files, settings and domain stay. |

## From code

`GET` and `PATCH /v1/projects/{project_id}/site_settings` read and change the layout, Ask, the contact form, the header, the footer, the color and the announcement. See [Change the site settings](/api-reference/publications#change-the-site-settings). The custom domain and the website address change only in the dashboard.
