# Python examples

These examples use direct HTTP calls with Python 3.10+ and `requests`. For the Python SDK (`pip install revdoku`), see the [Python SDK guide](https://support.revdoku.com/sdks/python).

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install requests
```

Set `REVDOKU_API_KEY` in your secret manager or local environment, then run:

```sh
python python/create-project.py
export REVDOKU_PROJECT_ID=prj_RETURNED_ID
python python/read-tickets.py
python python/download-attachment.py tkt_RETURNED_ID eml_RETURNED_ID eat_RETURNED_ID attachment.pdf
```

Run from `examples/`. Set `REVDOKU_ACCOUNT_ID` to select another granted account.
Omit the name to generate one. To choose a name, pass it as the argument;
`EMAIL_ALREADY_EXISTS` means it is unavailable. If a creation response is lost,
list your projects before deciding whether to create another one.

Creation prints the project ID and its support email address. Reading prints JSON
metadata with ticket and attachment IDs, then `updated_after`; `--show-body` also prints body text.
Save the printed `updated_after` and set `REVDOKU_UPDATED_AFTER` for the next run.
A ticket comes back when it gets a new message, so deduplicate downstream effects by message ID. GET requests leave
shared read status unchanged. Attachment download prints the saved byte count.

Errors include the API's code and message. For 429 request rate limits, respect `Retry-After`; monthly
allowances require waiting until reset or changing the plan. Never retry a write
blindly. Temporary attachment links expire after 15 minutes and take no API key.
Use [the JavaScript/TypeScript examples](../) for a
bounded retry recipe. The [ticket events](../#ticket-events) section of the shared guide covers
`webhook-receiver.py`.
