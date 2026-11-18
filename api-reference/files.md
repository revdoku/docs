---
title: "Files API reference"
sidebarTitle: "Files"
description: "Read the files that Revdoku copied from the bucket's GitHub repository. Revdoku only reads a repository: change the files on GitHub."
---

Requests go to `https://api.revdoku.com`. Every path starts with `/v1`, for example `https://api.revdoku.com/v1/buckets`. Send `Authorization: Bearer $REVDOKU_API_KEY` from your server. Tables use JSON names; where TypeScript differs, a field shows `json_name` / `typescriptName`. Python uses the JSON names.

[All operations](/api-reference) · [API guide](/api) · [Errors](/api#errors) · [OpenAPI](/openapi.json)

- [List files](#list-files): `GET /v1/buckets/{bucket_id}/files`
- [Write a knowledge base file](#write-a-knowledge-base-file): `POST /v1/buckets/{bucket_id}/files`
- [Get an upload link for an image](#get-an-upload-link-for-an-image): `POST /v1/buckets/{bucket_id}/uploads`
- [Find a file by path](#find-a-file-by-path): `GET /v1/buckets/{bucket_id}/files/by_path`
- [Read file metadata](#read-file-metadata): `GET /v1/buckets/{bucket_id}/files/{file_id}`
- [Delete a knowledge base file](#delete-a-knowledge-base-file): `DELETE /v1/buckets/{bucket_id}/files/{file_id}`
- [Get a download link for a file](#get-a-download-link-for-a-file): `GET /v1/buckets/{bucket_id}/files/{file_id}/download`
- [List file versions](#list-file-versions): `GET /v1/buckets/{bucket_id}/files/{file_id}/versions`
- [Move or rename a knowledge base file](#move-or-rename-a-knowledge-base-file): `POST /v1/buckets/{bucket_id}/files/{file_id}/move`
- [Restore a file version](#restore-a-file-version): `POST /v1/buckets/{bucket_id}/files/{file_id}/versions/{version_id}/restore`

## List files

`GET /v1/buckets/{bucket_id}/files`

Lists current files with their real paths: _repo/ holds the read-only copy of the GitHub repository, and _kb/ holds the knowledge base (_kb/public/ and _kb/private/). Listing never marks files read.

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

## Write a knowledge base file

`POST /v1/buckets/{bucket_id}/files`

Requires bucket write permission.

The knowledge base is the bucket folder _kb/: _kb/public/ is published with the site, and _kb/private/ is never published. Every other file of a bucket is read-only: the files of _repo/ change on GitHub. Send one of content (a page), content_base64 (a small image) or signed_blob_id (an uploaded image). A file at the path gets a new version. A file in _kb/public/ needs publish permission; without it the answer is 403 KB_PUBLISH_PERMISSION_REQUIRED. A write never publishes: the site shows a public file after the next publish. Another path returns 422 KB_PATH_REQUIRED, SYNCED_COPY_READ_ONLY or RESERVED_PATH, and another file type 422 KB_FILE_TYPE_UNSUPPORTED. A page of _kb/public/ with the front matter line do_not_publish: true stays off the site, and the site's AI Support Agent still answers visitors from it: put only facts that visitors may know there, never secrets. A file above the account's file size limit returns 413 FILE_TOO_LARGE. A locked bucket or file returns 423 BUCKET_LOCKED or FILE_LOCKED.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.writeFile({ bucketId, fileWriteRequest })` |
| Python | `client.api.write_file(bucket_id, file_write_request)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `bucket_id` / `bucketId` | string | yes |  |

**Request body**: TypeScript `fileWriteRequest: FileWriteRequest`, Python `file_write_request=FileWriteRequest(...)`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | yes | A path in _kb/public/ or _kb/private/, for example _kb/private/refunds.md. A page ends in .md or .mdx; an image in .jpg, .jpeg, .png or .webp. |
| `content` | string | no | The UTF-8 text of a page. |
| `content_base64` / `contentBase64` | string | no | An image of at most 256 KB, as Base64. |
| `signed_blob_id` / `signedBlobId` | string | no | signed_blob_id of an upload, after the bytes are sent. |
| `expected_bucket_version` / `expectedBucketVersion` | string | no | The bucket version from your last read. A stale value returns 409 BUCKET_VERSION_CONFLICT and writes nothing. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |
| `account_id` / `accountId` | string | no | Select another granted account for this request. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.writeFile({
  bucketId: 'bkt_example',
  fileWriteRequest: { path: 'notes/todo.txt' },
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku, FileWriteRequest

client = Revdoku()
response = client.api.write_file(
    "bkt_example",
    FileWriteRequest(path="notes/todo.txt"),
)
print(response.data)
```

**cURL**

```sh
curl -X POST "https://api.revdoku.com/v1/buckets/bkt_example/files" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"path": "notes/todo.txt"}'
```

**Response** `201`, `200`

| Field | Type | Description |
| --- | --- | --- |
| `path` | string |  |
| `file` | BucketFile | Fields as in [List files](#list-files). |
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
| `created` | boolean | False for a new version of a file. |
| `unchanged` | boolean | True when the file had this content already. Then no version is added. |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the read again. `429 EMAIL_SEND_RATE_LIMITED` has no `Retry-After`. |

Error codes named above: `BUCKET_LOCKED`, `FILE_LOCKED`, `FILE_TOO_LARGE`, `KB_FILE_TYPE_UNSUPPORTED`, `KB_PATH_REQUIRED`, `KB_PUBLISH_PERMISSION_REQUIRED`, `RESERVED_PATH`, `SYNCED_COPY_READ_ONLY`.

Guide: [Files](/api#files)

## Get an upload link for an image

`POST /v1/buckets/{bucket_id}/uploads`

Requires bucket write permission.

For an image of the knowledge base that is larger than 256 KB, or for a client that sends files itself. Send the bytes with PUT to upload.url with upload.headers, then call POST /files with path and signed_blob_id. The link works for one hour. The size limit is the account's file size limit. A path outside _kb/ or another file type returns 422 KB_PATH_REQUIRED or KB_FILE_TYPE_UNSUPPORTED, and a file above the limit 413 FILE_TOO_LARGE.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.createFileUpload({ bucketId, fileUploadRequest })` |
| Python | `client.api.create_file_upload(bucket_id, file_upload_request)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `bucket_id` / `bucketId` | string | yes |  |

**Request body**: TypeScript `fileUploadRequest: FileUploadRequest`, Python `file_upload_request=FileUploadRequest(...)`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | yes | The path of the image in _kb/public/ or _kb/private/. |
| `byte_size` / `byteSize` | integer | yes | The size of the image in bytes. |
| `checksum` | string | yes | The MD5 of the bytes, as Base64. |
| `sha256` | string | yes | The SHA-256 of the bytes, as hex. |
| `account_id` / `accountId` | string | no | Select another granted account for this request. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.createFileUpload({
  bucketId: 'bkt_example',
  fileUploadRequest: {
    path: 'notes/todo.txt',
    byteSize: 1,
    checksum: 'example',
    sha256: 'example',
  },
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku, FileUploadRequest

client = Revdoku()
response = client.api.create_file_upload(
    "bkt_example",
    FileUploadRequest(
        path="notes/todo.txt",
        byte_size=1,
        checksum="example",
        sha256="example",
    ),
)
print(response.data)
```

**cURL**

```sh
curl -X POST "https://api.revdoku.com/v1/buckets/bkt_example/uploads" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "path": "notes/todo.txt",
  "byte_size": 1,
  "checksum": "example",
  "sha256": "example"
}'
```

**Response** `201`

| Field | Type | Description |
| --- | --- | --- |
| `path` | string |  |
| `signed_blob_id` / `signedBlobId` | string | Send it to POST /files after the bytes are sent. |
| `upload` | object |  |
| `upload.method` | string `"PUT"` |  |
| `upload.url` | string (uri) |  |
| `upload.headers` | object | Send these headers with the bytes. |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the read again. `429 EMAIL_SEND_RATE_LIMITED` has no `Retry-After`. |

Error codes named above: `FILE_TOO_LARGE`, `KB_FILE_TYPE_UNSUPPORTED`, `KB_PATH_REQUIRED`.

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

## Delete a knowledge base file

`DELETE /v1/buckets/{bucket_id}/files/{file_id}`

Requires bucket write permission, and publish permission for a file in _kb/public/.

Deletes one file of the knowledge base. Its versions stay: keep the file ID of the answer, list the versions with GET /files/{file_id}/versions and restore one to bring the file back. A path outside _kb/ returns 422 KB_PATH_REQUIRED, SYNCED_COPY_READ_ONLY or RESERVED_PATH. A locked bucket or file returns 423 BUCKET_LOCKED or FILE_LOCKED.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.deleteFile({ bucketId, fileId })` |
| Python | `client.api.delete_file(bucket_id, file_id)` |

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
const { data } = await client.api.deleteFile({
  bucketId: 'bkt_example',
  fileId: 'df_example',
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.delete_file("bkt_example", "df_example")
print(response.data)
```

**cURL**

```sh
curl -X DELETE "https://api.revdoku.com/v1/buckets/bkt_example/files/df_example" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `deleted` | boolean `true` |  |
| `id` | string | ID of the deleted resource. A webhook delete returns the bucket ID. |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the read again. `429 EMAIL_SEND_RATE_LIMITED` has no `Retry-After`. |

Error codes named above: `BUCKET_LOCKED`, `FILE_LOCKED`, `KB_PATH_REQUIRED`, `RESERVED_PATH`, `SYNCED_COPY_READ_ONLY`.

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
| `version` | FileVersion | Fields as in [Write a knowledge base file](#write-a-knowledge-base-file). |
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
| `versions` | array of FileVersion | Fields as in [Write a knowledge base file](#write-a-knowledge-base-file). |
| `pagination` | Pagination | One page of a list. Request the next page with cursor=next_cursor and the same filters. Cursors are opaque strings: do not build or decode them. Fields as in [List files](#list-files). |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the read again. `429 EMAIL_SEND_RATE_LIMITED` has no `Retry-After`. |

Guide: [Files](/api#files)

## Move or rename a knowledge base file

`POST /v1/buckets/{bucket_id}/files/{file_id}/move`

Requires bucket write permission.

Moves one file inside the knowledge base to new_path: a new name (a rename), another folder, or from _kb/private/ to _kb/public/ and back. A move to or from _kb/public/ needs publish permission (403 KB_PUBLISH_PERMISSION_REQUIRED). The file keeps its ID and its versions. A file at the new path returns 409 BUCKET_FILE_PATH_EXISTS. The site changes after the next publish. A path outside _kb/ returns 422 KB_PATH_REQUIRED, SYNCED_COPY_READ_ONLY or RESERVED_PATH. A locked bucket or file returns 423 BUCKET_LOCKED or FILE_LOCKED.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.moveFile({ bucketId, fileId, fileMoveRequest })` |
| Python | `client.api.move_file(bucket_id, file_id, file_move_request)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `bucket_id` / `bucketId` | string | yes |  |
| `file_id` / `fileId` | string | yes |  |

**Request body**: TypeScript `fileMoveRequest: FileMoveRequest`, Python `file_move_request=FileMoveRequest(...)`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `new_path` / `newPath` | string | yes | The new path in _kb/public/ or _kb/private/: a new name, another folder, or the other of the two folders. It keeps the file type. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |
| `account_id` / `accountId` | string | no | Select another granted account for this request. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.moveFile({
  bucketId: 'bkt_example',
  fileId: 'df_example',
  fileMoveRequest: { newPath: 'example' },
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku, FileMoveRequest

client = Revdoku()
response = client.api.move_file(
    "bkt_example",
    "df_example",
    FileMoveRequest(new_path="example"),
)
print(response.data)
```

**cURL**

```sh
curl -X POST "https://api.revdoku.com/v1/buckets/bkt_example/files/df_example/move" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"new_path": "example"}'
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `path` | string |  |
| `old_path` / `oldPath` | string |  |
| `file` | BucketFile | Fields as in [List files](#list-files). |
| `version` | FileVersion | Fields as in [Write a knowledge base file](#write-a-knowledge-base-file). |
| `unchanged` | boolean | True when the file is at this path already. |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the read again. `429 EMAIL_SEND_RATE_LIMITED` has no `Retry-After`. |

Error codes named above: `BUCKET_FILE_PATH_EXISTS`, `BUCKET_LOCKED`, `FILE_LOCKED`, `KB_PATH_REQUIRED`, `KB_PUBLISH_PERMISSION_REQUIRED`, `RESERVED_PATH`, `SYNCED_COPY_READ_ONLY`.

Guide: [Files](/api#files)

## Restore a file version

`POST /v1/buckets/{bucket_id}/files/{file_id}/versions/{version_id}/restore`

Requires bucket write permission, and publish permission for a file in _kb/public/.

Makes an earlier version of a knowledge base file the current one, as a new version. A deleted file comes back with it: use the file ID that the delete returned. When another file took its path meanwhile, the answer is 409 BUCKET_FILE_PATH_EXISTS. The current version returns 422 FILE_VERSION_ALREADY_CURRENT. A path outside _kb/ returns 422 KB_PATH_REQUIRED, SYNCED_COPY_READ_ONLY or RESERVED_PATH. A locked bucket or file returns 423 BUCKET_LOCKED or FILE_LOCKED.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.restoreFileVersion({ bucketId, fileId, versionId })` |
| Python | `client.api.restore_file_version(bucket_id, file_id, version_id)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `bucket_id` / `bucketId` | string | yes |  |
| `file_id` / `fileId` | string | yes |  |
| `version_id` / `versionId` | string | yes | A version ID of the file's version list. |

**Request body** (optional): TypeScript `actionRequest: ActionRequest`, Python `action_request=ActionRequest(...)`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `account_id` / `accountId` | string | no | Select another granted account for this request. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.restoreFileVersion({
  bucketId: 'bkt_example',
  fileId: 'df_example',
  versionId: 'dfrev_example',
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.restore_file_version(
    "bkt_example",
    "df_example",
    "dfrev_example",
)
print(response.data)
```

**cURL**

```sh
curl -X POST "https://api.revdoku.com/v1/buckets/bkt_example/files/df_example/versions/dfrev_example/restore" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `201`

| Field | Type | Description |
| --- | --- | --- |
| `path` | string |  |
| `file` | BucketFile | Fields as in [List files](#list-files). |
| `version` | FileVersion | Fields as in [Write a knowledge base file](#write-a-knowledge-base-file). |
| `restored_from` / `restoredFrom` | FileVersion | Fields as in [Write a knowledge base file](#write-a-knowledge-base-file). |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the read again. `429 EMAIL_SEND_RATE_LIMITED` has no `Retry-After`. |

Error codes named above: `BUCKET_FILE_PATH_EXISTS`, `BUCKET_LOCKED`, `FILE_LOCKED`, `FILE_VERSION_ALREADY_CURRENT`, `KB_PATH_REQUIRED`, `RESERVED_PATH`, `SYNCED_COPY_READ_ONLY`.

Guide: [Files](/api#files)
