---
title: Support tickets
description: Requests from the contact form and from email become tickets. Your team replies in the dashboard, and the reply goes out by email.
---

Each request from a customer is a support ticket. You answer it in **Tickets**, and the customer gets your reply by email. When the customer answers, the answer joins the same ticket.

## Where tickets come from

| Channel | How it works |
| --- | --- |
| Contact form | **Contact us** in Ask, the support page `/support/` and the [website widget](/widget). The visitor enters an email address and a message. |
| Email | An email to your support address, such as `support@acme.revdoku.net`. On the Free plan, an email comes in only when it answers one of your replies. |
| Forwarded email | A member of your team forwards a customer's email to the support address. The ticket is from the customer. Needs a paid plan. |

[Pricing](https://app.revdoku.com/pricing) shows what each plan includes.

## Contact form

**Settings** → **Contact form** chooses how a visitor reaches your team.

| Mode | What the support page shows |
| --- | --- |
| Contact form | A form for an email address and a message. |
| Contact form and email | The form, and your support address on every page. Needs a paid plan. |
| Email address only | Your support address. Needs a paid plan. |
| Link to another website | A link to a page where you already answer questions, such as your GitHub Discussions. No ticket is made. |
| Off | No **Contact us**, no support page and no Support button. |

A change shows on your portal after the next publish. Select **Republish** at the top of the page.

## Answer a ticket

1. Open **Tickets**. The list shows open tickets first. Choose **Pending**, **Solved** or **All** to see the others.
2. Open a ticket. The reply box is under the subject.
3. Write your reply, or select **Generate reply** to let the AI reply drafter write one from your docs. Check the draft.
4. Select **Send**. The ticket becomes **Pending**. To choose another status, open the menu beside **Send**: **Send and mark as solved** or **Send and keep open**.

| Status | Meaning |
| --- | --- |
| Open | The ticket waits for your team. |
| Pending | You replied. The ticket waits for the customer. |
| Solved | Done. A new message from the customer opens it again. |

Your reply comes from your support address, with the project's name as the sender. Its subject starts with the ticket number, such as `[#12]`. On the Free plan, each reply ends with a line that names Revdoku. Each sent reply uses credits.

## The AI reply drafter

The AI reply drafter writes a draft from your docs, your articles and your private notes. It never sends anything: a person reads each draft and sends it.

- **Generate reply** in the reply box asks for a draft of the open ticket.
- On plans with automatic drafts, turn on **Automatic** in **Settings** → **Tickets**. A draft then waits in each new ticket.
- When your pages have no answer, it writes no draft and says why.

Each draft uses credits. The ticket shows which pages and notes the draft used.

## Keep your inbox clean

The **AI junk filter** adds the `Junk` label to a message that looks like phishing or an attack on an AI. Junk messages go to the **Junk** folder, and AI apps cannot read them. The filter can make mistakes: check the **Junk** folder from time to time. Turn it on or off in **Settings** → **Tickets**.

Email with a virus or spam is refused before it reaches **Tickets**.

## More tools

- **Internal note**: a note on a ticket for your team. Customers never see it.
- **Notifications**: you get an email for each new request. Turn it off, or turn on the daily and weekly recaps, in **Account Settings** → **Notifications**.
- **Ticket numbers**: **Settings** → **Tickets** → **Misc** sets the next ticket number.

## Connect other tools

| Tool | Use |
| --- | --- |
| [Zapier](https://github.com/revdoku/revdoku-zapier/blob/main/TUTORIAL.md) | Send each new request to another app, and reply or solve from a Zap. Email [support@revdoku.com](mailto:support@revdoku.com) for access. |
| [n8n](https://github.com/revdoku/revdoku-n8n/blob/main/USAGE.md) | The same steps on self-hosted n8n. |
| API, MCP and CLI | Read, draft, reply and solve from your own code or AI app. See [Tickets](/api-reference/tickets) and [Webhooks and events](/guides/email-events). |
