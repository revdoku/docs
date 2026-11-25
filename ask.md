---
title: Ask and the AI Support Agent
sidebarTitle: Ask
description: Visitors search your portal and ask questions. The AI Support Agent answers from your docs and articles, and sends the rest to your team.
---

Every page of your portal has **Search or ask**. A visitor types a question, sees the matching pages, and presses Enter to ask. The AI Support Agent answers from your docs and articles and links the pages that it used.

## What a visitor sees

1. **Search or ask** opens from the bar at the bottom of the page, from the search field in the header, or with ⌘K (Ctrl K).
2. While the visitor types, the matching pages show. A click opens a page. Enter asks the question.
3. The answer shows its sources and asks "Was this helpful?".
4. When the answer does not help, the visitor selects **Contact us**, enters an email address and sends the message. A No vote opens the same form. The message becomes a [support ticket](/tickets).

Each code block of a page also has **Ask about this code**.

## What the AI reads

The AI Support Agent reads the published pages of your docs and your articles, also the articles that you marked **Do not publish**. It never reads private notes or support tickets. When your pages do not answer a question, it says so and offers **Contact us**.

To improve the answers, add the missing facts to your docs or [articles](/knowledge-base). **Analytics** → **Ask** shows every question, and which ones got no answer.

## Settings

Open **Settings** → **Search & Ask**.

| Setting | Choices |
| --- | --- |
| Step 1 · AI Support Agent | On or off. Off: Ask shows the matching pages and **Contact us**, without AI answers. |
| Show Contact us | Under every answer, from the 2nd question, from the 3rd question, or only after No or no answer. |
| Step 2 · Human Support Agent | How a visitor reaches your team. Change it in **Settings** → **Contact form**. See [Support tickets](/tickets#contact-form). |
| Open Ask from | A bar at the bottom of the page, or a button at the right or the left. |
| Title | The title of the Ask panel: Support, Questions or Ask. Other titles need a paid plan. |

A change shows on your portal after the next publish. Select **Republish** at the top of the page.

## Starter questions

The Ask panel shows up to three questions to start with. Revdoku writes them from your docs. To choose them yourself, add `revdoku.json` to the docs folder of your repository:

```json
{
  "ask": {
    "welcome": "Hi! Ask anything about Acme.",
    "questions": ["How do I get an API key?", "How do I invite my team?", "Where are my invoices?"]
  }
}
```

## Credits

Each question that the AI answers uses credits. Without enough credits, Ask shows the matching pages and **Contact us**. Searching uses no AI. See [Pricing](https://app.revdoku.com/pricing).

## On your own domain

On your own domain, Ask can check that a visitor is a person before the first question. Add your Cloudflare Turnstile keys: see [Security check on your domain](/guides/ask-security-check).

## On your website

To show Ask on your own website, add the [website widget](/widget).
