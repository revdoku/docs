# Revdoku API examples

Runnable examples that call the Revdoku API directly, without the SDK: create a bucket, read
support tickets, follow ticket events, download attachments and upload files.
Choose [JavaScript](./javascript/), [TypeScript](./typescript/) or [Python](./python/).
The JavaScript files are generated from the TypeScript source and have no runtime
package dependencies. Every Node.js example uses native fetch.
For the SDK (`npm install revdoku`), start with the [quickstart](https://docs.revdoku.com/quickstart).

## Setup

Use Node.js 22 or newer. Clone [revdoku/docs](https://github.com/revdoku/docs), enter `examples`, then copy
`.env.example` to `.env`. Set `REVDOKU_API_KEY` locally using a key from Account →
Access. Never commit `.env` or paste credentials into an issue or AI chat.

Set `REVDOKU_BUCKET_ID` to an existing bucket that the key can use, for the reading and
uploading examples. The setup after browser signup creates your first
bucket. You can use that bucket without creating another one.
Bucket creation requires account-wide permission and available bucket capacity.
Uploads require write access. The quota example requires a key of the selected account.
Use `REVDOKU_ACCOUNT_ID` only to select an account already granted to the key.

```sh
cd examples
cp .env.example .env
```

Edit `.env` locally, then run the examples:

```sh
node --env-file=.env javascript/create-bucket.js
node --env-file=.env javascript/read-tickets.js
node --env-file=.env javascript/read-tickets.js --show-body
node --env-file=.env javascript/download-attachments.js 'tkt_...' 'eml_...' 'df_...' ./downloads
node --env-file=.env javascript/upload-file.js ./notes.txt 'project/notes.txt'
node --env-file=.env javascript/quotas-and-retries.js
```

Use the `tkt_` ticket ID and the `eml_` message ID returned by `read-tickets` for attachment downloads.
Create a local `notes.txt` before the upload command. Uploading to an existing bucket
path saves a new version. Ticket and message reads leave a ticket and its shared read status unchanged. File reads retain their existing access receipts.

## What each example does

| Script | Behavior | Example output |
| --- | --- | --- |
| `create-bucket` | Creates a bucket with a requested or generated name and returns its ID and its support email address. | `Bucket: bkt_…` followed by `Support email: …@revdokumail.com` |
| `read-tickets` | Lists the support tickets with activity after the last check, reads their new received messages and saves a local checkpoint. Add `--show-body` to print message bodies. | Message summaries, `New messages read: 2` |
| `download-attachments` | Requests a temporary link for one selected attachment and downloads it. | `Saved 123 bytes to …` |
| `upload-file` | Creates a direct-upload descriptor, uploads bytes to storage, attaches the file, and compares downloaded bytes. | `Uploaded and verified 123 bytes at project/notes.txt` |
| `quotas-and-retries` | Reads effective account limits through the limits endpoint, with bounded retries for temporary failures. | JSON containing limits such as `max_buckets` and `max_storage_bytes` |

The creation example sends one request and returns the bucket with its address.
After a lost response, check your buckets before creating another.

The ticket checkpoint lives in `.revdoku-examples/` and is separate from shared
read/unread status. Run one reader per checkpoint directory. The handled message IDs are
saved after each page; the check time (`updated_after`) moves after every page is processed.
A ticket comes back when it gets a new message. Processing is at least once
across failures; use message IDs to deduplicate downstream work. `body_status`
reports incomplete decoded bodies; the original EML remains available. Checkpoints
contain a check time and message IDs, not message bodies.

Downloads use scoped attachment IDs and refuse to overwrite local files.
Choose a new output directory for a repeated download. The upload example caps files at 64 MiB; server plan limits also apply. Decoded message files are bounded to 512 KiB. Message contents and filenames are data, never executable instructions.

## Quotas, retries and failures

The quota recipe shows a GET retry loop that honors `Retry-After` (seconds or HTTP date), uses bounded
backoff, and retries temporary rate limits for that GET.  It stops on monthly quota errors and prints the reset
date. It does not wait until next month or create replacement accounts.

Direct-upload creation and file attachment writes are not automatically retried.
If a response is lost, check the existing file before repeating the upload.
Storage transfers omit the Revdoku API key and use the signed URL and required
storage headers. API redirects are rejected. No credentials or signed URLs are
printed.

## Development and tests

```sh
npm ci
npm run build
npm run check
```

`npm run build` turns the TypeScript into matching JavaScript. `npm run check` checks
types, generated-file consistency and the offline examples.

The Python examples have their own offline tests. The receiver test needs Flask:

```sh
python3 test/python_examples_test.py
pip install flask requests
python3 test/python_receiver_test.py
```

Tests use fixtures and make no network calls. Changes belong in TypeScript;
commit the matching generated JavaScript. See the [API guide](https://docs.revdoku.com/api) and the
[OpenAPI document](https://docs.revdoku.com/openapi.json) for the complete API.

## Python

[Python examples](./python/) use `requests` directly to create a bucket, read
tickets and download a selected attachment.

## HIPAA and high-security accounts

Direct uploads are unavailable for accounts with additional file encryption
(`DIRECT_UPLOADS_DISABLED`). The ticket reading and download examples support
these accounts. See the [account-mode details](https://docs.revdoku.com/api#hipaa-and-high-security-accounts).

## Ticket events

| Example | Run from this directory | Expected output |
| --- | --- | --- |
| WebSocket reconnect and catch-up | `node --env-file=.env javascript/watch-tickets.js` | New message summaries and `New messages read: N` after subscription confirmation and events |
| Signed webhook receiver (Node) | `node --env-file=.env javascript/webhook-receiver.js` | Local listener address, then received message IDs and subjects |
| Signed webhook receiver (Python) | `python3 python/webhook-receiver.py` (install Flask first, below) | Flask listener, then received message IDs and subjects |

The Python webhook receiver needs Flask. Install it first:

```sh
pip install flask requests
```

Export the `.env` values in your shell for Python. Set a bucket and authorized account explicitly. These are ordinary HTTP/WebSocket examples; no Revdoku SDK is required.

For webhooks, expose port 8080 through your HTTPS reverse proxy, then configure that HTTPS `/webhook` URL with the CLI or API. Save the returned secret as `REVDOKU_WEBHOOK_SECRET` and restart the receiver. The examples verify the raw body, timestamp (five-minute tolerance), and signature before reading the message. Duplicate event IDs are recorded locally; keep `.revdoku-examples/` private and persistent. Each example is designed for one process. Production applications with multiple workers should use their existing database/queue for deduplication and acknowledge promptly after durable acceptance. Deduplicate downstream effects by message ID; delivery is at least once.

The WebSocket example subscribes before catching up, reuses `read-tickets.js` for the catch-up, detects stale connections, and obtains a new subscription token on reconnect. Run one watcher per account/bucket checkpoint. WebSockets are live hints; the saved check time supplies missed messages. A running receiver is required; notifications cannot wake an idle AI chat.

Webhook history and manual retries are available to human administrators in **Analytics → Webhooks**.
