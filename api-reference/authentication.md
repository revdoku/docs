---
title: "Authentication API reference"
sidebarTitle: "Authentication"
description: "Sign-in for command-line tools and AI agents: email a code and exchange it for an API key. A server application uses an API key from the dashboard instead."
---

| Operation | Request |
| --- | --- |
| [Email a sign-in code](#email-a-sign-in-code) | `POST /v1/auth/sign_in_code` |
| [Exchange a sign-in code for an API key](#exchange-a-sign-in-code-for-an-api-key) | `POST /v1/auth/sign_in_code/verify` |
| [Exchange a one-time dashboard connection code for an API key](#exchange-a-one-time-dashboard-connection-code-for-an-api-key) | `POST /v1/auth/grant/exchange` |
| [Create a dashboard link](#create-a-dashboard-link) | `POST /v1/auth/dashboard_link` |

## Email a sign-in code

`POST /v1/auth/sign_in_code`

Sends a six-digit code to an existing account email. The answer is sign_in_code. It is the same for every address, so it never reveals whether an account exists. Create new accounts in the browser at https://app.revdoku.com/users/sign_up.

Needs no API key.

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | string (email) | yes |  |

**Example**

<CodeGroup>

```ts TypeScript
import { DefaultApi } from 'revdoku';

// This operation needs no API key, so it uses the generated API class.
const api = new DefaultApi();
const { data } = await api.requestSignInCode({
  requestSignInCodeRequest: { email: 'you@example.com' },
});
console.log(data);
```

```python Python
from revdoku import DefaultApi, RequestSignInCodeRequest

# This operation needs no API key, so it uses the generated API class.
api = DefaultApi()
response = api.request_sign_in_code(
    RequestSignInCodeRequest(email="you@example.com"),
)
print(response.data)
```

```sh cURL
curl -X POST "https://api.revdoku.com/v1/auth/sign_in_code" \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `sign_in_code` | CodeRequested | What a client tells the person after a code was asked for. It is the same for every address. |
| `sign_in_code.message` | string |  |
| `sign_in_code.email` | string |  |
| `sign_in_code.expires_in_seconds` | integer |  |
| `sign_in_code.fallback_url` | string (uri) |  |
| `sign_in_code.hint` | string |  |

Guide: [Authentication](/api#authentication)

## Exchange a sign-in code for an API key

`POST /v1/auth/sign_in_code/verify`

Creates an AI agent connection for an account owner or administrator. The answer is connection, with the new API key. Accounts with two-factor authentication must use browser sign-in.

Needs no API key.

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | string (email) | yes |  |
| `code` | string | yes | Six digits; spaces are ignored. |
| `label` | string | no | Connection name shown in Account access. |
| `permission_scope` | string: `project_read`, `project_write`, `project_admin` | no |  |
| `project_access` | string: `all`, `selected` | no |  |
| `project_ids` | array of string | no | Required when project_access is selected. |
| `project_permissions` | object | no | Optional access per selected project ID: read or write. Without an entry, a project gets write, or read when permission_scope is project_read. |

**Example**

<CodeGroup>

```ts TypeScript
import { DefaultApi } from 'revdoku';

// This operation needs no API key, so it uses the generated API class.
const api = new DefaultApi();
const { data } = await api.verifySignInCode({
  verifySignInCodeRequest: { email: 'you@example.com', code: '123456' },
});
console.log(data);
```

```python Python
from revdoku import DefaultApi, VerifySignInCodeRequest

# This operation needs no API key, so it uses the generated API class.
api = DefaultApi()
response = api.verify_sign_in_code(
    VerifySignInCodeRequest(email="you@example.com", code="123456"),
)
print(response.data)
```

```sh cURL
curl -X POST "https://api.revdoku.com/v1/auth/sign_in_code/verify" \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com", "code": "123456"}'
```

</CodeGroup>

**Response** `201`

| Field | Type | Description |
| --- | --- | --- |
| `connection` | Connection | The connection of a credential: the answer of a sign-in (with api_key) and status.connection (api_key is null). One shape in both. |
| `connection.id` | string or null | The ID of the credential (atok_...). |
| `connection.api_key` | string or null | The secret API key. It has its value only in the answer that makes the key (a sign-in). Store it securely: no later answer shows it again. Null in status.connection. |
| `connection.label` | string or null |  |
| `connection.token_type` | string: `api` or null |  |
| `connection.scope` | string: `project_read`, `project_write`, `project_admin` or null |  |
| `connection.account_id` | string or null | The account that the connection belongs to. |
| `connection.account_name` | string or null |  |
| `connection.expires_at` | string (date-time) or null |  |
| `connection.last_used_at` | string (date-time) or null |  |
| `connection.project_access` | string: `all`, `selected` or null |  |
| `connection.project_ids` | array of string |  |
| `connection.denied_project_ids` | array of string |  |
| `connection.project_permissions` | object |  |
| `connection.permissions` | object | Fields: `read`, `write`, `admin`. |
| `connection.agent` | object or null |  |
| `connection.transport` | string or null |  |
| `connection.renewal` | object | Whether the connection should be renewed soon. next_action and browser_url are null while recommended is false. Fields: `recommended`, `next_action`, `browser_url`. |
| `connection.manage_access_url` | string (uri) or null | The dashboard page where a person reviews or removes this connection. It grants no access. |

Guide: [Authentication](/api#authentication)

## Exchange a one-time dashboard connection code for an API key

`POST /v1/auth/grant/exchange`

The dashboard creates the one-time code when a signed-in administrator copies a connection prompt. The answer is connection, with the new API key. Never retry it: a code works once.

Needs no API key.

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `grant_token` | string | yes |  |
| `label` | string | no |  |

**Example**

<CodeGroup>

```ts TypeScript
import { DefaultApi } from 'revdoku';

// This operation needs no API key, so it uses the generated API class.
const api = new DefaultApi();
const { data } = await api.exchangeConnectionGrant({
  exchangeConnectionGrantRequest: { grantToken: 'ONE_TIME_CODE' },
});
console.log(data);
```

```python Python
from revdoku import DefaultApi, ExchangeConnectionGrantRequest

# This operation needs no API key, so it uses the generated API class.
api = DefaultApi()
response = api.exchange_connection_grant(
    ExchangeConnectionGrantRequest(grant_token="ONE_TIME_CODE"),
)
print(response.data)
```

```sh cURL
curl -X POST "https://api.revdoku.com/v1/auth/grant/exchange" \
  -H "Content-Type: application/json" \
  -d '{"grant_token": "ONE_TIME_CODE"}'
```

</CodeGroup>

**Response** `201`

| Field | Type | Description |
| --- | --- | --- |
| `connection` | Connection | The connection of a credential: the answer of a sign-in (with api_key) and status.connection (api_key is null). One shape in both. Fields as in [Exchange a sign-in code for an API key](#exchange-a-sign-in-code-for-an-api-key). |

Guide: [Authentication](/api#authentication)

## Create a dashboard link

`POST /v1/auth/dashboard_link`

Returns a dashboard URL for a path such as /projects. The answer is dashboard_link. The user signs in normally; the link grants no access.

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `redirect_path` | string | no |  |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.createDashboardLink({
  createDashboardLinkRequest: { redirectPath: '/projects' },
});
console.log(data);
```

```python Python
from revdoku import Revdoku, CreateDashboardLinkRequest

client = Revdoku()
response = client.api.create_dashboard_link(
    CreateDashboardLinkRequest(redirect_path="/projects"),
)
print(response.data)
```

```sh cURL
curl -X POST "https://api.revdoku.com/v1/auth/dashboard_link" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"redirect_path": "/projects"}'
```

</CodeGroup>

**Response** `201`

| Field | Type | Description |
| --- | --- | --- |
| `dashboard_link` | BrowserLink |  |
| `dashboard_link.url` | string (uri) | Dashboard link. The user signs in normally; the link grants nothing. |
| `dashboard_link.path` | string |  |
| `dashboard_link.single_use` | boolean |  |
| `dashboard_link.requires_login` | boolean |  |
| `dashboard_link.redirect_path` | string |  |

Guide: [Authentication](/api#authentication)
