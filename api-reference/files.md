---
title: "Files API reference"
sidebarTitle: "Files"
description: "A project's files: the read-only copy of the GitHub repository (`_repo/`) and the knowledge base (`_kb/`). List the files, read one and its versions. Write the knowledge base with the Articles operations."
---

| Operation | Request |
| --- | --- |
| [List files](#list-files) | `GET /v1/projects/{project_id}/files` |
| [Find a file by path](#find-a-file-by-path) | `GET /v1/projects/{project_id}/files/by_path` |
| [Read file metadata](#read-file-metadata) | `GET /v1/projects/{project_id}/files/{file_id}` |
| [Get a download link for a file](#get-a-download-link-for-a-file) | `GET /v1/projects/{project_id}/files/{file_id}/download` |
| [List file versions](#list-file-versions) | `GET /v1/projects/{project_id}/files/{file_id}/versions` |

## List files

`GET /v1/projects/{project_id}/files`

Lists current files with their real paths: _repo/ holds the read-only copy of the GitHub repository, and _kb/ holds the knowledge base (_kb/public/ and _kb/private/). Listing never marks files read.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `q` | string | no | Case-insensitive text in the path. |
| `folder` | string | no | List one folder. An empty value lists the root. |
| `limit` | integer | no |  |
| `cursor` | string | no | pagination.next_cursor from the previous page. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.listFiles({ projectId: 'prj_example' });
for (const file of data.files) {
  console.log(file.id, file.path);
}
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.list_files("prj_example")
for file in response.data.files:
    print(file.id, file.path)
```

```sh cURL
curl "https://api.revdoku.com/v1/projects/prj_example/files" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `files` | array of ProjectFile |  |
| `files[].id` | string |  |
| `files[].project_id` | string |  |
| `files[].name` | string or null |  |
| `files[].path` | string |  |
| `files[].role` | string |  |
| `files[].created_by_system` | string or null |  |
| `files[].deleted` | boolean |  |
| `files[].version_reasons` | array of FileVersionReason or null | The reasons of the versions that have one. Null in a file list: read one file for its reasons. Fields: `version_id`, `reason`, `created_by_id`, `version_number`, `created_at`. |
| `files[].lock` | ProjectLock | The lock of a project or of a file. Every key is present: without a lock, locked is false and the other keys are null. The details of the errors PROJECT_LOCKED, FILE_LOCKED and EMAIL_LOCKED have the same names. Fields: `locked`, `expires_at`, `kind`, `message`, `progress`, `locked_by`, `locked_by_api_key`. |
| `files[].current_file_version` | FileVersion or null |  |
| `files[].created_by` | FileActor or null |  |
| `files[].created_at` | string (date-time) |  |
| `files[].updated_at` | string (date-time) |  |
| `files[].deleted_at` | string (date-time) or null |  |
| `files[].created_by_agent` | object or null |  |
| `files[].updated_by_agent` | object or null |  |
| `files[].created_by_api_key` | object or null |  |
| `files[].updated_by_api_key` | object or null |  |
| `files[].read` | boolean |  |
| `files[].read_at` | string (date-time) or null |  |
| `files[].read_by` | FileActor or null |  |
| `files[].read_by_api_key` | FileKey or null |  |
| `pagination` | Pagination | One page of a list. Request the next page with cursor=next_cursor and the same filters. Cursors are opaque strings: do not build or decode them. |
| `pagination.limit` | integer |  |
| `pagination.has_more` | boolean | True when another page exists. |
| `pagination.next_cursor` | string or null | Cursor for the next page; null on the last page. |

<Accordion title="Example response">

```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": "df_example",
        "project_id": "prj_example",
        "name": "summary.txt",
        "path": "reports/summary.txt",
        "role": "source",
        "deleted": false,
        "lock": {
          "locked": false,
          "expires_at": null,
          "kind": null,
          "message": null,
          "progress": null,
          "locked_by": null,
          "locked_by_api_key": null
        },
        "current_file_version": {
          "id": "dfrev_example",
          "file_id": "df_example",
          "version_number": 0,
          "name": "summary.txt",
          "content_type": "text/plain",
          "size_bytes": 1234,
          "sha256": "0d6a3c2b8f5e41a7c9b2d4e6f8a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7",
          "deleted": false,
          "ready": true,
          "has_text": false,
          "created_at": "2026-10-11T12:20:00.000000Z",
          "created_by": {
            "id": "user_example",
            "email": "ada@example.com",
            "name": "Ada Lovelace"
          },
          "updated_by": {
            "id": "user_example",
            "email": "ada@example.com",
            "name": "Ada Lovelace"
          },
          "created_by_api_key": {
            "id": "atok_example",
            "label": "Orders backend",
            "token_type": "api"
          },
          "created_by_agent": {"name": "Orders backend"},
          "updated_by_api_key": {
            "id": "atok_example",
            "label": "Orders backend",
            "token_type": "api"
          },
          "updated_by_agent": {"name": "Orders backend"},
          "read": false,
          "read_at": null,
          "read_by": null,
          "read_by_api_key": null,
          "reason": null,
          "created_by_system": null
        },
        "created_by": {
          "id": "user_example",
          "email": "ada@example.com",
          "name": "Ada Lovelace"
        },
        "created_by_api_key": {
          "id": "atok_example",
          "label": "Orders backend",
          "token_type": "api"
        },
        "created_by_agent": {"name": "Orders backend"},
        "updated_by_api_key": {
          "id": "atok_example",
          "label": "Orders backend",
          "token_type": "api"
        },
        "updated_by_agent": {"name": "Orders backend"},
        "created_at": "2026-10-11T12:20:00.000000Z",
        "updated_at": "2026-10-11T12:20:00.000000Z",
        "read": false,
        "read_at": null,
        "read_by": null,
        "read_by_api_key": null,
        "created_by_system": null,
        "version_reasons": null,
        "deleted_at": null
      }
    ],
    "pagination": {"limit": 50, "has_more": false, "next_cursor": null}
  }
}
```

</Accordion>

Guide: [Files](/api#files)

## Find a file by path

`GET /v1/projects/{project_id}/files/by_path`

Returns file metadata only. Read content with the download endpoint. The disposition and content_url parameters return INVALID_ARGUMENT.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `path` | string | yes |  |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.getFileByPath({
  projectId: 'prj_example',
  path: 'notes/todo.txt',
});
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_file_by_path("prj_example", path="notes/todo.txt")
print(response.data)
```

```sh cURL
curl -G "https://api.revdoku.com/v1/projects/prj_example/files/by_path" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  --data-urlencode "path=notes/todo.txt"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `file` | ProjectFile | Fields as in [List files](#list-files). |

Guide: [Files](/api#files)

## Read file metadata

`GET /v1/projects/{project_id}/files/{file_id}`

Reading metadata never marks the file read.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `file_id` | string | yes |  |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.getFile({
  projectId: 'prj_example',
  fileId: 'df_example',
});
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_file("prj_example", "df_example")
print(response.data)
```

```sh cURL
curl "https://api.revdoku.com/v1/projects/prj_example/files/df_example" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `file` | ProjectFile | Fields as in [List files](#list-files). |

Guide: [Files](/api#files)

## Get a download link for a file

`GET /v1/projects/{project_id}/files/{file_id}/download`

Returns a temporary link and marks this version read. Send version_id for an older version. disposition decides how a browser treats the link.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `file_id` | string | yes |  |
| `version_id` | string | no |  |
| `disposition` | string: `attachment`, `inline` | no | How a browser treats the download link: attachment saves the file, inline shows it. Only images and PDF files show inline; other files are saved. Another value returns 422 INVALID_ARGUMENT. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.getFileDownload({
  projectId: 'prj_example',
  fileId: 'df_example',
});
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_file_download("prj_example", "df_example")
print(response.data)
```

```sh cURL
curl "https://api.revdoku.com/v1/projects/prj_example/files/df_example/download" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `download` | Download | Temporary download link. Fetch url without an API key. Request a new link after it expires. |
| `download.url` | string (uri) |  |
| `download.name` | string |  |
| `download.content_type` | string or null |  |
| `download.expires_in_seconds` | integer `900` | Seconds until the link expires. |
| `download.size_bytes` | integer (int64) |  |
| `version` | FileVersion |  |
| `version.id` | string |  |
| `version.file_id` | string |  |
| `version.name` | string or null |  |
| `version.content_type` | string |  |
| `version.sha256` | string or null |  |
| `version.reason` | string or null |  |
| `version.created_by_system` | string or null |  |
| `version.deleted` | boolean | True for the version that records a deletion. |
| `version.ready` | boolean |  |
| `version.has_text` | boolean |  |
| `version.version_number` | integer (int64) |  |
| `version.size_bytes` | integer (int64) or null |  |
| `version.created_at` | string (date-time) |  |
| `version.created_by` | FileActor or null |  |
| `version.updated_by` | FileActor or null |  |
| `version.created_by_agent` | object or null |  |
| `version.updated_by_agent` | object or null |  |
| `version.created_by_api_key` | object or null |  |
| `version.updated_by_api_key` | object or null |  |
| `version.read` | boolean |  |
| `version.read_at` | string (date-time) or null |  |
| `version.read_by` | FileActor or null |  |
| `version.read_by_api_key` | FileKey or null |  |
| `previously_read` | boolean or null | The read state before this request. Null when the read was not recorded. |

Guide: [Files](/api#files)

## List file versions

`GET /v1/projects/{project_id}/files/{file_id}/versions`

Newest first.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `file_id` | string | yes |  |
| `limit` | integer | no |  |
| `cursor` | string | no | pagination.next_cursor from the previous page. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.listFileVersions({
  projectId: 'prj_example',
  fileId: 'df_example',
});
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.list_file_versions("prj_example", "df_example")
print(response.data)
```

```sh cURL
curl "https://api.revdoku.com/v1/projects/prj_example/files/df_example/versions" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `versions` | array of FileVersion | Fields as in [Get a download link for a file](#get-a-download-link-for-a-file). |
| `pagination` | Pagination | One page of a list. Request the next page with cursor=next_cursor and the same filters. Cursors are opaque strings: do not build or decode them. Fields as in [List files](#list-files). |

Guide: [Files](/api#files)
