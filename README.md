# Revdoku documentation

The source of [docs.revdoku.com](https://docs.revdoku.com): guides, the API reference and the SDK, MCP and CLI guides of [Revdoku](https://revdoku.com).
Revdoku publishes this repository as a docs site. Each push to `main` publishes the site again, and each other branch gets a 24-hour preview.

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
3. Push a branch. The **Revdoku preview** status of the commit links its preview.
4. Open a pull request. After the merge, the **Revdoku** status of the commit shows the publish.

Pages can use the Mintlify components `Note`, `Tip`, `Warning`, `Card`, `CardGroup`, `CodeGroup`, `Steps`, `Tabs` and `Accordion`.
In an `.mdx` file, braces outside code are expressions: write pages with literal braces, such as `{bucket_id}`, as `.md` files.

For questions, email [support@revdoku.com](mailto:support@revdoku.com).
