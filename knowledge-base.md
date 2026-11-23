---
title: "Knowledge base"
description: "Articles that you write in Revdoku: public ones on your site, private notes for your support team."
---

The knowledge base is the part of a project that you write in Revdoku. Your docs stay in your GitHub repository;
the knowledge base holds the articles that do not belong there, such as help articles and notes for your support team.

## Two folders

| Folder | Who reads it |
| --- | --- |
| `_kb/public/` | Visitors of your site. The articles are published under `/help/`. |
| `_kb/private/` | Your team and the support agent that drafts replies. It is never published. |

An article is a Markdown page (`.md` or `.mdx`). An article can use images (`.jpg`, `.png`, `.webp`) from its folder.

The rest of a project's files, the folder `_repo/`, is a read-only copy of your GitHub repository. Change those files on GitHub.

## Write an article in the dashboard

1. Open your site and select **Files**.
2. Select **KB Public** or **KB Private**.
3. Select **New article**, type its name and write the text. **Add image** uploads an image and adds it to the text.
4. Select **Save**.

A click on an article opens it again. The **Public** or **Private** control moves it between the two folders.

## Publish

A save never publishes. A public article shows on your site after the next publish:

- Select **Publish** on the list of public articles, or
- push to your GitHub repository, which publishes the site with the articles as they are then.

Private notes need no publish. The support agent uses a note a short time after you save it.
**Re-index** on the list of private notes reads every note again.

To change the address of the public articles, open **Settings** → **General** → **Knowledge base address**.

## Articles that visitors do not see

Sometimes the AI on your site should know a fact that has no page of its own.
Select **Do not publish** on a public article. The article is not on your site, and the AI Support Agent still answers
visitors from it.

A visitor can learn these facts from an answer. Put only facts that visitors may know there, never secrets.
Notes that only your team may see belong in **KB Private**.

With the API, MCP or the CLI, add this line to the front matter of the article:

```md
---
do_not_publish: true
---
```

## Who uses what

| | Public articles | Articles with Do not publish | Private notes |
| --- | --- | --- | --- |
| On your site and in its search | Yes | No | No |
| AI Support Agent on your site (Ask) | Yes | Yes, without a link | Never |
| Support agent that drafts replies for you | Yes | Yes | Yes |

A person approves each drafted reply before it is sent. A support ticket shows which articles and notes a draft used.

## Write with the API, MCP or the CLI

Every interface writes only in `_kb/`. A file in `_kb/public/` needs a key or a connection that can publish the project.

| Task | REST | MCP | CLI |
| --- | --- | --- | --- |
| Write a page or an image | `POST /v1/projects/{project_id}/files` | `project_file_write` | `revdoku write PATH --file FILE` |
| Move or rename | `POST …/files/{file_id}/move` with `new_path` | `project_file_move` | `revdoku mv PATH NEW_PATH` |
| List versions | `GET …/files/{file_id}/versions` | `project_file_read` with `versions: true` | `revdoku versions PATH` |
| Restore a version | `POST …/files/{file_id}/versions/{version_id}/restore` | `project_file_write` with `restore_version_id` | `revdoku restore PATH --version-id ID` |
| Delete | `DELETE …/files/{file_id}` | `project_file_delete` | `revdoku rm PATH` |

```bash
revdoku write _kb/private/refund-exceptions.md --file refund-exceptions.md --project-id prj_...
revdoku mv _kb/private/refunds.md _kb/public/refunds.md --project-id prj_...
revdoku publish --project-id prj_...
```

An image of more than 256 KB takes an upload link first; the CLI does this for you. See the [Files reference](/api-reference/files).

A delete keeps the versions of the file. To bring a deleted file back, restore one of its versions with the file ID
that the delete returned.
