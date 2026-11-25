---
title: Authentication
description: Use an API key from the dashboard, or let a command-line tool or AI agent sign in to an existing account.
---

A server application uses an API key from the dashboard: **Connect** → **Connect via API** → **Copy API key**. Send it in every request as `Authorization: Bearer YOUR_API_KEY`. See [Authentication](/api#authentication) in the API guide for the scopes.

A command-line tool or a local AI agent can sign in to an existing account instead, and get its own API key. The person approves each sign-in in the browser or with a code from an email. To create an account, use the [sign-up page](https://app.revdoku.com/users/sign_up): the API creates no accounts.

| Flow | Use it for | Endpoints |
| --- | --- | --- |
| OAuth device flow | Local tools and agents. The person approves in the browser. | `https://app.revdoku.com/oauth/device_authorization`, `/oauth/token` |
| Email code | Tools without a browser. | `POST /v1/auth/sign_in_code`, `POST /v1/auth/sign_in_code/verify` |
| Connection code | A one-time code that the dashboard gives to an AI app. | `POST /v1/auth/grant/exchange` |

Never ask a person to paste a password, a two-factor code or an API key into an AI chat.

## OAuth device flow

1. Register the client once, then start the flow:

```http
POST https://app.revdoku.com/oauth/register
Content-Type: application/json

{"client_name": "Acme CLI", "redirect_uris": [], "grant_types": ["urn:ietf:params:oauth:grant-type:device_code", "refresh_token"], "response_types": [], "token_endpoint_auth_method": "none"}

POST https://app.revdoku.com/oauth/device_authorization
Content-Type: application/json

{"client_id": "mcp_client_...", "scope": "revdoku:mcp", "resource": "https://mcp.revdoku.com"}
```

2. Open `verification_uri_complete` in the browser, and show `user_code` to the person as the **Connection ID**.
3. The person checks that the browser shows the same Connection ID, chooses the projects and the permission, and selects **Connect**.
4. Poll `POST /oauth/token` every `interval` seconds. `authorization_pending` means wait, `slow_down` means poll less often, and `access_denied` or `expired_token` means start again.
5. The token answer has `revdoku_api_key`, an API key for the REST API. Store it privately.

## Email code

1. `POST /v1/auth/sign_in_code` with `{"email": "person@example.com"}`. The answer is the same whether or not the account exists, and has `fallback_url`, a browser sign-in link.
2. The person reads the six-digit code in their email and gives it to your tool privately.
3. `POST /v1/auth/sign_in_code/verify` with the email, the code, a `label` and the permission:

```json
{"email": "person@example.com", "code": "123456", "label": "Acme CLI on laptop", "permission_scope": "project_admin", "project_access": "all"}
```

The answer has `data.connection.api_key`. Only this answer shows the key. A wrong code, or an account that needs two-factor sign-in, answers `INVALID_CODE` with `details.fallback_url`: send the person to the browser, and do not try codes again and again.

To limit the key to some projects, send `"project_access": "selected"`, `"project_ids": ["prj_..."]` and `"project_permissions": {"prj_...": "write"}`.

## Permissions

| `permission_scope` | Access |
| --- | --- |
| `project_read` | Read projects, files, tickets and messages. |
| `project_write` | Also reply to tickets and change them. |
| `project_admin` | Also change projects, write public articles and publish sites. |

The person can narrow or remove each connection in **Account Settings** → **Access**.

## Dashboard links

`POST /v1/auth/dashboard_link` with `{"redirect_path": "/projects"}` gives a link to a page of the dashboard, such as `/account/access`. The link grants nothing: the person signs in as usual.

## Name your tool in the activity log

Optional headers show your tool in the activity log of the account:

```http
User-Agent: AcmeCLI/1.0
X-Revdoku-Agent: acme-cli
X-Revdoku-Agent-Version: 1.0.0
```
