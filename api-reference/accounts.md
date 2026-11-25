---
title: "Accounts API reference"
sidebarTitle: "Accounts"
description: "Connection status, granted accounts and limits."
---

Requests go to `https://api.revdoku.com`. Every path starts with `/v1`, for example `https://api.revdoku.com/v1/projects`. Send `Authorization: Bearer $REVDOKU_API_KEY` from your server. Tables use JSON names; where TypeScript differs, a field shows `json_name` / `typescriptName`. Python uses the JSON names.

[All operations](/api-reference) · [API guide](/api) · [Errors](/api#errors) · [OpenAPI](/openapi.json)

- [Read the connection and selected account](#read-the-connection-and-selected-account): `GET /v1/status`
- [List accounts granted to this credential](#list-accounts-granted-to-this-credential): `GET /v1/accounts`
- [Create a client account](#create-a-client-account): `POST /v1/accounts`
- [Read one granted account](#read-one-granted-account): `GET /v1/accounts/{account_id}`
- [Read effective account limits](#read-effective-account-limits): `GET /v1/account/limits`

## Read the connection and selected account

`GET /v1/status`

Works with every API key, including project-scoped keys. The answer is status: the account, the connection, the user and the versions. Read quotas with GET /v1/account/limits.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.getStatus()` |
| Python | `client.api.get_status()` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `account_id` / `accountId` | string | no | Select another granted account for this request. Omit to use the credential default. In JSON bodies, send account_id as a body field instead. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.getStatus();
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_status()
print(response.data)
```

**cURL**

```sh
curl "https://api.revdoku.com/v1/status" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `status` | Status | The connection of this API key and the account that it selected. |
| `status.connected` | boolean |  |
| `status.account` | Account | An account, in one shape in every answer: status.account, status.accounts, the account list and an account read. Fields: see `Account` in [OpenAPI](/openapi.json). |
| `status.default_account_id` / `defaultAccountId` | string or null |  |
| `status.accounts` | array of Account | The accounts that this connection may use. Fields: see `Account` in [OpenAPI](/openapi.json). |
| `status.server_version` / `serverVersion` | string |  |
| `status.client_version` / `clientVersion` | string | Current CLI and skill release. |
| `status.features` | object | Fields: `email_domains`. |
| `status.connection` | Connection | The connection of a credential: the answer of a sign-in (with api_key) and status.connection (api_key is null). One shape in both. Fields: see `Connection` in [OpenAPI](/openapi.json). |
| `status.user` | object | The signed-in person behind this credential. Fields: `id`, `email`, `name`. |
| `status.dashboard_url` / `dashboardUrl` | string (uri) or null | Dashboard link for the account. It grants no access. Null when the server has no public address. |

```json
{
  "success": true,
  "data": {
    "status": {
      "connected": true,
      "default_account_id": "acct_example",
      "accounts": [
        {
          "id": "acct_example",
          "name": "Acme",
          "account_kind": "standard",
          "client_name": null,
          "agency_account": null,
          "region": "us",
          "status": "active",
          "status_reason": null,
          "previous_status": null,
          "status_updated_at": null,
          "restriction": null,
          "support_email": null,
          "billing_message": null,
          "can_create_client_account": false,
          "can_manage_billing": true,
          "permissions": {
            "scope": "project_admin",
            "project_access": "all",
            "can_create_projects": true
          }
        }
      ],
      "server_version": "1.0.575",
      "client_version": "1.0.575",
      "features": {"email_domains": true},
      "account": {
        "id": "acct_example",
        "name": "Acme",
        "account_kind": "standard",
        "client_name": null,
        "agency_account": null,
        "region": "us",
        "status": "active",
        "status_reason": null,
        "previous_status": null,
        "status_updated_at": null,
        "restriction": null,
        "support_email": null,
        "billing_message": null,
        "can_create_client_account": false,
        "can_manage_billing": true,
        "permissions": {
          "scope": "project_admin",
          "project_access": "all",
          "can_create_projects": true
        }
      },
      "user": {
        "id": "user_example",
        "email": "ada@example.com",
        "name": "Ada Lovelace"
      },
      "dashboard_url": "https://app.revdoku.com/projects?account_id=acct_example",
      "connection": {
        "id": "atok_example",
        "api_key": null,
        "label": "Orders backend",
        "token_type": "api",
        "scope": "project_admin",
        "account_id": "acct_example",
        "account_name": "Acme",
        "expires_at": "2027-10-11T12:00:00.000000Z",
        "last_used_at": "2026-10-11T12:20:00.000000Z",
        "project_access": "all",
        "project_ids": [],
        "denied_project_ids": [],
        "project_permissions": {},
        "permissions": {"read": true, "write": true, "admin": true},
        "agent": null,
        "transport": "api_key",
        "renewal": {"recommended": false, "next_action": null, "browser_url": null},
        "manage_access_url": "https://app.revdoku.com/account/access?key=atok_example"
      }
    }
  }
}
```

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Guide: [Accounts](/api#accounts)

## List accounts granted to this credential

`GET /v1/accounts`

Works with every API key. Lists the account of this credential and the client accounts that an agency owner granted to it. Send an id from this list as account_id to act in that account.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.listAccounts()` |
| Python | `client.api.list_accounts()` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `limit` | integer | no |  |
| `cursor` | string | no | pagination.next_cursor from the previous page. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.listAccounts();
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.list_accounts()
print(response.data)
```

**cURL**

```sh
curl "https://api.revdoku.com/v1/accounts" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `accounts` | array of Account |  |
| `accounts[].id` | string |  |
| `accounts[].name` | string | Account name, separate from the client person or business. |
| `accounts[].account_kind` / `accountKind` | string: `standard`, `agency`, `client` |  |
| `accounts[].client_name` / `clientName` | string or null | Client person or business name, or null when unset. |
| `accounts[].agency_account` / `agencyAccount` | object or null | Parent agency only when granted to this credential. Null does not make a client independent. Fields: `id`, `name`. |
| `accounts[].region` | string or null |  |
| `accounts[].status` | string: `active`, `read_only` | The state of the account, which Revdoku or billing sets. It is not background work and has its own values, not those of WorkStatus: active, or read_only (changes are refused with 423 ACCOUNT_READ_ONLY or ACCOUNT_SUSPENDED; reads still work). |
| `accounts[].status_reason` / `statusReason` | string or null | Why the account is read_only, for example suspended or agency_subscription_inactive. Null while active. |
| `accounts[].previous_status` / `previousStatus` | string or null | The status before the last change. Null without a change. |
| `accounts[].status_updated_at` / `statusUpdatedAt` | string (date-time) or null | When the status changed last. |
| `accounts[].restriction` | object or null | What a read_only account cannot do and why: {code, message}, with the policy link and the support address of a suspension. Null without a restriction. |
| `accounts[].support_email` / `supportEmail` | string or null | The address that a suspended account writes to. Else null. |
| `accounts[].billing_message` / `billingMessage` | string or null | How a client account is billed (its agency pays). Null for other accounts. |
| `accounts[].can_create_client_account` / `canCreateClientAccount` | boolean | True when this connection can create a client account here (client_account_create). |
| `accounts[].can_manage_billing` / `canManageBilling` | boolean | True when the person of this connection manages the billing of the account. |
| `accounts[].permissions` | object | What this connection may do in the account. Fields: `scope`, `project_access`, `can_create_projects`. |
| `default_account_id` / `defaultAccountId` | string or null | Account used when a request does not send account_id. |
| `pagination` | Pagination | One page of a list. Request the next page with cursor=next_cursor and the same filters. Cursors are opaque strings: do not build or decode them. |
| `pagination.limit` | integer |  |
| `pagination.has_more` / `hasMore` | boolean | True when another page exists. |
| `pagination.next_cursor` / `nextCursor` | string or null | Cursor for the next page; null on the last page. |

```json
{
  "success": true,
  "data": {
    "default_account_id": "acct_example",
    "accounts": [
      {
        "id": "acct_example",
        "name": "Acme",
        "account_kind": "standard",
        "client_name": null,
        "agency_account": null,
        "region": "us",
        "status": "active",
        "status_reason": null,
        "previous_status": null,
        "status_updated_at": null,
        "restriction": null,
        "support_email": null,
        "billing_message": null,
        "can_create_client_account": false,
        "can_manage_billing": true,
        "permissions": {
          "scope": "project_admin",
          "project_access": "all",
          "can_create_projects": true
        }
      }
    ],
    "pagination": {"limit": 50, "has_more": false, "next_cursor": null}
  }
}
```

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Guide: [Accounts](/api#accounts)

## Create a client account

`POST /v1/accounts`

Requires an agency owner credential with client-account access.

The credential default does not change; send the new account_id on later requests. Never retry it automatically after an unknown result: read the resource first.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.createClientAccount({ createClientAccountRequest })` |
| Python | `client.api.create_client_account(create_client_account_request)` |

**Request body**: TypeScript `createClientAccountRequest: CreateClientAccountRequest`, Python `create_client_account_request=CreateClientAccountRequest(...)`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | yes |  |
| `client_name` / `clientName` | string | no | Optional client person or business name. |
| `account_id` / `accountId` | string | no | Granted agency account that owns the new client account. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.createClientAccount({
  createClientAccountRequest: { name: 'Example client' },
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku, CreateClientAccountRequest

client = Revdoku()
response = client.api.create_client_account(
    CreateClientAccountRequest(name="Example client"),
)
print(response.data)
```

**cURL**

```sh
curl -X POST "https://api.revdoku.com/v1/accounts" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Example client"}'
```

**Response** `201`

| Field | Type | Description |
| --- | --- | --- |
| `account` | Account | An account, in one shape in every answer: status.account, status.accounts, the account list and an account read. Fields as in [List accounts granted to this credential](#list-accounts-granted-to-this-credential). |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Guide: [Client accounts](/api#client-accounts)

## Read one granted account

`GET /v1/accounts/{account_id}`

Works with every API key. Returns the name, kind, region and status of one account that this credential can use, and the permissions of the credential in it. Other account IDs return 403.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.getAccount({ accountId })` |
| Python | `client.api.get_account(account_id)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `account_id` / `accountId` | string | yes | Granted account to read. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.getAccount({ accountId: 'acct_example' });
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_account("acct_example")
print(response.data)
```

**cURL**

```sh
curl "https://api.revdoku.com/v1/accounts/acct_example" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `account` | Account | An account, in one shape in every answer: status.account, status.accounts, the account list and an account read. Fields as in [List accounts granted to this credential](#list-accounts-granted-to-this-credential). |

```json
{
  "success": true,
  "data": {
    "account": {
      "id": "acct_example",
      "name": "Acme",
      "account_kind": "standard",
      "client_name": null,
      "agency_account": null,
      "region": "us",
      "status": "active",
      "status_reason": null,
      "previous_status": null,
      "status_updated_at": null,
      "restriction": null,
      "support_email": null,
      "billing_message": null,
      "can_create_client_account": false,
      "can_manage_billing": true,
      "permissions": {
        "scope": "project_admin",
        "project_access": "all",
        "can_create_projects": true
      }
    }
  }
}
```

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Guide: [Accounts](/api#accounts)

## Read effective account limits

`GET /v1/account/limits`

Answers one resource, limits. Values come from the plan and account overrides. Zero means no allowance; null means no cap. Storage, project and email traffic allowances are shared within a billing group. limits.credit_balance is the balance now, with the plan's monthly pool and its next refill. limits.usage is null for a connection that may not read it.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.getAccountLimits()` |
| Python | `client.api.get_account_limits()` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `account_id` / `accountId` | string | no | Select another granted account for this request. Omit to use the credential default. In JSON bodies, send account_id as a body field instead. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.getAccountLimits();
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_account_limits()
print(response.data)
```

**cURL**

```sh
curl "https://api.revdoku.com/v1/account/limits" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `limits` | AccountLimits |  |
| `limits.account_id` / `accountId` | string | The account of these limits. |
| `limits.max_projects` / `maxProjects` | integer or null |  |
| `limits.max_project_creations_per_month` / `maxProjectCreationsPerMonth` | integer or null |  |
| `limits.max_files_per_project` / `maxFilesPerProject` | integer or null |  |
| `limits.max_current_files` / `maxCurrentFiles` | integer or null |  |
| `limits.max_storage_bytes` / `maxStorageBytes` | integer (int64) or null |  |
| `limits.max_file_size_bytes` / `maxFileSizeBytes` | integer (int64) or null |  |
| `limits.max_file_versions_per_file` / `maxFileVersionsPerFile` | integer or null |  |
| `limits.max_email_domains` / `maxEmailDomains` | integer or null |  |
| `limits.max_received_emails_per_month` / `maxReceivedEmailsPerMonth` | integer or null |  |
| `limits.max_received_email_bytes_per_month` / `maxReceivedEmailBytesPerMonth` | integer (int64) or null |  |
| `limits.max_received_email_message_bytes` / `maxReceivedEmailMessageBytes` | integer (int64) or null |  |
| `limits.max_sent_emails_per_month` / `maxSentEmailsPerMonth` | integer or null | Sent-email recipients per billing period, shared by the billing group. Each recipient counts once. |
| `limits.max_email_address_rotations_per_month` / `maxEmailAddressRotationsPerMonth` | integer or null |  |
| `limits.max_account_members` / `maxAccountMembers` | integer or null |  |
| `limits.max_api_keys` / `maxApiKeys` | integer or null |  |
| `limits.max_agent_connections` / `maxAgentConnections` | integer or null |  |
| `limits.api_rate_limit_requests_per_minute` / `apiRateLimitRequestsPerMinute` | integer or null |  |
| `limits.audit_retention_days` / `auditRetentionDays` | integer or null |  |
| `limits.max_email_aliases_per_project` / `maxEmailAliasesPerProject` | integer | Active retained email addresses (aliases) per project. Zero means that the plan has no aliases. |
| `limits.credit_balance` / `creditBalance` | object | The credits of the account now. It is no credits object: credits names what one action used. Fields: `left`, `monthly`, `next_refill_at`. |
| `limits.usage` | object or null | The usage of the account. Null for a connection that may not read it: a connection to selected projects, or without the scope project_admin. Fields: `project_creations`. |

```json
{
  "success": true,
  "data": {
    "limits": {
      "account_id": "acct_example",
      "max_projects": 3,
      "max_project_creations_per_month": 12,
      "max_files_per_project": 25000,
      "max_current_files": 40000,
      "max_storage_bytes": 2147483648,
      "max_file_size_bytes": 52428800,
      "max_file_versions_per_file": 15,
      "max_email_aliases_per_project": 4,
      "max_email_domains": 3,
      "max_received_emails_per_month": 1500,
      "max_received_email_bytes_per_month": 268435456,
      "max_received_email_message_bytes": 20971520,
      "max_sent_emails_per_month": 750,
      "max_email_address_rotations_per_month": 6,
      "max_account_members": 3,
      "max_api_keys": 4,
      "max_agent_connections": 7,
      "api_rate_limit_requests_per_minute": 240,
      "audit_retention_days": 45,
      "credit_balance": {
        "left": 8840,
        "monthly": 10000,
        "next_refill_at": "2026-12-01T00:00:00.000000Z"
      },
      "usage": {
        "project_creations": {
          "monthly_limit": 12,
          "used": 2,
          "remaining": 10,
          "resets_at": "2026-11-01T00:00:00.000000Z"
        }
      }
    }
  }
}
```

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Guide: [Limits](/api#limits)
