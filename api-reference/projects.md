---
title: "Projects API reference"
sidebarTitle: "Projects"
description: "Create, read, archive and delete projects. A project holds one docs site."
---

Requests go to `https://api.revdoku.com`. Every path starts with `/v1`, for example `https://api.revdoku.com/v1/projects`. Send `Authorization: Bearer $REVDOKU_API_KEY` from your server. Tables use JSON names; where TypeScript differs, a field shows `json_name` / `typescriptName`. Python uses the JSON names.

[All operations](/api-reference) · [API guide](/api) · [Errors](/api#errors) · [OpenAPI](/openapi.json)

- [List projects](#list-projects): `GET /v1/projects`
- [Create a project](#create-a-project): `POST /v1/projects`
- [Read a project](#read-a-project): `GET /v1/projects/{project_id}`
- [Update a project title, description or metadata](#update-a-project-title-description-or-metadata): `PATCH /v1/projects/{project_id}`
- [Permanently delete an archived project](#permanently-delete-an-archived-project): `DELETE /v1/projects/{project_id}`
- [Archive a project](#archive-a-project): `POST /v1/projects/{project_id}/archive`
- [Unarchive a project](#unarchive-a-project): `POST /v1/projects/{project_id}/unarchive`

## List projects

`GET /v1/projects`

Lists active projects by default, newest first. Counts and pages cover only projects this credential can access. Reads no email content.

| Language | Call |
| --- | --- |
| TypeScript | `client.listProjects()` |
| Python | `client.list_projects()` |
| TypeScript, full API | `client.api.listProjects()` |
| Python, full API | `client.api.list_projects()` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `account_id` / `accountId` | string | no | Select another granted account for this request. Omit to use the credential default. In JSON bodies, send account_id as a body field instead. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |
| `status` | string: `active`, `archived`, `all` | no |  |
| `q` | string | no | Case-insensitive text in the project ID, or in the title or address when the key can see the address. |
| `limit` | integer | no |  |
| `cursor` | string | no | pagination.next_cursor from the previous page. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.listProjects();
for (const project of data.projects) {
  console.log(project.id, project.title, project.email?.address);
}
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.list_projects()
for project in response.data.projects:
    print(project.id, project.title, project.email.address if project.email else None)
```

**cURL**

```sh
curl "https://api.revdoku.com/v1/projects" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `projects` | array of Project |  |
| `projects[].id` | string |  |
| `projects[].account_id` / `accountId` | string |  |
| `projects[].title` | string or null | Project title chosen by people. Defaults to the email username given at creation. Null when unset or when the caller cannot see email.address. |
| `projects[].description` | string or null |  |
| `projects[].metadata` | object | Your application data. PATCH replaces the whole object. |
| `projects[].metadata_version` / `metadataVersion` | string | Send as expected_metadata_version on PATCH. Changes only when description or metadata changes. |
| `projects[].email` | ProjectEmail | The project's email address and whether it can receive and send now. Counts read the email index without reading content. Fields: `address`, `message_count`, `unread_count`, `last_received_at`, `receiving_enabled`, `receiving_blocked_reason`, `sending_enabled`, `sending_blocked_reason`. |
| `projects[].status` | string: `active`, `archived` | The lifecycle that a person sets with archive and unarchive: active or archived. It is not background work. An archived project stops receiving email and rejects changes. |
| `projects[].archived_at` / `archivedAt` | string (date-time) or null |  |
| `projects[].lock` | ProjectLock | The lock of a project or of a file. Every key is present: without a lock, locked is false and the other keys are null. The details of the errors PROJECT_LOCKED, FILE_LOCKED and EMAIL_LOCKED have the same names. Fields: `locked`, `expires_at`, `kind`, `message`, `progress`, `locked_by`, `locked_by_api_key`. |
| `projects[].storage_bytes` / `storageBytes` | integer (int64) |  |
| `projects[].files_count` / `filesCount` | integer (int64) | Current files. |
| `projects[].project_version` / `projectVersion` | string or null | The current version of the project's file tree. It changes when a sync copies new files from GitHub, and with every file write, move, restore and delete. Send it as expected_project_version. |
| `projects[].version_number` / `versionNumber` | integer |  |
| `projects[].created_at` / `createdAt` | string (date-time) or null |  |
| `projects[].updated_at` / `updatedAt` | string (date-time) or null |  |
| `projects[].dashboard_url` / `dashboardUrl` | string (uri) or null | Opens the project for signed-in members. It does not grant access. |
| `projects[].archive` | ProjectAction | Whether the caller can archive, unarchive or delete the project now. The three actions have one shape. Fields: `allowed`, `blocked_reason`, `required_action`, `confirmation`. |
| `projects[].unarchive` | ProjectAction | Whether the caller can archive, unarchive or delete the project now. The three actions have one shape. Fields: `allowed`, `blocked_reason`, `required_action`, `confirmation`. |
| `projects[].delete` / `_delete` | ProjectAction | Whether the caller can archive, unarchive or delete the project now. The three actions have one shape. Fields: `allowed`, `blocked_reason`, `required_action`, `confirmation`. |
| `counts` | ProjectCounts | Exact authorized project totals after query filtering, before status filtering and pagination. |
| `counts.active` | integer (int64) |  |
| `counts.archived` | integer (int64) |  |
| `counts.total` | integer (int64) |  |
| `pagination` | Pagination | One page of a list. Request the next page with cursor=next_cursor and the same filters. Cursors are opaque strings: do not build or decode them. |
| `pagination.limit` | integer |  |
| `pagination.has_more` / `hasMore` | boolean | True when another page exists. |
| `pagination.next_cursor` / `nextCursor` | string or null | Cursor for the next page; null on the last page. |

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "prj_example",
        "account_id": "acct_example",
        "title": "acme-orders",
        "description": null,
        "metadata": {},
        "metadata_version": "44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a",
        "email": {
          "address": "support@acme-orders.revdoku.net",
          "message_count": 1,
          "unread_count": 1,
          "last_received_at": "2026-10-11T12:05:00.000000Z",
          "receiving_enabled": true,
          "sending_enabled": true,
          "receiving_blocked_reason": null,
          "sending_blocked_reason": null
        },
        "status": "active",
        "archived_at": null,
        "lock": {
          "locked": false,
          "expires_at": null,
          "kind": null,
          "message": null,
          "progress": null,
          "locked_by": null,
          "locked_by_api_key": null
        },
        "storage_bytes": 51840,
        "files_count": 3,
        "project_version": "prjrv_example",
        "version_number": 0,
        "created_at": "2026-10-11T12:00:00.000000Z",
        "updated_at": "2026-10-11T12:05:00.000000Z",
        "dashboard_url": "https://app.revdoku.com/projects/view?account_id=acct_example&id=prj_example",
        "archive": {
          "allowed": true,
          "blocked_reason": null,
          "required_action": null,
          "confirmation": null
        },
        "unarchive": {
          "allowed": false,
          "blocked_reason": "not_archived",
          "required_action": null,
          "confirmation": null
        },
        "delete": {
          "allowed": false,
          "blocked_reason": "not_archived",
          "required_action": "archive_first",
          "confirmation": "delete prj_example"
        }
      }
    ],
    "counts": {"active": 1, "archived": 0, "total": 1},
    "pagination": {"limit": 50, "has_more": false, "next_cursor": null}
  }
}
```

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Guide: [Projects](/api#projects)

## Create a project

`POST /v1/projects`

Waits until the address can receive email. Every project gets the address support@<name>.revdoku.net. On this built-in domain, email.username is the project's name: lowercase letters, digits and single hyphens, 3 to 63 characters, also the name of its site. A name that another project uses as an address or a site address, or that another account used, returns EMAIL_ALREADY_EXISTS; your account can use its own earlier names again. Without email.username the address takes the title's name when it is free, else two readable words. A custom domain takes the exact name. If confirmation does not finish, EMAIL_NOT_READY returns the created project_id in error.details: read that project instead of creating another. The title defaults to email.username; a title that another active project uses returns 409 PROJECT_TITLE_TAKEN. Its files come from a GitHub repository: connect one with the GitHub operations. Never retry a creation automatically.

| Language | Call |
| --- | --- |
| TypeScript | `client.createProject({ username, domain, title })` |
| Python | `client.create_project(username=..., domain=..., title=...)` |
| TypeScript, full API | `client.api.createProject({ projectCreate })` |
| Python, full API | `client.api.create_project(project_create)` |

**Request body**: TypeScript `projectCreate: ProjectCreate`, Python `project_create=ProjectCreate(...)`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | string | no | Optional title. Defaults to email.username as given, or to the generated name. A title that another active project uses returns 409 PROJECT_TITLE_TAKEN. |
| `description` | string | no |  |
| `metadata` | object | no | Your own JSON object. A key that starts with publication_, and revdoku_attribution, allow_search_indexing, access_email_allowlist and website_project, are site settings: they answer 422 INVALID_ARGUMENT. Change them with PATCH /v1/projects/{project_id}/site_settings. |
| `email` | ProjectEmailOptions | no |  |
| `email.username` | string | no | On the built-in domain, every plan: the project's name, the same name as its site; the address is support@<name>.revdoku.net. Dots and underscores become hyphens; it needs 3 to 63 lowercase letters, digits and single hyphens (fewer than 3 returns EMAIL_NAME_INVALID). On a custom domain: the exact name before @, normalized to lowercase. Omit to use the title's name or two readable words; blank/null is invalid. Unavailable names return EMAIL_ALREADY_EXISTS. |
| `email.domain` | string | no | The built-in domain revdoku.net on any plan, or a ready custom email domain owned by the selected account on an eligible plan. Omit for the default platform domain. |
| `account_id` / `accountId` | string | no | Select another granted account for this request. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
// Never retry automatically after an uncertain result. List projects first.
const { data } = await client.createProject({ username: 'support', title: 'Support' });
console.log(data.project.id, data.project.email?.address);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
# Never retry automatically after an uncertain result. List projects first.
response = client.create_project(username="support", title="Support")
project = response.data.project
print(project.id, project.email.address if project.email else None)
```

**cURL**

```sh
curl -X POST "https://api.revdoku.com/v1/projects" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "Acme docs", "email": {"username": "acme-docs"}}'
```

**Response** `201`

| Field | Type | Description |
| --- | --- | --- |
| `project` | Project | A project holds one docs site: the files, the published site, the site analytics, and the support email address with its tickets. Name it with title (the address part of email.address when title is null). Use id in API calls. Fields as in [List projects](#list-projects). |

```json
{
  "success": true,
  "data": {
    "project": {
      "id": "prj_example",
      "account_id": "acct_example",
      "title": "acme-orders",
      "description": null,
      "metadata": {},
      "metadata_version": "44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a",
      "email": {
        "address": "support@acme-orders.revdoku.net",
        "message_count": 0,
        "unread_count": 0,
        "last_received_at": null,
        "receiving_enabled": true,
        "sending_enabled": true,
        "receiving_blocked_reason": null,
        "sending_blocked_reason": null
      },
      "status": "active",
      "archived_at": null,
      "lock": {
        "locked": false,
        "expires_at": null,
        "kind": null,
        "message": null,
        "progress": null,
        "locked_by": null,
        "locked_by_api_key": null
      },
      "storage_bytes": 0,
      "files_count": 0,
      "project_version": "prjrv_example",
      "version_number": 0,
      "created_at": "2026-10-11T12:00:00.000000Z",
      "updated_at": "2026-10-11T12:00:00.000000Z",
      "dashboard_url": "https://app.revdoku.com/projects/view?account_id=acct_example&id=prj_example",
      "archive": {
        "allowed": true,
        "blocked_reason": null,
        "required_action": null,
        "confirmation": null
      },
      "unarchive": {
        "allowed": false,
        "blocked_reason": "not_archived",
        "required_action": null,
        "confirmation": null
      },
      "delete": {
        "allowed": false,
        "blocked_reason": "not_archived",
        "required_action": "archive_first",
        "confirmation": "delete prj_example"
      }
    }
  }
}
```

**Errors**

| Status | Description |
| --- | --- |
| `401` | Missing or invalid API key |
| Other 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Error codes named above: `EMAIL_ALREADY_EXISTS`, `EMAIL_NOT_READY`, `PROJECT_TITLE_TAKEN`.

Guide: [Create a project](/api#create-a-project)

## Read a project

`GET /v1/projects/{project_id}`

Reading never changes the project. Read address settings, emails and files through their own endpoints.

| Language | Call |
| --- | --- |
| TypeScript | `client.getProject({ projectId })` |
| Python | `client.get_project(project_id)` |
| TypeScript, full API | `client.api.getProject({ projectId })` |
| Python, full API | `client.api.get_project(project_id)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` / `projectId` | string | yes |  |
| `account_id` / `accountId` | string | no | Select another granted account for this request. Omit to use the credential default. In JSON bodies, send account_id as a body field instead. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.getProject({ projectId: 'prj_example' });
console.log(data.project.title, data.project.email?.address);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.get_project("prj_example")
project = response.data.project
print(project.title, project.email.address if project.email else None)
```

**cURL**

```sh
curl "https://api.revdoku.com/v1/projects/prj_example" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `project` | Project | A project holds one docs site: the files, the published site, the site analytics, and the support email address with its tickets. Name it with title (the address part of email.address when title is null). Use id in API calls. Fields as in [List projects](#list-projects). |

```json
{
  "success": true,
  "data": {
    "project": {
      "id": "prj_example",
      "account_id": "acct_example",
      "title": "acme-orders",
      "description": null,
      "metadata": {},
      "metadata_version": "44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a",
      "email": {
        "address": "support@acme-orders.revdoku.net",
        "message_count": 1,
        "unread_count": 1,
        "last_received_at": "2026-10-11T12:05:00.000000Z",
        "receiving_enabled": true,
        "sending_enabled": true,
        "receiving_blocked_reason": null,
        "sending_blocked_reason": null
      },
      "status": "active",
      "archived_at": null,
      "lock": {
        "locked": false,
        "expires_at": null,
        "kind": null,
        "message": null,
        "progress": null,
        "locked_by": null,
        "locked_by_api_key": null
      },
      "storage_bytes": 51840,
      "files_count": 3,
      "project_version": "prjrv_example",
      "version_number": 0,
      "created_at": "2026-10-11T12:00:00.000000Z",
      "updated_at": "2026-10-11T12:05:00.000000Z",
      "dashboard_url": "https://app.revdoku.com/projects/view?account_id=acct_example&id=prj_example",
      "archive": {
        "allowed": true,
        "blocked_reason": null,
        "required_action": null,
        "confirmation": null
      },
      "unarchive": {
        "allowed": false,
        "blocked_reason": "not_archived",
        "required_action": null,
        "confirmation": null
      },
      "delete": {
        "allowed": false,
        "blocked_reason": "not_archived",
        "required_action": "archive_first",
        "confirmation": "delete prj_example"
      }
    }
  }
}
```

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Guide: [Projects](/api#projects)

## Update a project title, description or metadata

`PATCH /v1/projects/{project_id}`

metadata must be a JSON object. It replaces the stored object; {} clears it. Send expected_metadata_version from your last read; a stale value changes nothing and returns PROJECT_METADATA_CONFLICT. Titles are unique among active projects; a used title returns 409 PROJECT_TITLE_TAKEN.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.updateProject({ projectId, projectUpdate })` |
| Python | `client.api.update_project(project_id, project_update)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` / `projectId` | string | yes |  |

**Request body**: TypeScript `projectUpdate: ProjectUpdate`, Python `project_update=ProjectUpdate(...)`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | string or null | no | New title. An empty string or null clears it. A title that another active project uses returns 409 PROJECT_TITLE_TAKEN. |
| `description` | string | no |  |
| `metadata` | object | no | Replaces the whole object. Your own JSON object. A key that starts with publication_, and revdoku_attribution, allow_search_indexing, access_email_allowlist and website_project, are site settings: they answer 422 INVALID_ARGUMENT. Change them with PATCH /v1/projects/{project_id}/site_settings. |
| `expected_metadata_version` / `expectedMetadataVersion` | string | no |  |
| `account_id` / `accountId` | string | no | Select another granted account for this request. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.updateProject({
  projectId: 'prj_example',
  projectUpdate: { title: 'Support' },
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku, ProjectUpdate

client = Revdoku()
response = client.api.update_project(
    "prj_example",
    ProjectUpdate(title="Support"),
)
print(response.data)
```

**cURL**

```sh
curl -X PATCH "https://api.revdoku.com/v1/projects/prj_example" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "Support"}'
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `project` | Project | A project holds one docs site: the files, the published site, the site analytics, and the support email address with its tickets. Name it with title (the address part of email.address when title is null). Use id in API calls. Fields as in [List projects](#list-projects). |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Error codes named above: `PROJECT_METADATA_CONFLICT`, `PROJECT_TITLE_TAKEN`.

Guide: [Update a project](/api#update-a-project)

## Permanently delete an archived project

`DELETE /v1/projects/{project_id}`

Archive the project first. Send delete.confirmation from the project read as the query parameter confirmation, after the user confirms. Large projects finish deleting in the background.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.deleteProject({ projectId, confirmation })` |
| Python | `client.api.delete_project(project_id, confirmation)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` / `projectId` | string | yes |  |
| `confirmation` | string | yes | delete.confirmation from the project read, after the user confirms. A body is refused. |
| `account_id` / `accountId` | string | no | Select another granted account for this request. Omit to use the credential default. In JSON bodies, send account_id as a body field instead. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.deleteProject({
  projectId: 'prj_example',
  confirmation: 'CONFIRMATION_FROM_PROJECT_READ',
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.delete_project(
    "prj_example",
    confirmation="CONFIRMATION_FROM_PROJECT_READ",
)
print(response.data)
```

**cURL**

```sh
curl -X DELETE "https://api.revdoku.com/v1/projects/prj_example" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  --data-urlencode "confirmation=CONFIRMATION_FROM_PROJECT_READ"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `deleted` | boolean `true` |  |
| `id` | string | ID of the deleted resource. A webhook delete returns the project ID. |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Guide: [Delete a project](/api#delete-a-project)

## Archive a project

`POST /v1/projects/{project_id}/archive`

Archived projects keep their files and emails and become read-only.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.archiveProject({ projectId, actionRequest })` |
| Python | `client.api.archive_project(project_id, action_request)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` / `projectId` | string | yes |  |

**Request body**: TypeScript `actionRequest: ActionRequest`, Python `action_request=ActionRequest(...)`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `account_id` / `accountId` | string | no | Select another granted account for this request. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.archiveProject({
  projectId: 'prj_example',
  actionRequest: {},
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku, ActionRequest

client = Revdoku()
response = client.api.archive_project("prj_example", ActionRequest())
print(response.data)
```

**cURL**

```sh
curl -X POST "https://api.revdoku.com/v1/projects/prj_example/archive" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `project` | Project | A project holds one docs site: the files, the published site, the site analytics, and the support email address with its tickets. Name it with title (the address part of email.address when title is null). Use id in API calls. Fields as in [List projects](#list-projects). |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Guide: [Projects](/api#projects)

## Unarchive a project

`POST /v1/projects/{project_id}/unarchive`

Requires project-admin permission.

The project becomes writable again. If another active project has the same title, the title gets a number suffix. A project that is not archived returns PROJECT_NOT_ARCHIVED.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.unarchiveProject({ projectId, actionRequest })` |
| Python | `client.api.unarchive_project(project_id, action_request)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` / `projectId` | string | yes |  |

**Request body**: TypeScript `actionRequest: ActionRequest`, Python `action_request=ActionRequest(...)`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `account_id` / `accountId` | string | no | Select another granted account for this request. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.unarchiveProject({
  projectId: 'prj_example',
  actionRequest: {},
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku, ActionRequest

client = Revdoku()
response = client.api.unarchive_project("prj_example", ActionRequest())
print(response.data)
```

**cURL**

```sh
curl -X POST "https://api.revdoku.com/v1/projects/prj_example/unarchive" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `project` | Project | A project holds one docs site: the files, the published site, the site analytics, and the support email address with its tickets. Name it with title (the address part of email.address when title is null). Use id in API calls. Fields as in [List projects](#list-projects). |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Error codes named above: `PROJECT_NOT_ARCHIVED`.

Guide: [Projects](/api#projects)
