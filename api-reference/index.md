---
title: "API reference"
sidebarTitle: "Overview"
description: "Every operation of the Revdoku REST API, grouped by resource, from the account to its projects, tickets, files and site."
---

Requests go to `https://api.revdoku.com`. Every path starts with `/v1`, for example `https://api.revdoku.com/v1/projects`. Send your API key in the header `Authorization: Bearer $REVDOKU_API_KEY`, from your server only.

Every answer has the envelope `{"success": true, "data": {...}}`, or `{"success": false, "error": {...}}` with a stable `error.code`. Every operation takes `reason`, and most take `account_id`: the [API guide](/api) explains them, with authentication, lists and errors.

[API guide](/api) · [Quickstart](/quickstart) · [TypeScript SDK](/sdks/typescript) · [Python SDK](/sdks/python) · [OpenAPI](/openapi.json)

## [Accounts](/api-reference/accounts)

The connection of your key, the accounts that it reaches and their limits. An agency also creates client accounts here.

| Operation | Request |
| --- | --- |
| [Read the connection and selected account](/api-reference/accounts#read-the-connection-and-selected-account) | `GET /v1/status` |
| [List accounts granted to this credential](/api-reference/accounts#list-accounts-granted-to-this-credential) | `GET /v1/accounts` |
| [Create a client account](/api-reference/accounts#create-a-client-account) | `POST /v1/accounts` |
| [Read one granted account](/api-reference/accounts#read-one-granted-account) | `GET /v1/accounts/{account_id}` |
| [Read effective account limits](/api-reference/accounts#read-effective-account-limits) | `GET /v1/account/limits` |

## [Projects](/api-reference/projects)

A project is one support portal: its docs, its articles, its site and its support tickets. List, create, rename, archive and delete projects.

| Operation | Request |
| --- | --- |
| [List projects](/api-reference/projects#list-projects) | `GET /v1/projects` |
| [Create a project](/api-reference/projects#create-a-project) | `POST /v1/projects` |
| [Read a project](/api-reference/projects#read-a-project) | `GET /v1/projects/{project_id}` |
| [Update a project title, description or metadata](/api-reference/projects#update-a-project-title-description-or-metadata) | `PATCH /v1/projects/{project_id}` |
| [Permanently delete an archived project](/api-reference/projects#permanently-delete-an-archived-project) | `DELETE /v1/projects/{project_id}` |
| [Archive a project](/api-reference/projects#archive-a-project) | `POST /v1/projects/{project_id}/archive` |
| [Unarchive a project](/api-reference/projects#unarchive-a-project) | `POST /v1/projects/{project_id}/unarchive` |

## [Tickets](/api-reference/tickets)

Support requests from the contact form, Ask and email. Read each ticket and its messages, reply to the requester, ask the AI reply drafter for a draft, and solve tickets.

| Operation | Request |
| --- | --- |
| [List tickets](/api-reference/tickets#list-tickets) | `GET /v1/projects/{project_id}/tickets` |
| [Read a ticket](/api-reference/tickets#read-a-ticket) | `GET /v1/projects/{project_id}/tickets/{ticket_id}` |
| [Change a ticket: status, internal note or labels](/api-reference/tickets#change-a-ticket-status-internal-note-or-labels) | `PATCH /v1/projects/{project_id}/tickets/{ticket_id}` |
| [Read the draft of a reply](/api-reference/tickets#read-the-draft-of-a-reply) | `GET /v1/projects/{project_id}/tickets/{ticket_id}/draft` |
| [Start a draft of a reply](/api-reference/tickets#start-a-draft-of-a-reply) | `POST /v1/projects/{project_id}/tickets/{ticket_id}/draft` |
| [List the messages of a ticket](/api-reference/tickets#list-the-messages-of-a-ticket) | `GET /v1/projects/{project_id}/tickets/{ticket_id}/messages` |
| [Reply to the requester](/api-reference/tickets#reply-to-the-requester) | `POST /v1/projects/{project_id}/tickets/{ticket_id}/messages` |
| [Read a message](/api-reference/tickets#read-a-message) | `GET /v1/projects/{project_id}/tickets/{ticket_id}/messages/{message_id}` |
| [Delete a message](/api-reference/tickets#delete-a-message) | `DELETE /v1/projects/{project_id}/tickets/{ticket_id}/messages/{message_id}` |
| [Get a download link for the original email](/api-reference/tickets#get-a-download-link-for-the-original-email) | `GET /v1/projects/{project_id}/tickets/{ticket_id}/messages/{message_id}/raw` |
| [Get a download link for an attachment](/api-reference/tickets#get-a-download-link-for-an-attachment) | `GET /v1/projects/{project_id}/tickets/{ticket_id}/messages/{message_id}/attachments/{attachment_id}` |

## [Events](/api-reference/events)

Get an event when a ticket opens or a new message arrives: one signed webhook per project, or a live WebSocket subscription.

| Operation | Request |
| --- | --- |
| [Read the webhook](/api-reference/events#read-the-webhook) | `GET /v1/projects/{project_id}/webhook` |
| [Set the webhook](/api-reference/events#set-the-webhook) | `PUT /v1/projects/{project_id}/webhook` |
| [Remove the webhook](/api-reference/events#remove-the-webhook) | `DELETE /v1/projects/{project_id}/webhook` |
| [Get a live event subscription ticket](/api-reference/events#get-a-live-event-subscription-ticket) | `GET /v1/projects/{project_id}/events/subscription` |

## [Files](/api-reference/files)

A project's files: the articles and private notes of the knowledge base (`_kb/`), which you write, and the read-only copy of the GitHub repository (`_repo/`). Write, move, delete and restore articles, read any file, and scan a website for articles.

| Operation | Request |
| --- | --- |
| [List files](/api-reference/files#list-files) | `GET /v1/projects/{project_id}/files` |
| [Write a knowledge base file](/api-reference/files#write-a-knowledge-base-file) | `POST /v1/projects/{project_id}/files` |
| [Get an upload link for an image](/api-reference/files#get-an-upload-link-for-an-image) | `POST /v1/projects/{project_id}/uploads` |
| [Find a file by path](/api-reference/files#find-a-file-by-path) | `GET /v1/projects/{project_id}/files/by_path` |
| [Read file metadata](/api-reference/files#read-file-metadata) | `GET /v1/projects/{project_id}/files/{file_id}` |
| [Delete a knowledge base file](/api-reference/files#delete-a-knowledge-base-file) | `DELETE /v1/projects/{project_id}/files/{file_id}` |
| [Get a download link for a file](/api-reference/files#get-a-download-link-for-a-file) | `GET /v1/projects/{project_id}/files/{file_id}/download` |
| [List file versions](/api-reference/files#list-file-versions) | `GET /v1/projects/{project_id}/files/{file_id}/versions` |
| [Move or rename a knowledge base file](/api-reference/files#move-or-rename-a-knowledge-base-file) | `POST /v1/projects/{project_id}/files/{file_id}/move` |
| [Restore a file version](/api-reference/files#restore-a-file-version) | `POST /v1/projects/{project_id}/files/{file_id}/versions/{version_id}/restore` |
| [Get the website scan](/api-reference/files#get-the-website-scan) | `GET /v1/projects/{project_id}/website_scan` |
| [Scan a website for articles](/api-reference/files#scan-a-website-for-articles) | `POST /v1/projects/{project_id}/website_scan` |
| [Stop the website scan](/api-reference/files#stop-the-website-scan) | `DELETE /v1/projects/{project_id}/website_scan` |

## [Publications](/api-reference/publications)

The site of a project: publish it, make a 24-hour preview, read its status and analytics, change its settings, or take it down.

| Operation | Request |
| --- | --- |
| [Get the site](/api-reference/publications#get-the-site) | `GET /v1/projects/{project_id}/publication` |
| [Publish the site](/api-reference/publications#publish-the-site) | `POST /v1/projects/{project_id}/publication` |
| [Unpublish the site](/api-reference/publications#unpublish-the-site) | `DELETE /v1/projects/{project_id}/publication` |
| [Get the preview](/api-reference/publications#get-the-preview) | `GET /v1/projects/{project_id}/publication/preview` |
| [Preview the site](/api-reference/publications#preview-the-site) | `POST /v1/projects/{project_id}/publication/preview` |
| [Get the site's analytics](/api-reference/publications#get-the-sites-analytics) | `GET /v1/projects/{project_id}/analytics` |
| [Get the site settings](/api-reference/publications#get-the-site-settings) | `GET /v1/projects/{project_id}/site_settings` |
| [Change the site settings](/api-reference/publications#change-the-site-settings) | `PATCH /v1/projects/{project_id}/site_settings` |

## [GitHub](/api-reference/github)

Connect a GitHub repository to a project. Its docs become the project's `_repo/` folder, and each push updates them. Revdoku only reads the repository.

| Operation | Request |
| --- | --- |
| [List connected GitHub accounts](/api-reference/github#list-connected-github-accounts) | `GET /v1/account/github/installations` |
| [List the repositories of a GitHub account](/api-reference/github#list-the-repositories-of-a-github-account) | `GET /v1/account/github/installations/{installation_id}/repositories` |
| [Scan a GitHub repository](/api-reference/github#scan-a-github-repository) | `GET /v1/projects/{project_id}/github/scan` |
| [Read the GitHub repository of a project](/api-reference/github#read-the-github-repository-of-a-project) | `GET /v1/projects/{project_id}/github` |
| [Connect a GitHub repository](/api-reference/github#connect-a-github-repository) | `POST /v1/projects/{project_id}/github` |
| [Change GitHub sync settings](/api-reference/github#change-github-sync-settings) | `PATCH /v1/projects/{project_id}/github` |
| [Disconnect the GitHub repository](/api-reference/github#disconnect-the-github-repository) | `DELETE /v1/projects/{project_id}/github` |
| [Sync the GitHub repository now](/api-reference/github#sync-the-github-repository-now) | `POST /v1/projects/{project_id}/github/sync` |
| [List the branches that can get a preview](/api-reference/github#list-the-branches-that-can-get-a-preview) | `GET /v1/projects/{project_id}/github/branches` |
| [Get the links to add a GitHub account](/api-reference/github#get-the-links-to-add-a-github-account) | `GET /v1/projects/{project_id}/github/setup_link` |

## [Authentication](/api-reference/authentication)

Sign-in for command-line tools and AI agents: email a code and exchange it for an API key. A server application uses an API key from the dashboard instead.

| Operation | Request |
| --- | --- |
| [Email a sign-in code](/api-reference/authentication#email-a-sign-in-code) | `POST /v1/auth/sign_in_code` |
| [Exchange a sign-in code for an API key](/api-reference/authentication#exchange-a-sign-in-code-for-an-api-key) | `POST /v1/auth/sign_in_code/verify` |
| [Exchange a one-time dashboard connection code for an API key](/api-reference/authentication#exchange-a-one-time-dashboard-connection-code-for-an-api-key) | `POST /v1/auth/grant/exchange` |
| [Create a dashboard link](/api-reference/authentication#create-a-dashboard-link) | `POST /v1/auth/dashboard_link` |
