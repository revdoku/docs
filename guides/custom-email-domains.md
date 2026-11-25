---
title: Your own email domain
sidebarTitle: Your own email domain
description: Receive support email at an address on your own domain, such as support@mail.acme.com.
---

Every project has a support address on Revdoku's domain, such as `support@acme.revdoku.net`. With your own email domain, a project can also receive at an address such as `support@mail.acme.com`. Your replies still come from the `revdoku.net` address. Custom email domains need a paid plan: see [Pricing](https://app.revdoku.com/pricing).

## Connect a domain

An account owner or administrator connects the domain.

1. Open [Account Settings → Email domains](https://app.revdoku.com/account/domains) and enter the hostname.
2. Add the DNS records that the page shows at your DNS provider.
3. Wait until the page shows the domain as ready.

Revdoku never changes your DNS records.

| Your setup | Hostname to connect | Example address |
| --- | --- | --- |
| Your domain already receives email through another provider | An unused subdomain, such as `mail.acme.com` | `support@mail.acme.com` |
| Only Revdoku receives email for the domain | The domain itself, such as `acme.com` | `support@acme.com` |

The setup refuses a hostname that already has mail records of another provider. Keep those records, and choose an unused subdomain.

## Use the domain in a project

Open the project's **Settings** → **Email** and select the pencil beside the address. Choose your domain and the name before `@`. The earlier address can stay as an alias, so that email sent to it still arrives.

With the API, create a new project on a ready domain: send `email.domain` and `email.username` to [Create a project](/api-reference/projects#create-a-project). The domain itself, address changes and aliases change only in the dashboard.

| Error code | What to do |
| --- | --- |
| `EMAIL_DOMAINS_UPGRADE_REQUIRED` | The plan has no custom email domains. `error.details.upgrade_url` links to the pricing page. |
| `EMAIL_DOMAIN_NOT_REGISTERED` | Connect the domain in **Account Settings** → **Email domains** first. |
| `EMAIL_DOMAIN_NOT_READY` | Finish the DNS setup of the domain, then try again. |
| `EMAIL_ALREADY_EXISTS` | Another project uses the address. Choose another name. |
