---
title: "Files API reference"
sidebarTitle: "Files"
description: "A project's files: the articles and private notes of the knowledge base (`_kb/`), which you write, and the read-only copy of the GitHub repository (`_repo/`). Write, move, delete and restore articles, read any file, and scan a website for articles."
---

| Operation | Request |
| --- | --- |
| [List files](#list-files) | `GET /v1/projects/{project_id}/files` |
| [Write a knowledge base file](#write-a-knowledge-base-file) | `POST /v1/projects/{project_id}/files` |
| [Get an upload link for an image](#get-an-upload-link-for-an-image) | `POST /v1/projects/{project_id}/uploads` |
| [Find a file by path](#find-a-file-by-path) | `GET /v1/projects/{project_id}/files/by_path` |
| [Read file metadata](#read-file-metadata) | `GET /v1/projects/{project_id}/files/{file_id}` |
| [Delete a knowledge base file](#delete-a-knowledge-base-file) | `DELETE /v1/projects/{project_id}/files/{file_id}` |
| [Get a download link for a file](#get-a-download-link-for-a-file) | `GET /v1/projects/{project_id}/files/{file_id}/download` |
| [List file versions](#list-file-versions) | `GET /v1/projects/{project_id}/files/{file_id}/versions` |
| [Move or rename a knowledge base file](#move-or-rename-a-knowledge-base-file) | `POST /v1/projects/{project_id}/files/{file_id}/move` |
| [Restore a file version](#restore-a-file-version) | `POST /v1/projects/{project_id}/files/{file_id}/versions/{version_id}/restore` |
| [Get the website scan](#get-the-website-scan) | `GET /v1/projects/{project_id}/website_scan` |
| [Scan a website for articles](#scan-a-website-for-articles) | `POST /v1/projects/{project_id}/website_scan` |
| [Stop the website scan](#stop-the-website-scan) | `DELETE /v1/projects/{project_id}/website_scan` |

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

## Write a knowledge base file

`POST /v1/projects/{project_id}/files`

The knowledge base is the project folder _kb/: _kb/public/ is published with the site, and _kb/private/ is never published. Every other file of a project is read-only: the files of _repo/ change on GitHub. Send one of content (a page), content_base64 (a small image) or signed_blob_id (an uploaded image). A file at the path gets a new version. A file in _kb/public/ needs publish permission; without it the answer is 403 KB_PUBLISH_PERMISSION_REQUIRED. A write never publishes: the site shows a public file after the next publish. Another path returns 422 KB_PATH_REQUIRED, SYNCED_COPY_READ_ONLY or RESERVED_PATH, and another file type 422 KB_FILE_TYPE_UNSUPPORTED. A page of _kb/public/ with the front matter line do_not_publish: true stays off the site, and the site's AI Support Agent still answers visitors from it: put only facts that visitors may know there, never secrets. A file above the account's file size limit returns 413 FILE_TOO_LARGE. A locked project or file returns 423 PROJECT_LOCKED or FILE_LOCKED.

Requires project write permission.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | yes | A path in _kb/public/ or _kb/private/, for example _kb/private/refunds.md. A page ends in .md or .mdx; an image in .jpg, .jpeg, .png or .webp. |
| `content` | string | no | The UTF-8 text of a page. |
| `content_base64` | string | no | An image of at most 256 KB, as Base64. |
| `signed_blob_id` | string | no | signed_blob_id of an upload, after the bytes are sent. |
| `expected_project_version` | string | no | The project_version of the project that you read. A stale value returns 409 PROJECT_VERSION_CONFLICT and changes nothing. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.writeFile({
  projectId: 'prj_example',
  fileWriteRequest: { path: 'notes/todo.txt' },
});
console.log(data);
```

```python Python
from revdoku import Revdoku, FileWriteRequest

client = Revdoku()
response = client.api.write_file(
    "prj_example",
    FileWriteRequest(path="notes/todo.txt"),
)
print(response.data)
```

```sh cURL
curl -X POST "https://api.revdoku.com/v1/projects/prj_example/files" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"path": "notes/todo.txt"}'
```

</CodeGroup>

**Response** `201`, `200`

| Field | Type | Description |
| --- | --- | --- |
| `file` | ProjectFile | Fields as in [List files](#list-files). |
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
| `created` | boolean | False for a new version of a file. |
| `unchanged` | boolean | True when the file had this content already. Then no version is added. |

Guide: [Files](/api#files)

## Get an upload link for an image

`POST /v1/projects/{project_id}/uploads`

For an image of the knowledge base that is larger than 256 KB, or for a client that sends files itself. Send the bytes with PUT to upload.url with upload.headers, then call POST /files with upload.path and upload.signed_blob_id. The link works for one hour. The size limit is the account's file size limit. A path outside _kb/ or another file type returns 422 KB_PATH_REQUIRED or KB_FILE_TYPE_UNSUPPORTED, and a file above the limit 413 FILE_TOO_LARGE.

Requires project write permission.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `path` | string | yes | The path of the image in _kb/public/ or _kb/private/. |
| `size_bytes` | integer | yes | The size of the image in bytes. |
| `checksum` | string | yes | The MD5 of the bytes, as Base64. |
| `sha256` | string | yes | The SHA-256 of the bytes, as hex. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.createFileUpload({
  projectId: 'prj_example',
  fileUploadRequest: {
    path: 'notes/todo.txt',
    sizeBytes: 1,
    checksum: 'example',
    sha256: 'example',
  },
});
console.log(data);
```

```python Python
from revdoku import Revdoku, FileUploadRequest

client = Revdoku()
response = client.api.create_file_upload(
    "prj_example",
    FileUploadRequest(
        path="notes/todo.txt",
        size_bytes=1,
        checksum="example",
        sha256="example",
    ),
)
print(response.data)
```

```sh cURL
curl -X POST "https://api.revdoku.com/v1/projects/prj_example/uploads" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "path": "notes/todo.txt",
  "size_bytes": 1,
  "checksum": "example",
  "sha256": "example"
}'
```

</CodeGroup>

**Response** `201`

| Field | Type | Description |
| --- | --- | --- |
| `upload` | object |  |
| `upload.method` | string `"PUT"` |  |
| `upload.url` | string (uri) |  |
| `upload.headers` | object | Send these headers with the bytes. |
| `upload.path` | string | The path that the image gets: send it to POST /files. |
| `upload.signed_blob_id` | string | Send it to POST /files after the bytes are sent. |

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

## Delete a knowledge base file

`DELETE /v1/projects/{project_id}/files/{file_id}`

Deletes one file of the knowledge base. Its versions stay: keep the file ID of the answer, list the versions with GET /files/{file_id}/versions and restore one to bring the file back. A path outside _kb/ returns 422 KB_PATH_REQUIRED, SYNCED_COPY_READ_ONLY or RESERVED_PATH. A locked project or file returns 423 PROJECT_LOCKED or FILE_LOCKED. Send the query parameter expected_project_version, the project_version of the project that you read: when the project changed since, the answer is 409 PROJECT_VERSION_CONFLICT and nothing changes.

Requires project write permission, and publish permission for a file in _kb/public/.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `file_id` | string | yes |  |
| `expected_project_version` | string | no | The project_version of the project that you read. A stale value returns 409 PROJECT_VERSION_CONFLICT and changes nothing. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.deleteFile({
  projectId: 'prj_example',
  fileId: 'df_example',
});
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.delete_file("prj_example", "df_example")
print(response.data)
```

```sh cURL
curl -X DELETE "https://api.revdoku.com/v1/projects/prj_example/files/df_example" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `deleted` | boolean `true` |  |
| `id` | string | ID of the deleted resource. A webhook delete returns the project ID. |

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
| `version` | FileVersion | Fields as in [Write a knowledge base file](#write-a-knowledge-base-file). |
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
| `versions` | array of FileVersion | Fields as in [Write a knowledge base file](#write-a-knowledge-base-file). |
| `pagination` | Pagination | One page of a list. Request the next page with cursor=next_cursor and the same filters. Cursors are opaque strings: do not build or decode them. Fields as in [List files](#list-files). |

Guide: [Files](/api#files)

## Move or rename a knowledge base file

`POST /v1/projects/{project_id}/files/{file_id}/move`

Moves one file inside the knowledge base to new_path: a new name (a rename), another folder, or from _kb/private/ to _kb/public/ and back. A move to or from _kb/public/ needs publish permission (403 KB_PUBLISH_PERMISSION_REQUIRED). The file keeps its ID and its versions. A file at the new path returns 409 PROJECT_FILE_PATH_EXISTS. The site changes after the next publish. A path outside _kb/ returns 422 KB_PATH_REQUIRED, SYNCED_COPY_READ_ONLY or RESERVED_PATH. A locked project or file returns 423 PROJECT_LOCKED or FILE_LOCKED. Send expected_project_version, the project_version of the project that you read: when the project changed since, the answer is 409 PROJECT_VERSION_CONFLICT and nothing changes.

Requires project write permission.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `file_id` | string | yes |  |

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `new_path` | string | yes | The new path in _kb/public/ or _kb/private/: a new name, another folder, or the other of the two folders. It keeps the file type. |
| `expected_project_version` | string | no | The project_version of the project that you read. A stale value returns 409 PROJECT_VERSION_CONFLICT and changes nothing. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.moveFile({
  projectId: 'prj_example',
  fileId: 'df_example',
  fileMoveRequest: { newPath: 'example' },
});
console.log(data);
```

```python Python
from revdoku import Revdoku, FileMoveRequest

client = Revdoku()
response = client.api.move_file(
    "prj_example",
    "df_example",
    FileMoveRequest(new_path="example"),
)
print(response.data)
```

```sh cURL
curl -X POST "https://api.revdoku.com/v1/projects/prj_example/files/df_example/move" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"new_path": "example"}'
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `old_path` | string |  |
| `file` | ProjectFile | Fields as in [List files](#list-files). |
| `version` | FileVersion | Fields as in [Write a knowledge base file](#write-a-knowledge-base-file). |
| `unchanged` | boolean | True when the file is at this path already. |

Guide: [Files](/api#files)

## Restore a file version

`POST /v1/projects/{project_id}/files/{file_id}/versions/{version_id}/restore`

Makes an earlier version of a knowledge base file the current one, as a new version. A deleted file comes back with it: use the file ID that the delete returned. When another file took its path meanwhile, the answer is 409 PROJECT_FILE_PATH_EXISTS. The current version returns 422 FILE_VERSION_ALREADY_CURRENT. A path outside _kb/ returns 422 KB_PATH_REQUIRED, SYNCED_COPY_READ_ONLY or RESERVED_PATH. A locked project or file returns 423 PROJECT_LOCKED or FILE_LOCKED. Send expected_project_version, the project_version of the project that you read: when the project changed since, the answer is 409 PROJECT_VERSION_CONFLICT and nothing changes.

Requires project write permission, and publish permission for a file in _kb/public/.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `file_id` | string | yes |  |
| `version_id` | string | yes | A version ID of the file's version list. |

**Request body** (optional)

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `expected_project_version` | string | no | The project_version of the project that you read. A stale value returns 409 PROJECT_VERSION_CONFLICT and changes nothing. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.restoreFileVersion({
  projectId: 'prj_example',
  fileId: 'df_example',
  versionId: 'dfrev_example',
});
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.restore_file_version(
    "prj_example",
    "df_example",
    "dfrev_example",
)
print(response.data)
```

```sh cURL
curl -X POST "https://api.revdoku.com/v1/projects/prj_example/files/df_example/versions/dfrev_example/restore" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `201`

| Field | Type | Description |
| --- | --- | --- |
| `file` | ProjectFile | Fields as in [List files](#list-files). |
| `version` | FileVersion | Fields as in [Write a knowledge base file](#write-a-knowledge-base-file). |
| `restored_from` | FileVersion | Fields as in [Write a knowledge base file](#write-a-knowledge-base-file). |

Guide: [Files](/api#files)

## Get the website scan

`GET /v1/projects/{project_id}/website_scan`

Returns the newest website scan of the project, or null when it has none. After startWebsiteScan, get it every few seconds until status is ready or failed, then list the articles in _kb/public/. Requires project read permission. An account without the scan answers 403 WEBSITE_SCAN_UNAVAILABLE.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.getWebsiteScan({ projectId: 'prj_example' });
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_website_scan("prj_example")
print(response.data)
```

```sh cURL
curl "https://api.revdoku.com/v1/projects/prj_example/website_scan" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `website_scan` | WebsiteScan or null |  |

Guide: [Articles from a website](/api#articles-from-a-website)

## Scan a website for articles

`POST /v1/projects/{project_id}/website_scan`

Starts a scan in the background: Revdoku reads the public pages of a website, and an AI writes one public article per page into _kb/public/. A scan never replaces a file, and the articles wait for the next publish. The answer is 202 with status queued: get the scan until status is ready or failed. Never send this request again after an unknown result: get the scan first. Requires publish permission (403 KB_PUBLISH_PERMISSION_REQUIRED). An account scans the website of its owner's work email: the domain of that email and its subdomains. Another website answers 403 WEBSITE_SCAN_DOMAIN_NOT_ALLOWED with details.allowed_domain and details.field urls. An account whose owner has a free email address has no scan: 403 WEBSITE_SCAN_UNAVAILABLE. A scan that runs answers 409 WEBSITE_SCAN_RUNNING with details.website_scan_id and details.status. The daily limit answers 429 WEBSITE_SCAN_LIMIT_REACHED with details.retry_after_seconds. An address that is not a public website answers 422 INVALID_ARGUMENT with details.field urls. Too few credits answer 402 INSUFFICIENT_CREDITS. credits.price is the most that the scan uses. Uses credits; see https://app.revdoku.com/pricing.json.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `urls` | array of string | yes | Pages of one public website, such as acme.com or https://acme.com/pricing. One address: that page and the pages it links. Two or more: exactly those pages. |
| `max_articles` | integer | no | The most articles to write. Default 8. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.startWebsiteScan({
  projectId: 'prj_example',
  websiteScanRequest: { urls: ['example'] },
});
console.log(data);
```

```python Python
from revdoku import Revdoku, WebsiteScanRequest

client = Revdoku()
response = client.api.start_website_scan(
    "prj_example",
    WebsiteScanRequest(urls=["example"]),
)
print(response.data)
```

```sh cURL
curl -X POST "https://api.revdoku.com/v1/projects/prj_example/website_scan" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"urls": ["example"]}'
```

</CodeGroup>

**Response** `202`

| Field | Type | Description |
| --- | --- | --- |
| `website_scan` | WebsiteScan | A scan of a website: Revdoku reads its public pages and an AI writes one article per page into _kb/public/. The articles wait for the next publish. |
| `website_scan.id` | string |  |
| `website_scan.project_id` | string |  |
| `website_scan.status` | string: `queued`, `processing`, `ready`, `failed` | The state of work that runs in the background. queued: it has not started. processing: it runs. ready: it is done. failed: it stopped; error says why. Read the resource again until ready or failed. |
| `website_scan.waiting_for` | string:  or null | Always null. |
| `website_scan.error` | WorkError or null | Why the scan failed, for example WEBSITE_SCAN_REFUSED, WEBSITE_SCAN_NO_PAGES, INSUFFICIENT_CREDITS or WEBSITE_SCAN_CANCELED (a person stopped it). Null unless status is failed. The articles that a failed scan wrote stay. |
| `website_scan.urls` | array of string | The addresses as Revdoku reads them. One address: that page and the pages it links. More: exactly those pages. |
| `website_scan.max_articles` | integer | The most articles that the scan writes. |
| `website_scan.pages` | array of object | The outcome of each page that the scan handled. Never page text. Fields: `url`, `title`, `state`, `path`. |
| `website_scan.articles_count` | integer |  |
| `website_scan.credits_used` | integer |  |
| `website_scan.site_facts_applied` | array of string: `name`, `header`, `footer`, `color` | What a completed scan wrote from the website's home page: the project's name (only while nobody chose one), and the header, the footer and the color of site_settings (only where the project had none). |
| `website_scan.created_at` | string (date-time) |  |
| `website_scan.finished_at` | string (date-time) or null |  |
| `credits` | CreditsUsed | The credits of an action: what this request spent, the account's balance after it and, for a publish or a preview, the price that a new version pays when it goes live. See https://app.revdoku.com/pricing.json. |
| `credits.used` | integer | The credits that this request spent: a sent reply pays at once. 0 for work that pays later: a publish pays when its version goes live, and a draft pays when it is written. |
| `credits.price` | integer or null | The credits of work that pays later: a draft when it is written; a publish or a preview when a new version goes live, for each started 100 pages of the site. For a publish it is the price for the pages of the last build of the site, or of one step (100 pages) when no build is known: the build pays for its own pages. Null for an action that pays nothing later. |
| `credits.left` | integer | The account's balance now. |

Guide: [Articles from a website](/api#articles-from-a-website)

## Stop the website scan

`DELETE /v1/projects/{project_id}/website_scan`

Stops the scan that runs and returns its ID. The articles that it wrote stay, and a later get shows status failed with error.code WEBSITE_SCAN_CANCELED. Without a running scan the answer is 404 WEBSITE_SCAN_NOT_FOUND. Requires publish permission. An account without the scan answers 403 WEBSITE_SCAN_UNAVAILABLE.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.stopWebsiteScan({ projectId: 'prj_example' });
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.stop_website_scan("prj_example")
print(response.data)
```

```sh cURL
curl -X DELETE "https://api.revdoku.com/v1/projects/prj_example/website_scan" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `deleted` | boolean `true` |  |
| `id` | string | ID of the deleted resource. A webhook delete returns the project ID. |

Guide: [Articles from a website](/api#articles-from-a-website)
