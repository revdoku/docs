---
title: Articles
description: Help articles that visitors read on your portal, and private notes that only your team and the AI reply drafter read.
---

Articles are the part of your portal that you write in Revdoku. Your docs stay in GitHub. Articles hold what does not belong there: answers to common questions, how-tos and policies.

| Kind | Folder | Who reads it |
| --- | --- | --- |
| Articles | `_kb/public/` | Visitors, on your portal under `/help/`, and the AI Support Agent. |
| Private notes | `_kb/private/` | Your team and the AI reply drafter. Never published. |

An article is a Markdown file (`.md` or `.mdx`). It can show images (`.jpg`, `.png` or `.webp`) from its folder.

## Write an article

1. Open your project and select **Help Center** → **Articles**, or **Private notes**.
2. Select **New article**, enter its name and write the text. **Add image** uploads an image and adds it to the text.
3. Select **Save**.
4. For an article, select **Publish** on the list of articles. Private notes need no publish.

A save never publishes. A push to your GitHub repository also publishes the site, with the articles as they are then.

To move an article, open it and select **Move to Private notes…** or **Move to Articles…**. To change the address `/help/`, open **Settings** → **General** → **Knowledge base address**.

## Get articles from your website

Revdoku can read the public pages of your website and write one article for each page.

1. In **Help Center** → **Articles**, select **Scan website…**.
2. Enter your website, or a list of pages. Choose how many articles to write.
3. Select **Scan website**. When the scan finishes, open each article and check it.
4. Select **Publish** to show the articles on your portal.

A scan never replaces an article. An account scans the website of its owner's work email, and its subdomains. Each written article uses credits. See [Pricing](https://app.revdoku.com/pricing).

## Facts for the AI only

Sometimes the AI Support Agent should know a fact that needs no page of its own. Open the article and select **Do not publish**. The article leaves your portal, but the AI Support Agent still uses it to answer visitors.

A visitor can learn these facts from an answer. Write only what visitors may know, never secrets. Notes for your team belong in **Private notes**.

Through the API, MCP or the CLI, add this line to the front matter of the article:

```md
---
do_not_publish: true
---
```

## Who reads what

| | Articles | Articles with Do not publish | Private notes |
| --- | --- | --- | --- |
| On your portal and in its search | Yes | No | No |
| AI Support Agent (Ask) | Yes | Yes, without a link | No |
| AI reply drafter | Yes | Yes | Yes |

A person approves each draft of the AI reply drafter before it is sent. The ticket shows which articles and notes a draft used.

## Articles in the API

In the API, `visibility` `public` is an article and `private` is a private note. The [Articles](/api-reference/articles) operations read and write them.

| Task | REST | MCP | CLI |
| --- | --- | --- | --- |
| List or read | `GET /v1/projects/{project_id}/articles` | `project_article_read` | `revdoku articles`, `revdoku article ID` |
| Create | `POST …/articles` | `project_article_write` | `revdoku article create --visibility public --file FILE` |
| Change the text, the slug or the visibility | `PATCH …/articles/{article_id}` | `project_article_write` with `action: "update"` | `revdoku article update ID` |
| Delete, or restore a version | `DELETE …/articles/{article_id}`, `POST …/restore` | `action: "delete"`, `"restore"` | `revdoku article delete ID`, `article restore ID` |
| Add or list images | `POST …/articles/images`, `GET …/articles/images` | `action: "image"`, `"images"` | `revdoku article image`, `article images` |
| Scan a website | `POST /v1/projects/{project_id}/website_scan` | `project_website_scan` | `revdoku scan URL` |

```sh
revdoku article create --visibility public --file refunds.md --project-id prj_...
revdoku publish --project-id prj_...
```

- A public article or image needs a key or a connection that can publish the project.
- A change takes `expected_version_id`, the article's `version_id` that you read. When the article changed since, the answer is `409 ARTICLE_VERSION_CONFLICT` and nothing changes.
- A delete keeps the versions. To bring the article back, restore one of its versions with the article ID that the delete returned.
- An image above 256 KB needs an upload link first. The CLI does this for you.
