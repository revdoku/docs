---
title: Website widget
description: Add Ask and the contact form to your own website with one line of code.
---

The widget shows your portal's Ask panel on your own website. Visitors search your docs, ask the AI Support Agent and contact your team without leaving your website.

## Add the widget

1. Open **Settings** → **Widget**.
2. Under **Websites that show the widget**, enter each website, one per line. Select **Save**.
3. Under **Show on your website as**, choose **Button at the right**, **Button at the left** or **Bar at the bottom**.
4. Copy the code under **Add this code to your website**, and paste it into the HTML of every page that shows the widget, before `</body>`.
5. Select **Republish** at the top of the page. The widget works when the site is published.

The code looks like this:

```html
<script src="https://files.revdoku.net/_revdoku/published-site/widget-v1.min.js" data-site="https://acme.revdoku.net" async></script>
```

## Websites

The widget opens only on the websites that you list, at most 10.

| Entry | Matches |
| --- | --- |
| `acme.com` | That host only. |
| `*.acme.com` | `acme.com` and all its subdomains. |
| `localhost` | Your computer, for testing. |

Shared hosts, such as `github.io` or `vercel.app`, cannot have a wildcard: list your own host, such as `acme.github.io`.

## Options

| Attribute | Value |
| --- | --- |
| `data-site` | The address of your portal. Required. |
| `data-color` | The color of the button, such as `#2563eb`. The code that the dashboard gives you has your portal's color. |
| `data-position="left"` | The button at the bottom left, in place of the bottom right. |
| `data-launcher="bar"` | A "Search or ask…" bar at the bottom of the page, in place of a button. |

## Open the widget from your own button

The widget adds `window.RevdokuAsk` to your page:

```js
document.querySelector('#help').addEventListener('click', () => window.RevdokuAsk.open());
```

`RevdokuAsk.open()`, `close()` and `toggle()` control the panel. The window events `revdoku-widget-open` and `revdoku-widget-closed` tell you when it opens and closes.

The widget sends no request until a visitor uses it. Questions and messages from the widget work as on your portal: see [Ask](/ask) and [Support tickets](/tickets).
