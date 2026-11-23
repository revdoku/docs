---
title: "API reference"
sidebarTitle: "Overview"
description: "Every operation of the Revdoku REST API with its TypeScript and Python SDK call, grouped by resource."
---

Requests go to `https://api.revdoku.com`. Every path starts with `/v1`, for example `https://api.revdoku.com/v1/projects`. Send `Authorization: Bearer $REVDOKU_API_KEY` from your server; never put the key in a browser or a chat.
Responses use `{"success": true, "data": ...}`. Errors use `{"success": false, "error": {"code": ..., "message": ...}}`; branch on `error.code`.
The SDKs keep this envelope: TypeScript fields are camelCase, Python fields use the JSON names.

[OpenAPI](/openapi.json) · [Quickstart](/quickstart) · [TypeScript SDK](/sdks/typescript) · [Python SDK](/sdks/python) · [API guide](/api)

## [Authentication](/api-reference/authentication)

Sign-in helpers for the CLI and AI agents. Backend applications use an API key from the dashboard.

Operations that need no API key run before you have one. They use the generated `DefaultApi` class instead of `Revdoku`, so their errors are `ResponseError` (TypeScript) or `ApiException` (Python), not `RevdokuError`.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [Email a sign-in code](/api-reference/authentication#email-a-sign-in-code) | `POST /v1/auth/sign_in_code` | `new DefaultApi().requestSignInCode` | `DefaultApi().request_sign_in_code` |
| [Exchange a sign-in code for an API key](/api-reference/authentication#exchange-a-sign-in-code-for-an-api-key) | `POST /v1/auth/sign_in_code/verify` | `new DefaultApi().verifySignInCode` | `DefaultApi().verify_sign_in_code` |
| [Exchange a one-time dashboard connection code for an API key](/api-reference/authentication#exchange-a-one-time-dashboard-connection-code-for-an-api-key) | `POST /v1/auth/grant/exchange` | `new DefaultApi().exchangeConnectionGrant` | `DefaultApi().exchange_connection_grant` |
| [Create a dashboard link](/api-reference/authentication#create-a-dashboard-link) | `POST /v1/auth/dashboard_link` | `client.api.createDashboardLink` | `client.api.create_dashboard_link` |

## [Accounts](/api-reference/accounts)

Connection status, granted accounts and limits.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [Read the connection and selected account](/api-reference/accounts#read-the-connection-and-selected-account) | `GET /v1/status` | `client.api.getStatus` | `client.api.get_status` |
| [List accounts granted to this credential](/api-reference/accounts#list-accounts-granted-to-this-credential) | `GET /v1/accounts` | `client.api.listAccounts` | `client.api.list_accounts` |
| [Create a client account](/api-reference/accounts#create-a-client-account) | `POST /v1/accounts` | `client.api.createClientAccount` | `client.api.create_client_account` |
| [Read one granted account](/api-reference/accounts#read-one-granted-account) | `GET /v1/accounts/{account_id}` | `client.api.getAccount` | `client.api.get_account` |
| [Read effective account limits](/api-reference/accounts#read-effective-account-limits) | `GET /v1/account/limits` | `client.api.getAccountLimits` | `client.api.get_account_limits` |

## [Projects](/api-reference/projects)

Create, read, archive and delete projects. A project is the project of one docs site (the dashboard calls it a site).

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [List projects](/api-reference/projects#list-projects) | `GET /v1/projects` | `client.listProjects` | `client.list_projects` |
| [Create a project](/api-reference/projects#create-a-project) | `POST /v1/projects` | `client.createProject` | `client.create_project` |
| [Read a project](/api-reference/projects#read-a-project) | `GET /v1/projects/{project_id}` | `client.getProject` | `client.get_project` |
| [Update a project title, description or metadata](/api-reference/projects#update-a-project-title-description-or-metadata) | `PATCH /v1/projects/{project_id}` | `client.api.updateProject` | `client.api.update_project` |
| [Permanently delete an archived project](/api-reference/projects#permanently-delete-an-archived-project) | `DELETE /v1/projects/{project_id}` | `client.api.deleteProject` | `client.api.delete_project` |
| [Archive a project](/api-reference/projects#archive-a-project) | `POST /v1/projects/{project_id}/archive` | `client.api.archiveProject` | `client.api.archive_project` |
| [Unarchive a project](/api-reference/projects#unarchive-a-project) | `POST /v1/projects/{project_id}/unarchive` | `client.api.unarchiveProject` | `client.api.unarchive_project` |

## [Files](/api-reference/files)

Read the files that Revdoku copied from the project's GitHub repository. Revdoku only reads a repository: change the files on GitHub.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [List files](/api-reference/files#list-files) | `GET /v1/projects/{project_id}/files` | `client.listFiles` | `client.list_files` |
| [Write a knowledge base file](/api-reference/files#write-a-knowledge-base-file) | `POST /v1/projects/{project_id}/files` | `client.api.writeFile` | `client.api.write_file` |
| [Get an upload link for an image](/api-reference/files#get-an-upload-link-for-an-image) | `POST /v1/projects/{project_id}/uploads` | `client.api.createFileUpload` | `client.api.create_file_upload` |
| [Find a file by path](/api-reference/files#find-a-file-by-path) | `GET /v1/projects/{project_id}/files/by_path` | `client.api.getFileByPath` | `client.api.get_file_by_path` |
| [Read file metadata](/api-reference/files#read-file-metadata) | `GET /v1/projects/{project_id}/files/{file_id}` | `client.api.getFile` | `client.api.get_file` |
| [Delete a knowledge base file](/api-reference/files#delete-a-knowledge-base-file) | `DELETE /v1/projects/{project_id}/files/{file_id}` | `client.api.deleteFile` | `client.api.delete_file` |
| [Get a download link for a file](/api-reference/files#get-a-download-link-for-a-file) | `GET /v1/projects/{project_id}/files/{file_id}/download` | `client.api.getFileDownload` | `client.api.get_file_download` |
| [List file versions](/api-reference/files#list-file-versions) | `GET /v1/projects/{project_id}/files/{file_id}/versions` | `client.api.listFileVersions` | `client.api.list_file_versions` |
| [Move or rename a knowledge base file](/api-reference/files#move-or-rename-a-knowledge-base-file) | `POST /v1/projects/{project_id}/files/{file_id}/move` | `client.api.moveFile` | `client.api.move_file` |
| [Restore a file version](/api-reference/files#restore-a-file-version) | `POST /v1/projects/{project_id}/files/{file_id}/versions/{version_id}/restore` | `client.api.restoreFileVersion` | `client.api.restore_file_version` |

## [GitHub](/api-reference/github)

Connect a GitHub repository to a project: its files become a copy of one branch, and each push updates them.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [List connected GitHub accounts](/api-reference/github#list-connected-github-accounts) | `GET /v1/account/github/installations` | `client.api.listGithubInstallations` | `client.api.list_github_installations` |
| [List the repositories of a GitHub account](/api-reference/github#list-the-repositories-of-a-github-account) | `GET /v1/account/github/installations/{installation_id}/repositories` | `client.api.listGithubRepositories` | `client.api.list_github_repositories` |
| [Read the GitHub repository of a project](/api-reference/github#read-the-github-repository-of-a-project) | `GET /v1/projects/{project_id}/github` | `client.api.getGithubSync` | `client.api.get_github_sync` |
| [Connect a GitHub repository](/api-reference/github#connect-a-github-repository) | `POST /v1/projects/{project_id}/github` | `client.api.connectGithubRepository` | `client.api.connect_github_repository` |
| [Change GitHub sync settings](/api-reference/github#change-github-sync-settings) | `PATCH /v1/projects/{project_id}/github` | `client.api.updateGithubSync` | `client.api.update_github_sync` |
| [Disconnect the GitHub repository](/api-reference/github#disconnect-the-github-repository) | `DELETE /v1/projects/{project_id}/github` | `client.api.disconnectGithubRepository` | `client.api.disconnect_github_repository` |
| [Sync the GitHub repository now](/api-reference/github#sync-the-github-repository-now) | `POST /v1/projects/{project_id}/github/sync` | `client.api.syncGithubRepository` | `client.api.sync_github_repository` |
| [List the branches that can get a preview](/api-reference/github#list-the-branches-that-can-get-a-preview) | `GET /v1/projects/{project_id}/github/branches` | `client.api.listGithubBranches` | `client.api.list_github_branches` |
| [Get the links to add a GitHub account](/api-reference/github#get-the-links-to-add-a-github-account) | `GET /v1/projects/{project_id}/github/setup_link` | `client.api.getGithubSetupLink` | `client.api.get_github_setup_link` |

## [Publications](/api-reference/publications)

A project's site: publish its files, preview them for 24 hours, or take the site down.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [Get the site](/api-reference/publications#get-the-site) | `GET /v1/projects/{project_id}/publication` | `client.api.getPublication` | `client.api.get_publication` |
| [Publish the site](/api-reference/publications#publish-the-site) | `POST /v1/projects/{project_id}/publication` | `client.api.publishProject` | `client.api.publish_project` |
| [Unpublish the site](/api-reference/publications#unpublish-the-site) | `DELETE /v1/projects/{project_id}/publication` | `client.api.unpublishProject` | `client.api.unpublish_project` |
| [Get the preview](/api-reference/publications#get-the-preview) | `GET /v1/projects/{project_id}/publication/preview` | `client.api.getPublicationPreview` | `client.api.get_publication_preview` |
| [Preview the site](/api-reference/publications#preview-the-site) | `POST /v1/projects/{project_id}/publication/preview` | `client.api.previewProject` | `client.api.preview_project` |
| [Get the site's analytics](/api-reference/publications#get-the-sites-analytics) | `GET /v1/projects/{project_id}/analytics` | `client.api.getProjectAnalytics` | `client.api.get_project_analytics` |

## [Tickets](/api-reference/tickets)

Support tickets: each conversation that someone started with the project, by email or a message left on the docs site. Read them, reply to the requester, solve and label them. Page feedback comments show in the dashboard and are not tickets of this API; the channel feedback is for tickets from earlier page feedback emails.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [List tickets](/api-reference/tickets#list-tickets) | `GET /v1/projects/{project_id}/tickets` | `client.listTickets` | `client.list_tickets` |
| [Read a ticket](/api-reference/tickets#read-a-ticket) | `GET /v1/projects/{project_id}/tickets/{ticket_id}` | `client.getTicket` | `client.get_ticket` |
| [Change a ticket: status, internal note or labels](/api-reference/tickets#change-a-ticket-status-internal-note-or-labels) | `PATCH /v1/projects/{project_id}/tickets/{ticket_id}` | `client.api.updateTicket` | `client.api.update_ticket` |
| [List the messages of a ticket](/api-reference/tickets#list-the-messages-of-a-ticket) | `GET /v1/projects/{project_id}/tickets/{ticket_id}/messages` | `client.listTicketMessages` | `client.list_ticket_messages` |
| [Reply to the requester](/api-reference/tickets#reply-to-the-requester) | `POST /v1/projects/{project_id}/tickets/{ticket_id}/messages` | `client.replyToTicket` | `client.reply_to_ticket` |
| [Read a message](/api-reference/tickets#read-a-message) | `GET /v1/projects/{project_id}/tickets/{ticket_id}/messages/{message_id}` | `client.getTicketMessage` | `client.get_ticket_message` |
| [Delete a message](/api-reference/tickets#delete-a-message) | `DELETE /v1/projects/{project_id}/tickets/{ticket_id}/messages/{message_id}` | `client.api.deleteTicketMessage` | `client.api.delete_ticket_message` |
| [Get a download link for the original email](/api-reference/tickets#get-a-download-link-for-the-original-email) | `GET /v1/projects/{project_id}/tickets/{ticket_id}/messages/{message_id}/raw` | `client.api.getTicketMessageOriginalDownload` | `client.api.get_ticket_message_original_download` |
| [Get a download link for an attachment](/api-reference/tickets#get-a-download-link-for-an-attachment) | `GET /v1/projects/{project_id}/tickets/{ticket_id}/messages/{message_id}/attachments/{attachment_id}` | `client.getAttachmentDownload` | `client.get_attachment_download` |

## [Events](/api-reference/events)

Ticket events of every channel: one signed webhook per project and live WebSocket subscriptions.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [Read the webhook](/api-reference/events#read-the-webhook) | `GET /v1/projects/{project_id}/webhook` | `client.api.getWebhook` | `client.api.get_webhook` |
| [Set the webhook](/api-reference/events#set-the-webhook) | `PUT /v1/projects/{project_id}/webhook` | `client.api.setWebhook` | `client.api.set_webhook` |
| [Remove the webhook](/api-reference/events#remove-the-webhook) | `DELETE /v1/projects/{project_id}/webhook` | `client.api.deleteWebhook` | `client.api.delete_webhook` |
| [Get a live event subscription ticket](/api-reference/events#get-a-live-event-subscription-ticket) | `GET /v1/projects/{project_id}/events/subscription` | `client.api.getEventSubscription` | `client.api.get_event_subscription` |
