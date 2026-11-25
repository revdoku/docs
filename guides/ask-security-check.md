---
title: Security check on your domain
sidebarTitle: Security check on your domain
description: Add your Cloudflare Turnstile keys, so that Ask on your own domain checks that a visitor is a person.
---

Before the first question, Ask checks that the visitor is a person. The check is Cloudflare Turnstile, and most visitors never see it.

| Portal address | Security check |
| --- | --- |
| The `revdoku.net` address, such as `acme.revdoku.net` | Revdoku's own check. It needs no setup. |
| Your own domain, such as `help.acme.com` | Your own Turnstile widget. Add its keys as this page says. |

A Turnstile widget works only on the hostnames that its owner lists, so Revdoku's widget cannot run on your domain. Without your keys, Ask on your domain works without the check, with limits on the number of questions.

## Create the Turnstile widget

You need a portal whose custom domain is live, and a Cloudflare account. Your DNS can stay at another provider.

1. Open the [Cloudflare dashboard](https://dash.cloudflare.com/) and select **Turnstile**.
2. Select **Add widget** and enter a name, such as `Help center Ask`.
3. Add the hostname of your portal, such as `help.acme.com`.
4. Choose the widget mode **Managed**, and create the widget.
5. Copy the **Site key** and the **Secret key**.

## Add the keys to your portal

1. Open your project and select **Settings** → **Domain**.
2. Open **Security check**, paste both keys and select **Save**. The row shows **Set**.

The check works at once: you need no publish. Revdoku stores the secret key encrypted and shows only its last 4 characters.

To check it, open your portal in a private browser window and ask a question. The Turnstile page of the Cloudflare dashboard counts each check.

## Change or remove the keys

To use another widget, paste its keys and select **Save**. To stop the check, select **Remove**.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Ask shows "Complete the security check." and no answer | Add the hostname of your portal to the widget in Cloudflare. |
| Save shows "Enter the site key and the secret key of your Turnstile widget." | Copy both keys again from the page of the widget. |
| **Settings** → **Domain** has no **Security check** | Finish the setup of your custom domain first. |
