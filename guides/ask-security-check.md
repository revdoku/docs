---
title: Security check for Ask on your own domain
sidebarTitle: Ask security check
description: Add your Cloudflare Turnstile keys so that Ask on a docs site with a custom domain checks that a visitor is a person.
---

Ask is the question box of a docs site. Before the first question, the site checks that the
visitor is a person. The check is Cloudflare Turnstile. Most visitors see nothing.

| Site address | Security check |
| --- | --- |
| The built-in address, such as `acme-docs.revdoku.site` | Revdoku's own check. It needs no setup. |
| Your own domain, such as `docs.example.com` | Your own Turnstile widget. Add its keys as this page says. |

A Turnstile widget runs only on the hostnames that its owner lists. Revdoku's widget lists
Revdoku's domains, so it cannot run on your domain. Without your keys, Ask on your domain
works without the check, and only the limits on the number of questions apply.

## Before you start

You need these two things:

- A docs site whose custom domain is live. **Site → Domain** shows **Active**.
- A Cloudflare account. Your DNS can stay at another provider.

## Create the Turnstile widget

1. Open the [Cloudflare dashboard](https://dash.cloudflare.com/) and select **Turnstile**.
2. Select **Add widget**.
3. Enter a name, for example `Docs Ask`.
4. Add the hostname of your docs site, for example `docs.example.com`.
5. Select the widget mode **Managed**.
6. Create the widget.
7. Copy the **Site key** and the **Secret key**.

## Add the keys to your site

1. Open your bucket in the [dashboard](https://app.revdoku.com/buckets).
2. Select **Site**, then **Domain**.
3. Open **Security check for Ask**.
4. Paste the site key and the secret key.
5. Select **Save**. The row shows **Set**.

The check applies at once. You do not publish the site again.
Revdoku stores the secret key encrypted and shows only its last 4 characters.

## Make sure that it works

1. Open your docs site on your domain in a private browser window.
2. Select **Ask** and ask a question.
3. Make sure that an answer shows.

The **Turnstile** page of the Cloudflare dashboard counts each check of your widget.

## Change or remove the keys

| To do this | Do this |
| --- | --- |
| Use another widget | Paste the new site key and secret key, then select **Save**. |
| Stop the check | Select **Remove**. Ask on your domain then works without the check. |

## Troubleshooting

| Problem | Cause | Fix |
| --- | --- | --- |
| Ask shows "Complete the security check." and no answer | The widget does not list the hostname of your site | Add the hostname to the widget in Cloudflare. |
| Save shows "Enter the site key and the secret key of your Turnstile widget." | A key is incomplete | Copy both keys again from the widget's page. |
| The row is not on the Domain page | The custom domain is not live yet | Finish the domain setup first. |
