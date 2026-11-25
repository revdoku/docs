---
title: Webhooks and events
description: Get an event for each new support ticket and message, as a signed webhook or a live WebSocket subscription.
---

Revdoku sends an event when a support ticket opens or a new message arrives. Use a webhook when your application has a public HTTPS address, and a live subscription when it does not, such as a script on your computer.

| Event | When |
| --- | --- |
| `ticket.created` | The first message of a new ticket. |
| `ticket.message_received` | A new message on an existing ticket. |

An event carries IDs only, never the subject, the sender or the text. Read the message with the [ticket operations](/api-reference/tickets).

```json
{
  "id": "ticket.created:eml_example",
  "type": "ticket.created",
  "created_at": "2026-10-01T12:00:00.000000Z",
  "data": {
    "account_id": "acct_example",
    "project_id": "prj_example",
    "ticket_id": "tkt_example",
    "message_id": "eml_example",
    "channel": "chat",
    "received_at": "2026-10-01T11:59:58.000000Z",
    "attachment_count": 0
  }
}
```

While the AI junk filter checks a message, its event waits, for at most a minute. A message with the `Junk` label sends no event.

## Webhook

1. Build an HTTPS endpoint that accepts `POST`.
2. Set it: `PUT /v1/projects/{project_id}/webhook` with `{"url": "https://example.com/revdoku"}`. Save `data.webhook.signing_secret` privately: only this answer shows it.
3. For each request, check the signature, save the event ID, and answer with any `2xx` status. Then read the message.

| Header | Value |
| --- | --- |
| `X-Revdoku-Event-Id` | The event ID. It stays the same when Revdoku tries again. |
| `X-Revdoku-Timestamp` | Unix seconds of this attempt. |
| `X-Revdoku-Signature` | `v1=` and the lowercase hex HMAC-SHA256 of `timestamp + "." + body`, with your signing secret. |

Refuse a timestamp older than five minutes, and compare signatures in constant time:

<CodeGroup>

```ts TypeScript
import { createHmac, timingSafeEqual } from 'node:crypto';

export function verify(body: string, timestamp: string, signature: string, secret: string): boolean {
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
  const provided = signature.replace(/^v1=/, '');
  return provided.length === expected.length && timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}
```

```python Python
import hashlib
import hmac
import time


def verify(body: bytes, timestamp: str, signature: str, secret: str) -> bool:
    if not timestamp.isdigit() or abs(time.time() - int(timestamp)) > 300:
        return False
    expected = hmac.new(secret.encode(), f"{timestamp}.".encode() + body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature.removeprefix("v1="))
```

</CodeGroup>

- Use the raw request body, before you parse the JSON.
- Revdoku tries up to 8 times after a network error, `408`, `429` or `5xx`. Another status stops delivery. An attempt has 15 seconds.
- Events can repeat or arrive out of order. Skip event IDs that you already saved.
- `PUT` with a new URL, or with `"rotate_secret": true`, makes a new secret. `DELETE …/webhook` turns the webhook off.
- A project has one webhook. **Analytics** → **Webhooks** in the dashboard shows each attempt.

## Live subscription

1. Get a token: `GET /v1/projects/{project_id}/events/subscription`. It works for 60 seconds.
2. Open `data.subscription.websocket_url` with `subscription_token=TOKEN` added, and the subprotocol `actioncable-v1-json`.
3. Subscribe to the channel `ProjectEventsChannel` with the `account_id` and `project_id` of the answer, and wait for `confirm_subscription`.
4. Catch up: list tickets with `updated_after` set to your last check, and read their new messages.
5. Handle each live event. After a disconnect, get a new token, connect again and catch up again.

## Examples

The [examples folder](https://github.com/revdoku/docs/tree/main/examples) has a webhook receiver and a live subscription client in JavaScript, TypeScript and Python, with signature checks and reconnects.
