---
title: "Events API reference"
sidebarTitle: "Events"
description: "Get an event when a ticket opens or a new message arrives: one signed webhook per project, or a live WebSocket subscription."
---

| Operation | Request |
| --- | --- |
| [Read the webhook](#read-the-webhook) | `GET /v1/projects/{project_id}/webhook` |
| [Set the webhook](#set-the-webhook) | `PUT /v1/projects/{project_id}/webhook` |
| [Remove the webhook](#remove-the-webhook) | `DELETE /v1/projects/{project_id}/webhook` |
| [Get a live event subscription ticket](#get-a-live-event-subscription-ticket) | `GET /v1/projects/{project_id}/events/subscription` |

## Read the webhook

`GET /v1/projects/{project_id}/webhook`

webhook is null when no webhook is set. The signing secret is never returned here: signing_secret is null.

Requires project-admin permission.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.getWebhook({ projectId: 'prj_example' });
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_webhook("prj_example")
print(response.data)
```

```sh cURL
curl "https://api.revdoku.com/v1/projects/prj_example/webhook" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `webhook` | Webhook or null |  |

Guide: [Webhooks and live subscriptions](/api#webhooks-and-live-subscriptions)

## Set the webhook

`PUT /v1/projects/{project_id}/webhook`

The webhook receives the project's ticket events (TicketEvent): ticket.created, ticket.message_received and ticket.status_changed, for every channel. A new URL or rotate_secret=true creates a new signing secret, returns it once and cancels pending deliveries. The same URL without rotate_secret returns the webhook with signing_secret null.

Requires project-admin permission and a public HTTPS URL.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |

**Request body**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `url` | string (uri) | yes | The HTTPS URL of a running receiver. |
| `rotate_secret` | boolean | no |  |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.setWebhook({
  projectId: 'prj_example',
  setWebhookRequest: { url: 'https://example.com/revdoku/webhook' },
});
console.log(data);
```

```python Python
from revdoku import Revdoku, SetWebhookRequest

client = Revdoku()
response = client.api.set_webhook(
    "prj_example",
    SetWebhookRequest(url="https://example.com/revdoku/webhook"),
)
print(response.data)
```

```sh cURL
curl -X PUT "https://api.revdoku.com/v1/projects/prj_example/webhook" \
  -H "Authorization: Bearer $REVDOKU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/revdoku/webhook"}'
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `webhook` | Webhook | The webhook of a project. signing_secret is shown once, when it is issued; a read answers null. |
| `webhook.url` | string (uri) |  |
| `webhook.events` | array of string: `ticket.created`, `ticket.message_received`, `ticket.status_changed` | The event types that the webhook receives. |
| `webhook.signing_secret` | string or null | The secret that signs each delivery. Returned once, by the request that issues it: a new URL or rotate_secret=true. Store it to verify signatures. Null in every other answer. |

Guide: [Webhooks and live subscriptions](/api#webhooks-and-live-subscriptions)

## Remove the webhook

`DELETE /v1/projects/{project_id}/webhook`

Cancels queued deliveries. A delivery already in progress can finish. Returns the project ID. Without a webhook the answer is 404 NOT_FOUND.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.deleteWebhook({ projectId: 'prj_example' });
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.delete_webhook("prj_example")
print(response.data)
```

```sh cURL
curl -X DELETE "https://api.revdoku.com/v1/projects/prj_example/webhook" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `deleted` | boolean `true` |  |
| `id` | string | ID of the deleted resource. A webhook delete returns the project ID. |

Guide: [Webhooks and live subscriptions](/api#webhooks-and-live-subscriptions)

## Get a live event subscription ticket

`GET /v1/projects/{project_id}/events/subscription`

Connect to websocket_url with subscription_token=TOKEN within 60 seconds, then subscribe to ProjectEventsChannel with account_id and project_id. Each event is a TicketEvent. Catch up with GET /v1/projects/{project_id}/tickets and updated_after after every connect.

Requires project read permission.

**Parameters**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `project_id` | string | yes |  |

**Example**

<CodeGroup>

```ts TypeScript
import { Revdoku } from 'revdoku';

const client = new Revdoku();
const { data } = await client.api.getEventSubscription({
  projectId: 'prj_example',
});
console.log(data);
```

```python Python
from revdoku import Revdoku

client = Revdoku()
response = client.api.get_event_subscription("prj_example")
print(response.data)
```

```sh cURL
curl "https://api.revdoku.com/v1/projects/prj_example/events/subscription" \
  -H "Authorization: Bearer $REVDOKU_API_KEY"
```

</CodeGroup>

**Response** `200`

| Field | Type | Description |
| --- | --- | --- |
| `subscription` | EventSubscription |  |
| `subscription.token` | string |  |
| `subscription.expires_in_seconds` | integer `60` | Seconds until the token expires. |
| `subscription.channel` | string `"ProjectEventsChannel"` |  |
| `subscription.account_id` | string |  |
| `subscription.project_id` | string |  |
| `subscription.websocket_url` | string (uri) | Base WebSocket endpoint. Append subscription_token as a query parameter. |

Guide: [Webhooks and live subscriptions](/api#webhooks-and-live-subscriptions)
