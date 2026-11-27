---
title: Set up your support portal
sidebarTitle: Set up your portal
description: Sign up with your work email, get articles from your website, connect your docs on GitHub, then add the widget to your website.
---

You need your company's website and, if you have one, the GitHub repository with your docs. The setup takes about ten minutes.

## Create the portal

<Steps>

<Step title="Sign up with your work email">

Open the [sign-up page](https://app.revdoku.com/users/sign_up) and use your work email, such as `you@acme.com`. Revdoku finds your website from its domain.

</Step>
<Step title="Enter your website">

The setup asks **What is your current website?** and shows your website, such as `acme.com`. Select **Continue**.

</Step>
<Step title="Name your support portal">

Check the **Name** and the **Subdomain**. The subdomain is the address of your portal, such as `acme.revdoku.net`, and of its support email. Select **Continue**.

</Step>
<Step title="Get Help Center articles from your website">

Revdoku reads the public pages of your website and writes a few starter articles. When it finishes, select **Continue**. You can change the articles later in **Help Center**.

</Step>
<Step title="Add your docs from GitHub">

Select **Connect GitHub** and install the Revdoku GitHub App on the account that owns your docs repository. Then choose the repository and select **Use this repository**. Revdoku only reads it. No docs repository yet? Select **Connect later**.

</Step>
<Step title="Open your portal">

Revdoku copies your docs and publishes the portal. Select **Go to the dashboard…** to see it.

</Step>

</Steps>

<Note>

You can enter a GitHub repository in the first step, such as `github.com/acme/docs`. Revdoku then connects that repository after you name the portal and give it read-only access. For a repository without a docs folder, the setup can write starter articles from its README.

With a personal email address, such as Gmail, the setup asks for your GitHub repository: there is no website step.

</Note>

## Add the widget to your website

The widget puts Ask and the contact form on your own website, so customers get help without leaving it.

1. Open **Settings** → **Widget**.
2. Under **Websites that show the widget**, enter your website, such as `acme.com`. Use `*.acme.com` to include its subdomains. Select **Save**.
3. Under **Show on your website as**, choose a button or a bar.
4. Copy the code and paste it into the HTML of your website, before `</body>`.
5. Select **Republish** at the top of the page. The widget works when the site is published.

See [Website widget](/widget) for the options.

## Next steps

| Task | Guide |
| --- | --- |
| Answer requests from customers | [Support tickets](/tickets) |
| Write and edit articles | [Articles](/knowledge-base) |
| Use your own domain, colors and links | [Domain and design](/customize) |
| Choose when visitors see **Contact us** | [Ask](/ask) |
| Manage the portal from ChatGPT or Claude | [MCP](/mcp) |

The website scan and each publish use credits. See [Pricing](https://app.revdoku.com/pricing).
