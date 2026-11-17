---
title: "Files API reference"
sidebarTitle: "Files"
description: "Read the files that Revdoku copied from the bucket's GitHub repository. Revdoku only reads a repository: change the files on GitHub."
---

Requests go to `https://api.revdoku.com`. Every path starts with `/v1`, for example `https://api.revdoku.com/v1/buckets`. Send `Authorization: Bearer $REVDOKU_API_KEY` from your server. Tables use JSON names; where TypeScript differs, a field shows `json_name` / `typescriptName`. Python uses the JSON names.

[All operations](/api-reference) · [API guide](/api) · [Errors](/api#errors) · [OpenAPI](/openapi.json)

- [List files](#list-files): `GET /v1/buckets/{bucket_id}/files`
- [Find a file by path](#find-a-file-by-path): `GET /v1/buckets/{bucket_id}/files/by_path`
- [Read file metadata](#read-file-metadata): `GET /v1/buckets/{bucket_id}/files/{file_id}`
- [Get a download link for a file](#get-a-download-link-for-a-file): `GET /v1/buckets/{bucket_id}/files/{file_id}/download`
- [List file versions](#list-file-versions): `GET /v1/buckets/{bucket_id}/files/{file_id}/versions`

## List files

`GET /v1/buckets/{bucket_id}/files`

Lists current files. Listing never marks files read.

| Language | Call |
| --- | --- |
| TypeScript | `client.listFiles({ bucketId })` |
| Python | `client.list_files(bucket_id)` |
| TypeScript, full API | `client.api.listFiles({ bucketId })` |
| Python, full API | `client.api.list_files(bucket_id)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `bucket_id` / `bucketId` | string | yes |  |
| `account_id` / `accountId` | string | no | Select another granted account for this request. Omit to use the credential default. In JSON bodies, send account_id as a body field instead. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |
| `q` | string | no | Case-insensitive text in the path. |
| `folder` | string | no | List one folder. An empty value lists the root. |
| `limit` | integer | no |  |
| `cursor` | string | no | pagination.next_cursor from the previous page. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.listFiles({ bucketId: 'bkt_example' });
for (const file of data.files) {
  console.log(file.id, file.path);
}
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.list_files("bkt_example")
for file in response.data.files:
    print(file.id, file.path)
```

**cURL**

```sh
curl "https://api.revdoku.com/v1/buckets/bkt_example/files" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `files` | array of BucketFile |  |
| `files[].id` | string |  |
| `files[].bucket_id` / `bucketId` | string |  |
| `files[].basename` | string |  |
| `files[].path` | string |  |
| `files[].role` | string |  |
| `files[].created_by_system` / `createdBySystem` | string |  |
| `files[].deleted` | boolean |  |
| `files[].version_reasons` / `versionReasons` | array of FileVersionReason | Fields: `version_id`, `reason`, `created_by_id`, `version_number`, `created_at`. |
| `files[].lock` | object |  |
| `files[].current_file_version` / `currentFileVersion` | FileVersion or null |  |
| `files[].created_by` / `createdBy` | FileActor | Fields: `id`, `name`, `email`. |
| `files[].created_at` / `createdAt` | string (date-time) |  |
| `files[].updated_at` / `updatedAt` | string (date-time) |  |
| `files[].deleted_at` / `deletedAt` | string (date-time) |  |
| `files[].created_by_agent` / `createdByAgent` | object |  |
| `files[].updated_by_agent` / `updatedByAgent` | object |  |
| `files[].created_by_api_key` / `createdByApiKey` | object |  |
| `files[].updated_by_api_key` / `updatedByApiKey` | object |  |
| `files[].read` | boolean |  |
| `files[].read_at` / `readAt` | string (date-time) or null |  |
| `files[].read_by` / `readBy` | FileActor or null |  |
| `files[].read_by_api_key` / `readByApiKey` | FileKey or null |  |
| `pagination` | Pagination | One page of a list. Request the next page with cursor=next_cursor and the same filters. Cursors are opaque strings: do not build or decode them. |
| `pagination.limit` | integer |  |
| `pagination.has_more` / `hasMore` | boolean | True when another page exists. |
| `pagination.next_cursor` / `nextCursor` | string or null | Cursor for the next page; null on the last page. Email lists always return a cursor so that you can poll for new mail. |

```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": "df_example",
        "bucket_id": "bkt_example",
        "basename": "summary.txt",
        "path": "reports/summary.txt",
        "role": "source",
        "deleted": false,
        "lock": {"locked": false},
        "current_file_version": {
          "id": "dfrev_example",
          "file_id": "df_example",
          "version_number": 0,
          "name": "summary.txt",
          "mime_type": "text/plain",
          "byte_size": 1234,
          "sha256": "0d6a3c2b8f5e41a7c9b2d4e6f8a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7",
          "deleted": false,
          "ready": true,
          "has_text": false,
          "created_at": "2026-10-11T12:20:00Z",
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
          "read_by_api_key": null
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
        "created_at": "2026-10-11T12:20:00Z",
        "updated_at": "2026-10-11T12:20:00Z",
        "read": false,
        "read_at": null,
        "read_by": null,
        "read_by_api_key": null
      }
    ],
    "pagination": {"limit": 50, "has_more": false, "next_cursor": null}
  }
}
```

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the read again. `429 EMAIL_SEND_RATE_LIMITED` has no `Retry-After`. |

Guide: [Files](/api#files)

## Find a file by path

`GET /v1/buckets/{bucket_id}/files/by_path`

Returns file metadata only. Read content with the download endpoint. The disposition and content_url parameters return INVALID_ARGUMENT.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.getFileByPath({ bucketId, path })` |
| Python | `client.api.get_file_by_path(bucket_id, path)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `bucket_id` / `bucketId` | string | yes |  |
| `path` | string | yes |  |
| `account_id` / `accountId` | string | no | Select another granted account for this request. Omit to use the credential default. In JSON bodies, send account_id as a body field instead. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.getFileByPath({
  bucketId: 'bkt_example',
  path: 'notes/todo.txt',
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_file_by_path("bkt_example", path="notes/todo.txt")
print(response.data)
```

**cURL**

```sh
curl -G "https://api.revdoku.com/v1/buckets/bkt_example/files/by_path" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  --data-urlencode "path=notes/todo.txt"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `file` | BucketFile | Fields as in [List files](#list-files). |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the read again. `429 EMAIL_SEND_RATE_LIMITED` has no `Retry-After`. |

Error codes named above: `INVALID_ARGUMENT`.

Guide: [Files](/api#files)

## Read file metadata

`GET /v1/buckets/{bucket_id}/files/{file_id}`

Reading metadata never marks the file read.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.getFile({ bucketId, fileId })` |
| Python | `client.api.get_file(bucket_id, file_id)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `bucket_id` / `bucketId` | string | yes |  |
| `file_id` / `fileId` | string | yes |  |
| `account_id` / `accountId` | string | no | Select another granted account for this request. Omit to use the credential default. In JSON bodies, send account_id as a body field instead. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.getFile({
  bucketId: 'bkt_example',
  fileId: 'df_example',
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_file("bkt_example", "df_example")
print(response.data)
```

**cURL**

```sh
curl "https://api.revdoku.com/v1/buckets/bkt_example/files/df_example" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `file` | BucketFile | Fields as in [List files](#list-files). |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the read again. `429 EMAIL_SEND_RATE_LIMITED` has no `Retry-After`. |

Guide: [Files](/api#files)

## Get a download link for a file

`GET /v1/buckets/{bucket_id}/files/{file_id}/download`

Returns a temporary link and marks this version read. Send version_id for an older version.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.getFileDownload({ bucketId, fileId })` |
| Python | `client.api.get_file_download(bucket_id, file_id)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `bucket_id` / `bucketId` | string | yes |  |
| `file_id` / `fileId` | string | yes |  |
| `version_id` / `versionId` | string | no |  |
| `account_id` / `accountId` | string | no | Select another granted account for this request. Omit to use the credential default. In JSON bodies, send account_id as a body field instead. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.getFileDownload({
  bucketId: 'bkt_example',
  fileId: 'df_example',
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_file_download("bkt_example", "df_example")
print(response.data)
```

**cURL**

```sh
curl "https://api.revdoku.com/v1/buckets/bkt_example/files/df_example/download" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `download` | Download | Temporary download link. Fetch url without an API key. Request a new link after it expires. |
| `download.url` | string (uri) |  |
| `download.filename` | string |  |
| `download.content_type` / `contentType` | string or null |  |
| `download.expires_in` / `expiresIn` | integer `900` | Seconds until the link expires. |
| `download.size_bytes` / `sizeBytes` | integer (int64) |  |
| `version` | FileVersion |  |
| `version.id` | string |  |
| `version.file_id` / `fileId` | string |  |
| `version.name` | string |  |
| `version.mime_type` / `mimeType` | string |  |
| `version.sha256` | string |  |
| `version.reason` | string or null |  |
| `version.created_by_system` / `createdBySystem` | string |  |
| `version.deleted` | boolean | True for the version that records a deletion. |
| `version.ready` | boolean |  |
| `version.has_text` / `hasText` | boolean |  |
| `version.version_number` / `versionNumber` | integer (int64) |  |
| `version.byte_size` / `byteSize` | integer (int64) |  |
| `version.created_at` / `createdAt` | string (date-time) |  |
| `version.created_by` / `createdBy` | FileActor | Fields: `id`, `name`, `email`. |
| `version.updated_by` / `updatedBy` | FileActor | Fields: `id`, `name`, `email`. |
| `version.created_by_agent` / `createdByAgent` | object |  |
| `version.updated_by_agent` / `updatedByAgent` | object |  |
| `version.created_by_api_key` / `createdByApiKey` | object |  |
| `version.updated_by_api_key` / `updatedByApiKey` | object |  |
| `version.read` | boolean |  |
| `version.read_at` / `readAt` | string (date-time) or null |  |
| `version.read_by` / `readBy` | FileActor or null |  |
| `version.read_by_api_key` / `readByApiKey` | FileKey or null |  |
| `previously_read` / `previouslyRead` | boolean | Read state before this request, when tracking succeeded. |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the read again. `429 EMAIL_SEND_RATE_LIMITED` has no `Retry-After`. |

Guide: [Files](/api#files)

## List file versions

`GET /v1/buckets/{bucket_id}/files/{file_id}/versions`

Newest first.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.listFileVersions({ bucketId, fileId })` |
| Python | `client.api.list_file_versions(bucket_id, file_id)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `bucket_id` / `bucketId` | string | yes |  |
| `file_id` / `fileId` | string | yes |  |
| `account_id` / `accountId` | string | no | Select another granted account for this request. Omit to use the credential default. In JSON bodies, send account_id as a body field instead. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |
| `limit` | integer | no |  |
| `cursor` | string | no | pagination.next_cursor from the previous page. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.listFileVersions({
  bucketId: 'bkt_example',
  fileId: 'df_example',
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.list_file_versions("bkt_example", "df_example")
print(response.data)
```

**cURL**

```sh
curl "https://api.revdoku.com/v1/buckets/bkt_example/files/df_example/versions" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `versions` | array of FileVersion | Fields as in [Get a download link for a file](#get-a-download-link-for-a-file). |
| `pagination` | Pagination | One page of a list. Request the next page with cursor=next_cursor and the same filters. Cursors are opaque strings: do not build or decode them. Fields as in [List files](#list-files). |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the read again. `429 EMAIL_SEND_RATE_LIMITED` has no `Retry-After`. |

Guide: [Files](/api#files)
