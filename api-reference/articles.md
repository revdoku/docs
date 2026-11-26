---
title: "Articles API reference"
sidebarTitle: "Articles"
description: "The knowledge base of a project: the articles of the Help Center, which the site publishes, and the private notes, which only your team and the AI reply drafter read. Write, move, delete and restore them, add images, and scan a website for articles."
---

| Operation | Request |
| --- | --- |
| [List articles](#list-articles) | `GET /v1/projects/{project_id}/articles` |
| [Create an article](#create-an-article) | `POST /v1/projects/{project_id}/articles` |
| [List the images](#list-the-images) | `GET /v1/projects/{project_id}/articles/images` |
| [Add an image](#add-an-image) | `POST /v1/projects/{project_id}/articles/images` |
| [Get an image upload link](#get-an-image-upload-link) | `POST /v1/projects/{project_id}/articles/images/uploads` |
| [Get an article](#get-an-article) | `GET /v1/projects/{project_id}/articles/{article_id}` |
| [Update an article](#update-an-article) | `PATCH /v1/projects/{project_id}/articles/{article_id}` |
| [Delete an article](#delete-an-article) | `DELETE /v1/projects/{project_id}/articles/{article_id}` |
| [List article versions](#list-article-versions) | `GET /v1/projects/{project_id}/articles/{article_id}/versions` |
| [Restore an article version](#restore-an-article-version) | `POST /v1/projects/{project_id}/articles/{article_id}/restore` |
| [Get the website scan](#get-the-website-scan) | `GET /v1/projects/{project_id}/website_scan` |
| [Scan a website for articles](#scan-a-website-for-articles) | `POST /v1/projects/{project_id}/website_scan` |
| [Stop the website scan](#stop-the-website-scan) | `DELETE /v1/projects/{project_id}/website_scan` |

## List articles

`GET /v1/projects/{project_id}/articles`

Lists the articles of the knowledge base, the newest change first: the public articles of the Help Center (_kb/public/) and the private notes (_kb/private/). content is null in a list: read one article for its text.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `visibility` | string: `public`, `private` | no | Only public articles or only private notes. Omit it for both. |
| `limit` | integer | no |  |
| `cursor` | string | no | pagination.next_cursor from the previous page. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.listArticles({ projectId: 'prj_example' });
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.list_articles("prj_example")
print(response.data)
```

```sh cURL
curl "https://api.revdoku.com/v1/projects/prj_example/articles" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `articles` | array of Article |  |
| `articles[].id` | string | The ID of the article. It stays when the slug or the visibility changes. |
| `articles[].path` | string | The file of the article, such as _kb/public/billing/refunds.md. |
| `articles[].visibility` | string: `public`, `private` | public: an article of the Help Center (_kb/public/), published with the site. private: a private note (_kb/private/), never published. |
| `articles[].slug` | string | The path inside its folder without the extension, such as billing/refunds. |
| `articles[].title` | string | The first # heading of the content, else the file name. |
| `articles[].content` | string or null | The Markdown text, without the front matter lines that Revdoku writes itself (source, source_sha256, scanned_at, do_not_publish). Null in a list. |
| `articles[].do_not_publish` | boolean | A public article that stays off the site. The site's AI Support Agent still answers visitors from it: put only facts that visitors may know there, never secrets. Always false for a private note. |
| `articles[].source_url` | string or null | The website page that a website scan wrote the article from, else null. |
| `articles[].url` | string or null | The address of the article on the live site. Null for a private note, a do_not_publish article, a project without a live site, and an article that was added after the last publish. |
| `articles[].size_bytes` | integer or null | The size of the file in bytes. |
| `articles[].version_id` | string or null | The current version. GET /articles/{article_id}/versions lists them all. |
| `articles[].created_at` | string (date-time) |  |
| `articles[].updated_at` | string (date-time) |  |
| `pagination` | Pagination | One page of a list. Request the next page with cursor=next_cursor and the same filters. Cursors are opaque strings: do not build or decode them. |
| `pagination.limit` | integer |  |
| `pagination.has_more` | boolean | True when another page exists. |
| `pagination.next_cursor` | string or null | Cursor for the next page; null on the last page. |

<Accordion title="Example response">

```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "df_example",
        "path": "_kb/public/billing/refunds.md",
        "visibility": "public",
        "slug": "billing/refunds",
        "title": "Refunds",
        "content": null,
        "do_not_publish": false,
        "source_url": null,
        "url": "https://acme.revdoku.net/help/billing/refunds/",
        "size_bytes": 58,
        "version_id": "dfrev_example",
        "created_at": "2026-11-26T12:20:00.000000Z",
        "updated_at": "2026-11-26T12:20:00.000000Z"
      }
    ],
    "pagination": {"limit": 50, "has_more": false, "next_cursor": null}
  }
}
```

</Accordion>

## Create an article

`POST /v1/projects/{project_id}/articles`

Creates one article from Markdown: a public article of the Help Center or a private note. A public article needs publish permission; without it the answer is 403 KB_PUBLISH_PERMISSION_REQUIRED. A write never publishes: the site shows a change of a public article after the next publish. It never replaces an article: a used slug returns 409 PROJECT_FILE_PATH_EXISTS. Do not retry a create automatically: list the articles first. A private note is read by the AI reply drafter of the support tickets; a do_not_publish article stays off the site and the site's AI Support Agent still answers from it.

Requires project write permission.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `visibility` | string: `public`, `private` | yes | public: an article of the Help Center (_kb/public/), published with the site. private: a private note (_kb/private/), never published. |
| `content` | string | yes | The Markdown text. Start it with a # heading: it is the title. Your own front matter (a title, a description) is kept; send do_not_publish as its own field. |
| `slug` | string | no | The path inside the folder without the extension: lowercase letters, digits, hyphens and underscores, with / between folders, such as billing/refunds. Omit it to name the article after its first heading. |
| `do_not_publish` | boolean | no | true keeps a public article off the site. The site's AI Support Agent still answers from it. |
| `expected_project_version` | string | no | The project_version of the project that you read. A stale value returns 409 PROJECT_VERSION_CONFLICT and changes nothing. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.createArticle({
  projectId: 'prj_example',
  articleCreateRequest: { visibility: 'public', content: 'example' },
});
console.log(data);
```

```python Python
from revdoku import Revdoku, ArticleCreateRequest

client = Revdoku()
response = client.api.create_article(
    "prj_example",
    ArticleCreateRequest(visibility="public", content="example"),
)
print(response.data)
```

```sh cURL
curl -X POST "https://api.revdoku.com/v1/projects/prj_example/articles" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"visibility": "public", "content": "example"}'
```

</CodeGroup>

**Response** `201`

| Field | Type | Description |
| --- | --- | --- |
| `article` | Article | One article of the knowledge base: a Markdown page in _kb/public/ (an article of the Help Center) or _kb/private/ (a private note). Fields as in [List articles](#list-articles). |

<Accordion title="Example response">

```json
{
  "success": true,
  "data": {
    "article": {
      "id": "df_example",
      "path": "_kb/public/billing/refunds.md",
      "visibility": "public",
      "slug": "billing/refunds",
      "title": "Refunds",
      "content": "# Refunds\n\nAsk for a refund within 30 days of a payment.\n",
      "do_not_publish": false,
      "source_url": null,
      "url": "https://acme.revdoku.net/help/billing/refunds/",
      "size_bytes": 58,
      "version_id": "dfrev_example",
      "created_at": "2026-11-26T12:20:00.000000Z",
      "updated_at": "2026-11-26T12:20:00.000000Z"
    }
  }
}
```

</Accordion>

## List the images

`GET /v1/projects/{project_id}/articles/images`

Lists the images of the knowledge base, the newest change first. markdown is the link that an article in the folder of the image puts in its text. A public image is published with the site at its own address.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `visibility` | string: `public`, `private` | no | Only the images of the public articles or of the private notes. Omit it for both. |
| `limit` | integer | no |  |
| `cursor` | string | no | pagination.next_cursor from the previous page. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.listArticleImages({
  projectId: 'prj_example',
});
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.list_article_images("prj_example")
print(response.data)
```

```sh cURL
curl "https://api.revdoku.com/v1/projects/prj_example/articles/images" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `images` | array of ArticleImageFile |  |
| `images[].id` | string | The file ID of the image. |
| `images[].path` | string | The file of the image, such as _kb/public/diagram.png. |
| `images[].name` | string |  |
| `images[].content_type` | string or null |  |
| `images[].size_bytes` | integer or null |  |
| `images[].markdown` | string | The image link to put in the article's text, such as ![diagram](../diagram.png): the link from an article in the folder of the image. For an index.md article in that folder, use the name alone. |
| `pagination` | Pagination | One page of a list. Request the next page with cursor=next_cursor and the same filters. Cursors are opaque strings: do not build or decode them. Fields as in [List articles](#list-articles). |

## Add an image

`POST /v1/projects/{project_id}/articles/images`

Adds an image (.jpg, .jpeg, .png or .webp) beside the articles: send content_base64 for an image of at most 256 KB, or signed_blob_id after POST /articles/images/uploads. Then put markdown in the article's text. A new image returns 201; an image with the name returns 200 with its new version.

Requires project write permission, and publish permission for a public image.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | yes | The file name of the image, such as diagram.png: lowercase letters, digits, hyphens and underscores, then .jpg, .jpeg, .png or .webp. An image with this name gets a new version. |
| `article_id` | string | no | The article that shows the image: the image goes into its folder, and markdown is the link from it. Else send visibility. |
| `visibility` | string: `public`, `private` | no | Without article_id: the image goes to the top of the public or private folder. |
| `content_base64` | string | no | An image of at most 256 KB, as Base64. |
| `signed_blob_id` | string | no | signed_blob_id of POST /articles/images/uploads, after the bytes are sent. |
| `expected_project_version` | string | no | The project_version of the project that you read. A stale value returns 409 PROJECT_VERSION_CONFLICT and changes nothing. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.createArticleImage({
  projectId: 'prj_example',
  articleImageRequest: { name: 'Example client' },
});
console.log(data);
```

```python Python
from revdoku import Revdoku, ArticleImageRequest

client = Revdoku()
response = client.api.create_article_image(
    "prj_example",
    ArticleImageRequest(name="Example client"),
)
print(response.data)
```

```sh cURL
curl -X POST "https://api.revdoku.com/v1/projects/prj_example/articles/images" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Example client"}'
```

</CodeGroup>

**Response** `201`, `200`

| Field | Type | Description |
| --- | --- | --- |
| `image` | ArticleImageFile | Fields as in [List the images](#list-the-images). |

## Get an image upload link

`POST /v1/projects/{project_id}/articles/images/uploads`

The link for an image above 256 KB: PUT the bytes to upload.url with upload.headers, then call POST /articles/images with the same name and signed_blob_id. A file above the account's file size limit returns 413 FILE_TOO_LARGE.

Requires project write permission.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | yes | The file name of the image, such as diagram.png: lowercase letters, digits, hyphens and underscores, then .jpg, .jpeg, .png or .webp. An image with this name gets a new version. |
| `article_id` | string | no | The article that shows the image: the image goes into its folder, and markdown is the link from it. Else send visibility. |
| `visibility` | string: `public`, `private` | no | Without article_id: the image goes to the top of the public or private folder. |
| `size_bytes` | integer | yes | The size of the image in bytes. |
| `checksum` | string | yes | The MD5 of the bytes, as Base64. |
| `sha256` | string | yes | The SHA-256 of the bytes, as hex. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.createArticleImageUpload({
  projectId: 'prj_example',
  articleImageUploadRequest: {
    name: 'Example client',
    sizeBytes: 1,
    checksum: 'example',
    sha256: 'example',
  },
});
console.log(data);
```

```python Python
from revdoku import Revdoku, ArticleImageUploadRequest

client = Revdoku()
response = client.api.create_article_image_upload(
    "prj_example",
    ArticleImageUploadRequest(
        name="Example client",
        size_bytes=1,
        checksum="example",
        sha256="example",
    ),
)
print(response.data)
```

```sh cURL
curl -X POST "https://api.revdoku.com/v1/projects/prj_example/articles/images/uploads" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "name": "Example client",
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
| `upload.path` | string | The path that the image gets. |
| `upload.signed_blob_id` | string | Send it to POST /articles/images with the same name after the bytes are sent. |

## Get an article

`GET /v1/projects/{project_id}/articles/{article_id}`

Reads one article with its Markdown text.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `article_id` | string | yes | The ID of the article. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.getArticle({
  projectId: 'prj_example',
  articleId: 'df_example',
});
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_article("prj_example", "df_example")
print(response.data)
```

```sh cURL
curl "https://api.revdoku.com/v1/projects/prj_example/articles/df_example" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `article` | Article | One article of the knowledge base: a Markdown page in _kb/public/ (an article of the Help Center) or _kb/private/ (a private note). Fields as in [List articles](#list-articles). |

<Accordion title="Example response">

```json
{
  "success": true,
  "data": {
    "article": {
      "id": "df_example",
      "path": "_kb/public/billing/refunds.md",
      "visibility": "public",
      "slug": "billing/refunds",
      "title": "Refunds",
      "content": "# Refunds\n\nAsk for a refund within 30 days of a payment.\n",
      "do_not_publish": false,
      "source_url": null,
      "url": "https://acme.revdoku.net/help/billing/refunds/",
      "size_bytes": 58,
      "version_id": "dfrev_example",
      "created_at": "2026-11-26T12:20:00.000000Z",
      "updated_at": "2026-11-26T12:20:00.000000Z"
    }
  }
}
```

</Accordion>

## Update an article

`PATCH /v1/projects/{project_id}/articles/{article_id}`

Changes the text, the slug, the visibility or do_not_publish of one article. It keeps its ID and its versions. A public article needs publish permission; without it the answer is 403 KB_PUBLISH_PERMISSION_REQUIRED. A write never publishes: the site shows a change of a public article after the next publish. A move into or out of the public articles needs publish permission too. One expected_project_version covers the whole change, and nothing changes when a part is refused.

Requires project write permission.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `article_id` | string | yes | The ID of the article. |

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | string | no | The new Markdown text. The front matter lines that Revdoku writes itself stay. |
| `slug` | string | no | A new path inside the folder. The article keeps its ID and its versions. |
| `visibility` | string: `public`, `private` | no | Move the article: public to the Help Center, private to the private notes. Its images stay in their folder. |
| `do_not_publish` | boolean | no | true keeps a public article off the site; false publishes it with the site again. |
| `expected_project_version` | string | no | The project_version of the project that you read. A stale value returns 409 PROJECT_VERSION_CONFLICT and changes nothing. |
| `expected_version_id` | string | no | The version_id of the article that you read. When the article changed since, the answer is 409 ARTICLE_VERSION_CONFLICT and nothing changes. Another change of the project does not make it stale. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.updateArticle({
  projectId: 'prj_example',
  articleId: 'df_example',
  articleUpdateRequest: {},
});
console.log(data);
```

```python Python
from revdoku import Revdoku, ArticleUpdateRequest

client = Revdoku()
response = client.api.update_article(
    "prj_example",
    "df_example",
    ArticleUpdateRequest(),
)
print(response.data)
```

```sh cURL
curl -X PATCH "https://api.revdoku.com/v1/projects/prj_example/articles/df_example" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `article` | Article | One article of the knowledge base: a Markdown page in _kb/public/ (an article of the Help Center) or _kb/private/ (a private note). Fields as in [List articles](#list-articles). |

## Delete an article

`DELETE /v1/projects/{project_id}/articles/{article_id}`

Deletes one article. Its versions stay: keep the article ID, list the versions with GET /articles/{article_id}/versions and restore one to bring it back. Its images stay. Send the query parameter expected_project_version, the project_version of the project that you read: when the project changed since, the answer is 409 PROJECT_VERSION_CONFLICT and nothing changes.

Requires project write permission, and publish permission for a public article.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `article_id` | string | yes | The ID of the article. |
| `expected_project_version` | string | no | The project_version of the project that you read. A stale value returns 409 PROJECT_VERSION_CONFLICT and changes nothing. |
| `expected_version_id` | string | no | The version_id of the article that you read. When the article changed since, the answer is 409 ARTICLE_VERSION_CONFLICT and nothing changes. Another change of the project does not make it stale. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.deleteArticle({
  projectId: 'prj_example',
  articleId: 'df_example',
});
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.delete_article("prj_example", "df_example")
print(response.data)
```

```sh cURL
curl -X DELETE "https://api.revdoku.com/v1/projects/prj_example/articles/df_example" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `deleted` | boolean `true` |  |
| `id` | string | ID of the deleted resource. A webhook delete returns the project ID. |

## List article versions

`GET /v1/projects/{project_id}/articles/{article_id}/versions`

Lists the versions of one article, newest first, also of a deleted article.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `article_id` | string | yes | The ID of the article. |
| `limit` | integer | no |  |
| `cursor` | string | no | pagination.next_cursor from the previous page. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.listArticleVersions({
  projectId: 'prj_example',
  articleId: 'df_example',
});
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.list_article_versions("prj_example", "df_example")
print(response.data)
```

```sh cURL
curl "https://api.revdoku.com/v1/projects/prj_example/articles/df_example/versions" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `versions` | array of FileVersion |  |
| `versions[].id` | string |  |
| `versions[].file_id` | string |  |
| `versions[].name` | string or null |  |
| `versions[].content_type` | string |  |
| `versions[].sha256` | string or null |  |
| `versions[].reason` | string or null |  |
| `versions[].created_by_system` | string or null |  |
| `versions[].deleted` | boolean | True for the version that records a deletion. |
| `versions[].ready` | boolean |  |
| `versions[].has_text` | boolean |  |
| `versions[].version_number` | integer (int64) |  |
| `versions[].size_bytes` | integer (int64) or null |  |
| `versions[].created_at` | string (date-time) |  |
| `versions[].created_by` | FileActor or null |  |
| `versions[].updated_by` | FileActor or null |  |
| `versions[].created_by_agent` | object or null |  |
| `versions[].updated_by_agent` | object or null |  |
| `versions[].created_by_api_key` | object or null |  |
| `versions[].updated_by_api_key` | object or null |  |
| `versions[].read` | boolean |  |
| `versions[].read_at` | string (date-time) or null |  |
| `versions[].read_by` | FileActor or null |  |
| `versions[].read_by_api_key` | FileKey or null |  |
| `pagination` | Pagination | One page of a list. Request the next page with cursor=next_cursor and the same filters. Cursors are opaque strings: do not build or decode them. Fields as in [List articles](#list-articles). |

## Restore an article version

`POST /v1/projects/{project_id}/articles/{article_id}/restore`

Makes an earlier version the current one, as a new version. A deleted article comes back, unless another article took its path: then the answer is 409 PROJECT_FILE_PATH_EXISTS.

Requires project write permission, and publish permission for a public article.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |
| `article_id` | string | yes | The ID of the article. |

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `version_id` | string | yes | A version of GET /articles/{article_id}/versions. |
| `expected_project_version` | string | no | The project_version of the project that you read. A stale value returns 409 PROJECT_VERSION_CONFLICT and changes nothing. |
| `expected_version_id` | string | no | The version_id of the article that you read. When the article changed since, the answer is 409 ARTICLE_VERSION_CONFLICT and nothing changes. Another change of the project does not make it stale. |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.restoreArticleVersion({
  projectId: 'prj_example',
  articleId: 'df_example',
  articleRestoreRequest: { versionId: 'dfrev_example' },
});
console.log(data);
```

```python Python
from revdoku import Revdoku, ArticleRestoreRequest

client = Revdoku()
response = client.api.restore_article_version(
    "prj_example",
    "df_example",
    ArticleRestoreRequest(version_id="dfrev_example"),
)
print(response.data)
```

```sh cURL
curl -X POST "https://api.revdoku.com/v1/projects/prj_example/articles/df_example/restore" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"version_id": "dfrev_example"}'
```

</CodeGroup>

**Response** `201`

| Field | Type | Description |
| --- | --- | --- |
| `article` | Article | One article of the knowledge base: a Markdown page in _kb/public/ (an article of the Help Center) or _kb/private/ (a private note). Fields as in [List articles](#list-articles). |
| `restored_from` | FileVersion | Fields as in [List article versions](#list-article-versions). |

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
