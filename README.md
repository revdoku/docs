# Revdoku documentation

The source of [docs.revdoku.com](https://docs.revdoku.com): guides, the API reference and the SDK, MCP and CLI guides of [Revdoku](https://revdoku.com).
Revdoku publishes this repository as a docs site. Each push to `main` publishes the site again.
A push to any other branch builds a preview of that branch, which lasts 24 hours. The commit gets a "Revdoku preview" status with the preview link, which a pull request shows with its checks.

## Layout

| Path | Contents |
| --- | --- |
| `docs.json` | Navigation, header, footer and page menu, in the Mintlify `docs.json` format. |
| `index.mdx`, `*.md`, `guides/`, `sdks/` | Pages. Each page starts with front matter: `title`, `description` and an optional `sidebarTitle`. |
| `api-reference/` | One page for each resource of the API. Generated from the OpenAPI document: do not edit by hand. |
| `openapi.json` | The OpenAPI document of the Revdoku API. The API console and the reference read it. Do not edit by hand. |

## Edit a page

1. Edit the Markdown. Link other pages with site paths, such as `/api#errors` or `/api-reference/files#upload-a-file`.
2. Add a new page to `navigation` in `docs.json`.
3. Push a branch, then open its preview from the "Revdoku preview" status of the commit or from Site → Previews in the Revdoku dashboard. The next push to the branch builds the preview again.
4. Open a pull request. After the merge, the site publishes again.

Pages can use the Mintlify components `Note`, `Tip`, `Warning`, `Card`, `CardGroup`, `CodeGroup`, `Steps`, `Tabs` and `Accordion`.
In an `.mdx` file, braces outside code are expressions: write pages with literal braces, such as `{bucket_id}`, as `.md` files.

For questions, email [support@revdoku.com](mailto:support@revdoku.com).

## Examples

`examples/` holds runnable JavaScript, TypeScript and Python examples that call the Revdoku API directly, without an SDK.
The examples live only in this repository. Start with [examples/README.md](examples/README.md).

Run the checks after each change to an example:

```sh
cd examples
npm ci
npm run build
npm run check
python3 test/python_examples_test.py
pip install flask requests
python3 test/python_receiver_test.py
```

Edit the TypeScript files. `npm run build` writes the matching JavaScript, and `npm run check` fails when the two differ.
Do not commit `.env` or `node_modules`.
