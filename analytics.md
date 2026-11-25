---
title: Analytics
description: See who reads your portal, what they search and ask, and what your docs are missing.
---

Revdoku counts three audiences: **AI agents** (AI apps, such as ChatGPT or Claude, that read your docs for a person), **Humans** (people in a browser) and **Bots** (crawlers that index or train).

## Overview

The **Overview** of a project shows the traffic of each audience against the period before, then three lists: **Open tickets**, **Recent chats** and **Recent searches**. An amber count marks what needs a person, such as questions without an answer.

## Analytics pages

| Page | What it shows |
| --- | --- |
| Pages | Each page with its views and reads by each audience. |
| Sources | Who reads your portal: AI agents and bots by name, browsers, countries, referrers and devices. |
| Search | What AI agents and people search, and the searches that found nothing. |
| Ask | Every chat with the AI Support Agent, the most asked questions first. A chat that went to your team links its ticket. |
| Feedback | The answers to "Was this page helpful?", with the comments. |
| Errors | The addresses that people and bots asked for and that do not exist. |

The buttons above a page turn each audience on or off. Some plans show only the last days of history: see [Pricing](https://app.revdoku.com/pricing).

## Find what your docs miss

Three lists tell you what to write next:

- questions that the AI Support Agent could not answer (**Ask**),
- searches without results (**Search**),
- pages that readers marked as not helpful (**Feedback**).

Write the answer in your docs on GitHub or in an [article](/knowledge-base), then publish.

## Emails

You get an email for each new support request. You can also get a daily recap of what needs a look and a weekly recap of the traffic. Turn them on or off in **Account Settings** → **Notifications**.

## From code

`GET /v1/projects/{project_id}/analytics` returns the same numbers. With `section=gaps` it lists what the docs miss, with the source file of each page, so that an AI coding agent can fix it. See [Get the site's analytics](/api-reference/publications#get-the-sites-analytics).
