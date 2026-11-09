---
title: "API reference"
sidebarTitle: "Overview"
description: "Every operation of the Revdoku REST API with its TypeScript and Python SDK call, grouped by resource."
---

Requests go to `https://api.revdoku.com`. Every path starts with `/v1`, for example `https://api.revdoku.com/v1/buckets`. Send `Authorization: Bearer $REVDOKU_API_KEY` from your server; never put the key in a browser or a chat.
Responses use `{"success": true, "data": ...}`. Errors use `{"success": false, "error": {"code": ..., "message": ...}}`; branch on `error.code`.
The SDKs keep this envelope: TypeScript fields are camelCase, Python fields use the JSON names.

[OpenAPI](/openapi.json) · [API console](/api-reference/console/) · [Quickstart](/quickstart) · [TypeScript SDK](/sdks/typescript) · [Python SDK](/sdks/python) · [API guide](/api)

## [Authentication](/api-reference/authentication)

Sign-in helpers for the CLI and AI agents. Backend applications use an API key from the dashboard.

Operations that need no API key run before you have one. They use the generated `DefaultApi` class instead of `Revdoku`, so their errors are `ResponseError` (TypeScript) or `ApiException` (Python), not `RevdokuError`.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [Email a sign-in code](/api-reference/authentication#email-a-sign-in-code) | `POST /v1/agent_auth/request_code` | `new DefaultApi().requestSignInCode` | `DefaultApi().request_sign_in_code` |
| [Exchange a sign-in code for an API key](/api-reference/authentication#exchange-a-sign-in-code-for-an-api-key) | `POST /v1/agent_auth/verify_code` | `new DefaultApi().verifySignInCode` | `DefaultApi().verify_sign_in_code` |
| [Exchange a one-time dashboard connection code for an API key](/api-reference/authentication#exchange-a-one-time-dashboard-connection-code-for-an-api-key) | `POST /v1/agent_auth/exchange_grant` | `new DefaultApi().exchangeConnectionGrant` | `DefaultApi().exchange_connection_grant` |
| [Create a dashboard link for the user](/api-reference/authentication#create-a-dashboard-link-for-the-user) | `POST /v1/agent_auth/browser_login_link` | `client.api.createBrowserLink` | `client.api.create_browser_link` |

## [Accounts](/api-reference/accounts)

Connection status, granted accounts and limits.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [Read the connection and selected account](/api-reference/accounts#read-the-connection-and-selected-account) | `GET /v1/status` | `client.api.getStatus` | `client.api.get_status` |
| [List accounts granted to this credential](/api-reference/accounts#list-accounts-granted-to-this-credential) | `GET /v1/accounts` | `client.api.listAccounts` | `client.api.list_accounts` |
| [Create a client account](/api-reference/accounts#create-a-client-account) | `POST /v1/accounts` | `client.api.createClientAccount` | `client.api.create_client_account` |
| [Read one granted account](/api-reference/accounts#read-one-granted-account) | `GET /v1/accounts/{account_id}` | `client.api.getAccount` | `client.api.get_account` |
| [Read effective account limits](/api-reference/accounts#read-effective-account-limits) | `GET /v1/account/limits` | `client.api.getAccountLimits` | `client.api.get_account_limits` |

## [Buckets](/api-reference/buckets)

Create, read, archive and delete buckets.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [List buckets](/api-reference/buckets#list-buckets) | `GET /v1/buckets` | `client.listBuckets` | `client.list_buckets` |
| [Create a bucket](/api-reference/buckets#create-a-bucket) | `POST /v1/buckets` | `client.createBucket` | `client.create_bucket` |
| [Read a bucket](/api-reference/buckets#read-a-bucket) | `GET /v1/buckets/{bucket_id}` | `client.getBucket` | `client.get_bucket` |
| [Update a bucket title, description or metadata](/api-reference/buckets#update-a-bucket-title-description-or-metadata) | `PATCH /v1/buckets/{bucket_id}` | `client.api.updateBucket` | `client.api.update_bucket` |
| [Permanently delete an archived bucket](/api-reference/buckets#permanently-delete-an-archived-bucket) | `DELETE /v1/buckets/{bucket_id}` | `client.api.deleteBucket` | `client.api.delete_bucket` |
| [Archive a bucket](/api-reference/buckets#archive-a-bucket) | `POST /v1/buckets/{bucket_id}/archive` | `client.api.archiveBucket` | `client.api.archive_bucket` |
| [Unarchive a bucket](/api-reference/buckets#unarchive-a-bucket) | `POST /v1/buckets/{bucket_id}/unarchive` | `client.api.unarchiveBucket` | `client.api.unarchive_bucket` |

## [Mailbox](/api-reference/mailbox)

Addresses, aliases, allowed senders, webhooks and live subscriptions.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [Read address settings](/api-reference/mailbox#read-address-settings) | `GET /v1/buckets/{bucket_id}/mailbox` | `client.api.getMailbox` | `client.api.get_mailbox` |
| [Change the primary address](/api-reference/mailbox#change-the-primary-address) | `POST /v1/buckets/{bucket_id}/mailbox/rotate` | `client.api.changeMailboxAddress` | `client.api.change_mailbox_address` |
| [Add an alias address](/api-reference/mailbox#add-an-alias-address) | `POST /v1/buckets/{bucket_id}/mailbox/aliases` | `client.api.createEmailAlias` | `client.api.create_email_alias` |
| [Remove an alias address](/api-reference/mailbox#remove-an-alias-address) | `DELETE /v1/buckets/{bucket_id}/mailbox/aliases/{alias_id}` | `client.api.deleteEmailAlias` | `client.api.delete_email_alias` |
| [Replace the allowed senders](/api-reference/mailbox#replace-the-allowed-senders) | `PATCH /v1/buckets/{bucket_id}/mailbox/allowlist` | `client.api.updateEmailAllowlist` | `client.api.update_email_allowlist` |
| [Read the email webhook](/api-reference/mailbox#read-the-email-webhook) | `GET /v1/buckets/{bucket_id}/mailbox/webhook` | `client.api.getEmailWebhook` | `client.api.get_email_webhook` |
| [Set the email webhook](/api-reference/mailbox#set-the-email-webhook) | `PUT /v1/buckets/{bucket_id}/mailbox/webhook` | `client.api.setEmailWebhook` | `client.api.set_email_webhook` |
| [Remove the email webhook](/api-reference/mailbox#remove-the-email-webhook) | `DELETE /v1/buckets/{bucket_id}/mailbox/webhook` | `client.api.deleteEmailWebhook` | `client.api.delete_email_webhook` |
| [Get a live email subscription ticket](/api-reference/mailbox#get-a-live-email-subscription-ticket) | `GET /v1/buckets/{bucket_id}/mailbox/subscription` | `client.api.getEmailSubscription` | `client.api.get_email_subscription` |

## [Emails](/api-reference/emails)

List, read, reply to and delete email.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [List emails](/api-reference/emails#list-emails) | `GET /v1/buckets/{bucket_id}/mailbox/emails` | `client.listEmails` | `client.list_emails` |
| [Send an email](/api-reference/emails#send-an-email) | `POST /v1/buckets/{bucket_id}/mailbox/emails` | `client.api.sendEmail` | `client.api.send_email` |
| [Read an email](/api-reference/emails#read-an-email) | `GET /v1/buckets/{bucket_id}/mailbox/emails/{email_id}` | `client.getEmail` | `client.get_email` |
| [Update an email's read status or labels](/api-reference/emails#update-an-emails-read-status-or-labels) | `PATCH /v1/buckets/{bucket_id}/mailbox/emails/{email_id}` | `client.api.updateEmail` | `client.api.update_email` |
| [Delete an email](/api-reference/emails#delete-an-email) | `DELETE /v1/buckets/{bucket_id}/mailbox/emails/{email_id}` | `client.api.deleteEmail` | `client.api.delete_email` |
| [Get a download link for the original email](/api-reference/emails#get-a-download-link-for-the-original-email) | `GET /v1/buckets/{bucket_id}/mailbox/emails/{email_id}/raw` | `client.api.getEmailOriginalDownload` | `client.api.get_email_original_download` |
| [Get a download link for an attachment](/api-reference/emails#get-a-download-link-for-an-attachment) | `GET /v1/buckets/{bucket_id}/mailbox/emails/{email_id}/attachments/{attachment_id}` | `client.getAttachmentDownload` | `client.get_attachment_download` |

## [Files](/api-reference/files)

Upload, read, organize and restore files.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [Prepare a file upload (step 1 of 3)](/api-reference/files#prepare-a-file-upload-step-1-of-3) | `POST /v1/direct_uploads` | `client.uploadFile` | `client.upload_file` |
| [List files](/api-reference/files#list-files) | `GET /v1/buckets/{bucket_id}/files` | `client.listFiles` | `client.list_files` |
| [Save an uploaded file (step 3 of 3)](/api-reference/files#save-an-uploaded-file-step-3-of-3) | `POST /v1/buckets/{bucket_id}/files` | `client.uploadFile` | `client.upload_file` |
| [Find a file by path](/api-reference/files#find-a-file-by-path) | `GET /v1/buckets/{bucket_id}/files/by_path` | `client.api.getFileByPath` | `client.api.get_file_by_path` |
| [Append text to a file](/api-reference/files#append-text-to-a-file) | `POST /v1/buckets/{bucket_id}/files/append_text` | `client.api.appendText` | `client.api.append_text` |
| [Read file metadata](/api-reference/files#read-file-metadata) | `GET /v1/buckets/{bucket_id}/files/{file_id}` | `client.api.getFile` | `client.api.get_file` |
| [Delete a file](/api-reference/files#delete-a-file) | `DELETE /v1/buckets/{bucket_id}/files/{file_id}` | `client.api.deleteFile` | `client.api.delete_file` |
| [Get a download link for a file](/api-reference/files#get-a-download-link-for-a-file) | `GET /v1/buckets/{bucket_id}/files/{file_id}/download` | `client.api.getFileDownload` | `client.api.get_file_download` |
| [Rename or move a file in the same bucket](/api-reference/files#rename-or-move-a-file-in-the-same-bucket) | `POST /v1/buckets/{bucket_id}/files/{file_id}/rename` | `client.api.renameFile` | `client.api.rename_file` |
| [Move a file](/api-reference/files#move-a-file) | `POST /v1/buckets/{bucket_id}/files/{file_id}/move` | `client.api.moveFile` | `client.api.move_file` |
| [Copy a file](/api-reference/files#copy-a-file) | `POST /v1/buckets/{bucket_id}/files/{file_id}/copy` | `client.api.copyFile` | `client.api.copy_file` |
| [List file versions](/api-reference/files#list-file-versions) | `GET /v1/buckets/{bucket_id}/files/{file_id}/versions` | `client.api.listFileVersions` | `client.api.list_file_versions` |
| [Restore a file version](/api-reference/files#restore-a-file-version) | `POST /v1/buckets/{bucket_id}/files/{file_id}/versions/{version_id}/restore` | `client.api.restoreFileVersion` | `client.api.restore_file_version` |
| [Start a batch upload](/api-reference/files#start-a-batch-upload) | `POST /v1/buckets/{bucket_id}/upload_sessions` | `client.api.createUploadSession` | `client.api.create_upload_session` |
| [Get storage targets for a batch](/api-reference/files#get-storage-targets-for-a-batch) | `POST /v1/buckets/{bucket_id}/upload_sessions/{session_id}/uploads` | `client.api.addUploadSessionFiles` | `client.api.add_upload_session_files` |
| [Save uploaded files](/api-reference/files#save-uploaded-files) | `POST /v1/buckets/{bucket_id}/upload_sessions/{session_id}/finalize_batch` | `client.api.saveUploadSessionBatch` | `client.api.save_upload_session_batch` |
| [Finish or cancel a batch upload](/api-reference/files#finish-or-cancel-a-batch-upload) | `POST /v1/buckets/{bucket_id}/upload_sessions/{session_id}/finalize` | `client.api.finalizeUploadSession` | `client.api.finalize_upload_session` |

## [Email domains](/api-reference/email-domains)

Custom domains for mailbox addresses.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [List custom email domains](/api-reference/email-domains#list-custom-email-domains) | `GET /v1/account/email_domains` | `client.api.listEmailDomains` | `client.api.list_email_domains` |
| [Connect a custom email domain](/api-reference/email-domains#connect-a-custom-email-domain) | `POST /v1/account/email_domains` | `client.api.createEmailDomain` | `client.api.create_email_domain` |
| [Check a hostname for conflicting DNS](/api-reference/email-domains#check-a-hostname-for-conflicting-dns) | `POST /v1/account/email_domains/check` | `client.api.checkEmailDomain` | `client.api.check_email_domain` |
| [Read a custom email domain](/api-reference/email-domains#read-a-custom-email-domain) | `GET /v1/account/email_domains/{domain_id}` | `client.api.getEmailDomain` | `client.api.get_email_domain` |
| [Remove an unused custom email domain](/api-reference/email-domains#remove-an-unused-custom-email-domain) | `DELETE /v1/account/email_domains/{domain_id}` | `client.api.deleteEmailDomain` | `client.api.delete_email_domain` |
| [Check DNS and provider setup again](/api-reference/email-domains#check-dns-and-provider-setup-again) | `POST /v1/account/email_domains/{domain_id}/verify` | `client.api.verifyEmailDomain` | `client.api.verify_email_domain` |
| [Get a one-click DNS setup link](/api-reference/email-domains#get-a-one-click-dns-setup-link) | `GET /v1/account/email_domains/{domain_id}/setup_link` | `client.api.getEmailDomainSetupLink` | `client.api.get_email_domain_setup_link` |

## [Publications](/api-reference/publications)

A bucket's site: publish its files, preview them for 24 hours, or take the site down.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [Get the site](/api-reference/publications#get-the-site) | `GET /v1/buckets/{bucket_id}/publication` | `client.api.getPublication` | `client.api.get_publication` |
| [Publish the site](/api-reference/publications#publish-the-site) | `POST /v1/buckets/{bucket_id}/publication` | `client.api.publishBucket` | `client.api.publish_bucket` |
| [Unpublish the site](/api-reference/publications#unpublish-the-site) | `DELETE /v1/buckets/{bucket_id}/publication` | `client.api.unpublishBucket` | `client.api.unpublish_bucket` |
| [Get the preview](/api-reference/publications#get-the-preview) | `GET /v1/buckets/{bucket_id}/publication/preview` | `client.api.getPublicationPreview` | `client.api.get_publication_preview` |
| [Preview the site](/api-reference/publications#preview-the-site) | `POST /v1/buckets/{bucket_id}/publication/preview` | `client.api.previewBucket` | `client.api.preview_bucket` |

## [GitHub](/api-reference/github)

Connect a GitHub repository to a bucket: its files become a copy of one branch, and each push updates them.

| Operation | HTTP | TypeScript | Python |
| --- | --- | --- | --- |
| [List connected GitHub accounts](/api-reference/github#list-connected-github-accounts) | `GET /v1/account/github_installations` | `client.api.listGithubInstallations` | `client.api.list_github_installations` |
| [List the repositories of a GitHub account](/api-reference/github#list-the-repositories-of-a-github-account) | `GET /v1/account/github_installations/{installation_id}/repositories` | `client.api.listGithubRepositories` | `client.api.list_github_repositories` |
| [Read the GitHub repository of a bucket](/api-reference/github#read-the-github-repository-of-a-bucket) | `GET /v1/buckets/{bucket_id}/github_sync` | `client.api.getGithubSync` | `client.api.get_github_sync` |
| [Connect a GitHub repository](/api-reference/github#connect-a-github-repository) | `POST /v1/buckets/{bucket_id}/github_sync` | `client.api.connectGithubRepository` | `client.api.connect_github_repository` |
| [Change GitHub sync settings](/api-reference/github#change-github-sync-settings) | `PATCH /v1/buckets/{bucket_id}/github_sync` | `client.api.updateGithubSync` | `client.api.update_github_sync` |
| [Disconnect the GitHub repository](/api-reference/github#disconnect-the-github-repository) | `DELETE /v1/buckets/{bucket_id}/github_sync` | `client.api.disconnectGithubRepository` | `client.api.disconnect_github_repository` |
| [Sync the GitHub repository now](/api-reference/github#sync-the-github-repository-now) | `POST /v1/buckets/{bucket_id}/github_sync/sync` | `client.api.syncGithubRepository` | `client.api.sync_github_repository` |
| [Get the links to add a GitHub account](/api-reference/github#get-the-links-to-add-a-github-account) | `GET /v1/buckets/{bucket_id}/github_sync/setup_link` | `client.api.getGithubSetupLink` | `client.api.get_github_setup_link` |
