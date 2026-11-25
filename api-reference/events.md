---
title: "Events API reference"
sidebarTitle: "Events"
description: "Ticket events of every channel: one signed webhook per project and live WebSocket subscriptions."
---

Requests go to `https://api.revdoku.com`. Every path starts with `/v1`, for example `https://api.revdoku.com/v1/projects`. Send `Authorization: Bearer $REVDOKU_API_KEY` from your server. Tables use JSON names; where TypeScript differs, a field shows `json_name` / `typescriptName`. Python uses the JSON names.

[All operations](/api-reference) · [API guide](/api) · [Errors](/api#errors) · [OpenAPI](/openapi.json)

- [Read the webhook](#read-the-webhook): `GET /v1/projects/{project_id}/webhook`
- [Set the webhook](#set-the-webhook): `PUT /v1/projects/{project_id}/webhook`
- [Remove the webhook](#remove-the-webhook): `DELETE /v1/projects/{project_id}/webhook`
- [Get a live event subscription ticket](#get-a-live-event-subscription-ticket): `GET /v1/projects/{project_id}/events/subscription`

## Read the webhook

`GET /v1/projects/{project_id}/webhook`

Requires project-admin permission.

webhook is null when no webhook is set. The signing secret is never returned here: signing_secret is null.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.getWebhook({ projectId })` |
| Python | `client.api.get_webhook(project_id)` |

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
const { data } = await client.api.getWebhook({ projectId: 'prj_example' });
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_webhook("prj_example")
print(response.data)
```

**cURL**

```sh
curl "https://api.revdoku.com/v1/projects/prj_example/webhook" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `webhook` | Webhook or null |  |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Guide: [Webhooks and live subscriptions](/api#webhooks-and-live-subscriptions)

## Set the webhook

`PUT /v1/projects/{project_id}/webhook`

Requires project-admin permission and a public HTTPS URL.

The webhook receives the project's ticket events (TicketEvent): ticket.created and ticket.message_received, for every channel. A new URL or rotate_secret=true creates a new signing secret, returns it once and cancels pending deliveries. The same URL without rotate_secret returns the webhook with signing_secret null.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.setWebhook({ projectId, setWebhookRequest })` |
| Python | `client.api.set_webhook(project_id, set_webhook_request)` |

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` / `projectId` | string | yes |  |

**Request body**: TypeScript `setWebhookRequest: SetWebhookRequest`, Python `set_webhook_request=SetWebhookRequest(...)`.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string (uri) | yes | The HTTPS URL of a running receiver. |
| `rotate_secret` / `rotateSecret` | boolean | no |  |
| `account_id` / `accountId` | string | no | Select another granted account for this request. |
| `reason` | string or null | no | Optional purpose for this action. AI agents should explain intentional reads and changes when known; omit when unknown. Do not include secrets, file contents, or transcripts. |

**Examples**

**TypeScript**

```ts
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.setWebhook({
  projectId: 'prj_example',
  setWebhookRequest: { url: 'https://example.com/revdoku/webhook' },
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku, SetWebhookRequest

client = Revdoku()
response = client.api.set_webhook(
    "prj_example",
    SetWebhookRequest(url="https://example.com/revdoku/webhook"),
)
print(response.data)
```

**cURL**

```sh
curl -X PUT "https://api.revdoku.com/v1/projects/prj_example/webhook" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/revdoku/webhook"}'
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `webhook` | Webhook | The webhook of a project. signing_secret is shown once, when it is issued; a read answers null. |
| `webhook.url` | string (uri) |  |
| `webhook.events` | array of string: `ticket.created`, `ticket.message_received` | The event types that the webhook receives. |
| `webhook.signing_secret` / `signingSecret` | string or null | The secret that signs each delivery. Returned once, by the request that issues it: a new URL or rotate_secret=true. Store it to verify signatures. Null in every other answer. |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Guide: [Webhooks and live subscriptions](/api#webhooks-and-live-subscriptions)

## Remove the webhook

`DELETE /v1/projects/{project_id}/webhook`

Cancels queued deliveries. A delivery already in progress can finish. Returns the project ID. Without a webhook the answer is 404 NOT_FOUND.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.deleteWebhook({ projectId })` |
| Python | `client.api.delete_webhook(project_id)` |

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
const { data } = await client.api.deleteWebhook({ projectId: 'prj_example' });
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.delete_webhook("prj_example")
print(response.data)
```

**cURL**

```sh
curl -X DELETE "https://api.revdoku.com/v1/projects/prj_example/webhook" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
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

Error codes named above: `NOT_FOUND`.

Guide: [Webhooks and live subscriptions](/api#webhooks-and-live-subscriptions)

## Get a live event subscription ticket

`GET /v1/projects/{project_id}/events/subscription`

Requires project read permission.

Connect to websocket_url with subscription_token=TOKEN within 60 seconds, then subscribe to ProjectEventsChannel with account_id and project_id. Each event is a TicketEvent. Catch up with GET /v1/projects/{project_id}/tickets and updated_after after every connect.

| Language | Call |
| --- | --- |
| TypeScript | `client.api.getEventSubscription({ projectId })` |
| Python | `client.api.get_event_subscription(project_id)` |

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
const { data } = await client.api.getEventSubscription({
  projectId: 'prj_example',
});
console.log(data);
```

**Python**

```python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_event_subscription("prj_example")
print(response.data)
```

**cURL**

```sh
curl "https://api.revdoku.com/v1/projects/prj_example/events/subscription" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `subscription` | EventSubscription |  |
| `subscription.token` | string |  |
| `subscription.expires_in_seconds` / `expiresInSeconds` | integer `60` | Seconds until the token expires. |
| `subscription.channel` | string `"ProjectEventsChannel"` |  |
| `subscription.account_id` / `accountId` | string |  |
| `subscription.project_id` / `projectId` | string |  |
| `subscription.websocket_url` / `websocketUrl` | string (uri) | Base WebSocket endpoint. Append subscription_token as a query parameter. |

**Errors**

| Status | Description |
| --- | --- |
| 4xx, 5xx | Request failed: branch on `error.code`. A `429` or `503` with `Retry-After`: wait that many seconds, then try the request again. |

Guide: [Webhooks and live subscriptions](/api#webhooks-and-live-subscriptions)
