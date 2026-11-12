# Revdoku Changelog

New features, improvements and fixes in Revdoku, newest first.

## 1.0.654 — 2026-11-13

### Added

- Filter every Analytics page by audience: AI agents, humans and bots. The checkboxes on the numbers show or hide an audience in the chart and in the lists.
- See which pages AI agents read as Markdown, which pages AI apps load for a person and which pages bots request, on the new Pages page of Analytics.
- See the change against the period before next to every number and every row of Analytics.
- See your credits in the account menu. The Logs show what each reply, AI label and agent run spent, and the credits used in a range.
- Read the credits of a reply or a publish in the API answer, and the balance in the account limits. The analytics API answers each number with its previous value and its trend. See [Site analytics](/api#site-analytics).

### Improved

- Find your way around a bucket with the sidebar: Overview, Analytics, Support, Files and Settings. The Overview shows the traffic, the open tickets, the latest chats and the previews. Analytics has the pages Pages, Sources, Search and Ask.
- Read the Ask conversations as a table with one filter. A conversation shows only the states that mean something.
- Rename a bucket with a click on its name.
- Make a preview of a branch when you need one, from the Overview or the API. A push to a branch no longer builds a preview by itself.

## 1.0.652 — 2026-11-12

### Added

- Get an email as soon as a visitor leaves a message or emails your support address.
- Get a daily recap of your docs site: the questions without an answer, the searches without results and the feedback comments.
- Choose your emails in Account Settings → Notifications: New support requests, Daily recap and Weekly recap.
- See page feedback comments in Support → AI chats.

### Improved

- Get the weekly recap while you have a live site. It now shows AI agents, Ask, support requests, searches and feedback.
- See the page where a visitor asked a question or left a message.
- Start a new account with the built-in AI filter on. Administrators can turn it off in the Agents view of a bucket.

## 1.0.651 — 2026-11-12

### Added

- Choose the layout of a docs site on the new Appearance page.
- See what the search of a docs site covers on the new Search page.
- Set up Ask on its own page: turn the AI Support Agent and the Human Support Agent on or off, and choose when visitors can leave a message. The page shows the chats, questions and answers of the last 30 days.
- Filter the chats of a site: All, Answered, Unanswered, Not helpful and Open.
- See the country of a visitor who asked a question without leaving a message.
- Add the security check for Ask on a custom domain with the new guide: [Security check for Ask](/guides/ask-security-check).

### Improved

- Save a layout or an Ask change without publishing the site again. The page says when to republish.
- Find the address, the badge, search engines and Unpublish on a shorter Settings page. Auto-publish and Edits in Revdoku are on the GitHub page.
- See all DNS records of a custom domain at once during setup. A live domain keeps them in one closed row.
- See your custom domain in the site link of the bucket row as soon as it is live.
- Give a visitor who marks an answer as not helpful the message form with the question already in it.
- See in each chat how long ago it started, its state, links to the pages on your site, and formatted answers.
- Find Ask AI under its new name, Ask, in the dashboard, on docs sites and on the pricing page.

### Fixed

- Show a republish note on the Domain page after a custom domain goes live, so that the links of the site use the new domain.

## 1.0.650 — 2026-11-11

### Added

- Read every page of a site's Analytics from the API and MCP, including what your docs do not answer, so that an AI agent can update the docs. See the [API guide](/api).

### Improved

- Open the Analytics of a site as pages in the sidebar: Overview, AI agents, Humans, Pages, Search and Ask AI. A list without data is not shown.
- Open the conversations of visitors from their numbers in the traffic widget.
- Find AI chats right after Inbox in Support.

### Fixed

- Open Analytics, not Logs, from a link to the Analytics of a site.

## 1.0.649 — 2026-11-11

### Added

- Read each AI chat of your docs site as a support ticket with its own number in the new AI chats folder of Support. Solve or reopen it there.
- Find a message that a visitor leaves after an AI chat in the ticket of that chat, with the questions, the answers and your reply.

## 1.0.648 — 2026-11-11

### Added

- See the search history of your docs site in Analytics: each search, and whether the visitor opened a page, found nothing or opened no page.
- See the activity of AI agents on your docs site in Analytics: each search with its number of results, and each page that an agent read through the site's MCP server.
- Read a site's analytics from the API and MCP. See the [API guide](/api).

### Improved

- Switch buckets from the top of the sidebar, and see the site address in bucket lists.
- Compare AI agents, humans and bots in one chart of the traffic widget, with the period before.
- See critical notifications as a dialog.
- Count a search that a visitor sends as a question as an AI chat, not as a search.

## 1.0.647 — 2026-11-11

### Added

- Create a bucket that starts with a docs site from the API, MCP and the CLI. See the [API guide](/api).
- Start from a new template for the docs of a web, mobile or desktop app.
- Describe your product when you start, and the docs site begins with its name and a short summary.
- Give search engines and link previews the address, title and description of each docs page.

### Improved

- Rate an answer on a docs site with Yes or No, open its sources from one line, and get a clearer answer when the docs do not cover a question.
- Ask questions on a docs site with fewer interruptions while you move between pages.
- Read docs pages with a header that lines up with the page list on wide screens, and a clearer Pages menu on phones.
- Help search engines find every page of a site of uploaded HTML pages.
- Hide a site from search engines with a new switch in its settings. Previews are always hidden from search engines.
- Follow the API and MCP guides in the order of a first integration: see the [API guide](/api) and the [MCP guide](/mcp).

## 1.0.646 — 2026-11-11

### Added

- Start a docs site from a template: name it, and it is live in one step. Then connect your AI app to change the pages, or connect a GitHub repository later.
- Connect a GitHub repository to a bucket that already has files, in the dashboard or from the API, MCP and the CLI. The site and its address stay, and you confirm first what happens to the files.

### Improved

- Publish a bucket's files without a GitHub repository. See https://app.revdoku.com/pricing.
- Change files with your AI app or through GitHub. The file viewer shows Edit with AI in place of the editor.
- See an AI answer on a docs site write itself out like a chat reply, with its sources after it.
- See that your question is being answered from the moment you send it on a docs site, also with reduced motion on your device.
- Use the full width of the page for the site overview and its Analytics, with AI agents and people in the traffic widget.

### Fixed

- Match a redirect rule of a site with and without the trailing slash of its path.
- Finish a GitHub sync that adds and removes files at the same time.

## 1.0.645 — 2026-11-10

### Improved

- Connect a GitHub repository with less setup: Revdoku finds the folder that holds your docs and names its format before the first sync. You can change the folder and the branch.
- See and change the address of your site when you connect GitHub. You can add your own domain later.
- Choose when a newly connected repository is published.
- Read and answer support tickets, follow ticket events and preview a branch of a connected repository from the CLI. See the [CLI guide](/cli).

## 1.0.644 — 2026-11-10

### Added

- Preview a branch of your GitHub repository from the API and MCP. See the [API guide](/api).

### Improved

- See your site right after you connect GitHub: Import and sync publishes the site after the first sync. Uncheck "Publish the site after the first sync" to publish later.

## 1.0.643 — 2026-11-10

### Improved

- Keep the AI conversations of visitors and their feedback comments as long as your site's analytics.
- Send only replies from a bucket: each reply answers a received message and goes to the person who sent it. AI agents reply to the sender too, and their Email members action is gone.
- Choose Send at once or Review first in the Replies tab of Email Settings. The Send only to tab is gone.
- Read and answer support requests as tickets from the API and MCP: a ticket is one conversation that came by email, as a message left on your docs site or as page feedback. Get ticket events for every channel from one webhook and one live subscription per bucket: see the [API guide](/api).
- Use clearer names in the API for sign-in, GitHub, uploads and a bucket's email: see the [API reference](/api-reference). Change a bucket's address, aliases, allowed senders and email domains in the dashboard, not through the API.
- Use credits to publish and preview sites and for AI answers on docs sites. See https://app.revdoku.com/pricing.
- See a clear error when an account has too few credits to publish or preview, with an upgrade link for people who manage billing. A GitHub push that could not publish shows "Publishing paused: not enough credits" on the Site page, and the site keeps its version.
- Name a new bucket with the address of its first site, so that the bucket, its site and its email have one name.
- Change the docs layout of a live site, and turn the questions of visitors on or off, on its Settings page.

## 1.0.642 — 2026-11-10

### Improved

- Build a 24-hour preview of any branch of your GitHub repository from New preview on the site's Previews page.
- Publish a new, public site from a shorter dialog, and republish a site in one click. Choose a docs layout from a dropdown with a small preview, also on the site's Settings page.
- Read what visitors were looking for when a docs page did not help them. Their comment arrives in Support, without an AI answer, and the site's Analytics lists it with its page.
- See the site's address at the top right of every bucket page, next to the page's own actions.
- Reply to support requests from Support, which has no Compose button and no Drafts folder. A draft that waits for your approval is in its conversation, and links to the Drafts folder open the draft.
- Open Email Settings from the gear button at the top right of Support.
- Reach the visitors of your docs sites with Leave a message, and email your reply to them at once. The website chat button for other websites and its Email Settings tab are gone.
- Open public sites faster.
- Get analytics for every site without a switch in its settings. Choose Last 12 Months, and see more of the referrers, bots and AI agents that reach your sites.
- Compare this week with last week at the top of Manage buckets, for all your sites, and at the top of a Site page, for one site. Click the comparison of a site to open its Analytics.
- Read the transcript of every AI conversation of a visitor in the site's Analytics, answered or not. Show only the conversations that got no answer, and open the support ticket of a visitor who left a message.

### Fixed

- See every site setting on the Settings page again, including the Revdoku badge and the GitHub options.
- Get AI answers on docs sites to short questions and to questions with typos.

## 1.0.641 — 2026-11-10

### Improved

- Choose a bucket's GitHub repository from a dropdown with a search field. The branch and the folder sit in one row with Import and sync.
- See a connected repository and the progress of its sync in one short block on the GitHub page.
- Choose how edits made in Revdoku reach GitHub on the site's Settings page, next to Auto-publish GitHub updates.

## 1.0.640 — 2026-11-09

### Added

- Connect a GitHub repository to a bucket from the API, the SDKs, the CLI and MCP, so that your AI agent can set up GitHub for you. The agent gives you a link to add a GitHub account, and you approve it on GitHub: see the [API guide](/api).
- See how many searches visitors made in your site's search box in the site's Analytics.
- See the request number at the end of each reply's subject, so that the answers stay in the same request.
- Search or ask from a small bar at the bottom of every docs page. It shows the matching pages as you type, and asks the AI only when you choose to ask.
- Rate an AI answer on a docs site with Helpful or Not helpful. The site's Analytics shows the vote next to the question.

### Improved

- Give a bucket one name for its site and its email, with no random characters. When you change a site's address, the bucket's built-in email address follows it, and the earlier address keeps receiving.
- Use your account's earlier names again: the name of a deleted bucket, an earlier site address or a removed alias.
- Set up GitHub on one page: your GitHub accounts first, each with its own Connect button and Manage access, then the repositories with a search field, then Import and sync. Every connection starts from the repository, and one Refresh button updates the accounts and their repositories.
- Open a docs site's search from the icon in the header, with Cmd+K or Ctrl+K, or with /. Each result shows its section, page and group.
- Read AI answers on a docs site as a chat that stays while you move between pages, with code blocks, lists and links to the pages that they cite. Copy an answer, ask again, or open a matching page while you type a question.
- Copy a docs page, or open it in an AI app, from one button next to the page title. Each menu item says what it does.
- Switch a docs site's language from the menu next to the logo, and its theme from the top right of the header. See the section that you read in On this page, the page's group above its title, and the method of each API endpoint page in the page list.
- See exact counts of people's views, bot requests, AI agent requests and searches in a site's Analytics, with lists that add up to them. See today's visitors so far.
- Open Buckets, Activity and Settings from the sidebar of Manage buckets and Account Settings, and read each bucket's name in the Grid view. Lists, Logs and error messages say bucket, not mailbox.

### Fixed

- Receive messages and send replies while the bucket's site publishes.

## 1.0.639 — 2026-11-09

### Added

- Ask readers "Was this page helpful?" at the end of every docs page. A reader who answers No can say what they were looking for and get an AI answer.

### Improved

- See notifications named by what needs you: "Draft of reply awaiting approval" and "Needs a reply". A message left on a docs site arrives as "Question: …".
- See a shorter line at the end of emails sent from the Free plan: "Sent with Revdoku".
- Pick the date range of a site's analytics from one dropdown.
- See the totals of all your buckets at the top of the Buckets page.
- Open a bucket's Logs, Notifications and Webhooks under Activity in the bucket's sidebar, and go back to its site, support or files from there.
- Create a bucket from New bucket at the bottom of the sidebar.

## 1.0.638 — 2026-11-09

### Added

- Press Cmd+K (Ctrl+K on Windows and Linux) on a docs site to search.
- Ask your search as a question from the last search result of a docs site, also when no page matches.
- Use the header links and button, the footer links and the banner of a Mintlify site on docs sites. Visitors can close the banner.
- Copy a docs page as Markdown, or open it in an AI app, from the page menu.

### Improved

- Leave a message on a docs site with a name, an email address and the message. A person reviews and sends every reply.
- Get an answer to a question about the page that you read on a docs site, such as "what is that?".
- See a docs page's own card components, such as hero cards, as cards.
- See the security check of a docs site right above the question box.
- Find the theme switch of a docs site at the bottom of the page list. A switch back to your system theme makes the site follow the system again.

## 1.0.637 — 2026-11-09

### Improved

- Open any docs page as Markdown. See [Docs sites](/docs-sites).
- See AI agents and bots first in a site's analytics, then people, with one chart of all three per day.
- Find every action in Logs. The Timeline view of Analytics is gone.

### Fixed

- Open a site's analytics from "View analytics" in the weekly report and in notifications.

## 1.0.636 — 2026-11-09

### Improved

- See matching pages as you type in a docs site's search box and in its question box. The search box opens faster on large sites.
- Read a docs site's header on one row on phones. The page no longer zooms in when you tap the search box or the question box.
- Copy code with an icon button. A code block shows its title, and the tabs of a code group show the file names.
- See a docs site's own logo alone in the header, and its dark logo in the dark theme.
- Open a page's Markdown as plain text, with the page title and description at its start.
- See a smaller and lighter Revdoku badge on sites.

### Fixed

- Show the text and code inside Mintlify components such as Steps correctly when they are indented. Code examples that contain code blocks also show correctly.
- Keep braces in their place in highlighted code on docs sites. Show the tabs of a Tabs component above their content.

## 1.0.635 — 2026-11-09

### Fixed

- Get improvements to docs sites on your site at its next publish.

## 1.0.634 — 2026-11-09

### Fixed

- Show no extra API reference on a Mintlify site that names no OpenAPI document. Its links led to missing pages.

## 1.0.632 — 2026-11-08

### Fixed

- Keep a site online while it publishes again.

## 1.0.631 — 2026-11-08

### Improved

- Read docs sites on phones: the list of pages folds behind a Pages button, and the search has its own row.

### Fixed

- Show the Visibility blocks of Mintlify pages to the right readers: content for AI agents appears only in the Markdown of a page, and content for people only on the page.

## 1.0.630 — 2026-11-08

### Improved

- Open the pages of docs sites faster, and publish large docs sites faster.

### Fixed

- Publish docs sites that have their own redirects.

## 1.0.629 — 2026-11-08

### Added

- Add a chat to any website from Email Settings → Website chat. Each message arrives in the bucket's Support, and the replies show in the chat.

### Improved

- Publish more Mintlify repositories as they are: included files, languages with a language menu, tab menus, hidden tabs, redirects and endpoint pages.
- Connect a large GitHub repository faster, and publish large docs sites faster.
- Ask questions on public docs sites with the Ask button, now on by default: turn it off in the Publish dialog. See https://app.revdoku.com/pricing.
- See the Revdoku badge of a site as a line in the page footer, not as a floating icon over the page.
- Turn off the Revdoku badge in the Settings of a site on a paid plan. See https://app.revdoku.com/pricing.
- Use one balance of credits for messages and AI. See https://app.revdoku.com/pricing.
- See the credits that are left, and when they refill, in Account Settings → Subscription.
- Review the emails that apps and AI agents send before they go out. See https://app.revdoku.com/pricing.
- Start a new account with the built-in AI filter off. Administrators turn it on in the Agents view of a bucket.

### Fixed

- Show docs sites with their styles.
- Get AI answers on docs sites.

## 1.0.626 — 2026-11-08

### Improved

- Get AI answers on docs sites also when a question uses other words than your docs. Each answer links the section that it comes from.
- See links to the exact sections of your docs in the support agent's draft replies.

## 1.0.625 — 2026-11-08

### Added

- Start a docs site from the docs template on GitHub: GitHub makes your own copy, then you connect it to a bucket.

### Improved

- Publish large docs sites faster.
- Publish sites from a connected GitHub repository. See https://app.revdoku.com/pricing.
- Read the Website Publishing Policy at https://revdoku.com/website-publishing-policy/. The Terms of Use now cover docs sites.

## 1.0.624 — 2026-11-07

### Improved

- Publish docs sites with many pages.
- See the title and description of each docs page at its top.

### Fixed

- Publish docs sites whose pages are MDX files, and repositories with text files that have no extension.

## 1.0.623 — 2026-11-07

### Improved

- Republish a site faster after a small change.

### Fixed

- Keep automatic publishing of your site going when a file is too large. The file is left out, and the GitHub panel lists it.
- See files stored in Git LFS as skipped in the GitHub panel.

## 1.0.622 — 2026-11-07

### Improved

- Find a site's pages in the sidebar under **Site**: Previews, GitHub, Domain, Access and Settings. They replace the Website settings dialog.
- See your site and its GitHub repository at a glance on the Site page: the address, when it was published and synced, and how many pages and files it has.
- See what needs you in one line on the Site page: a failed sync with **Try again**, or edits that are not on GitHub with **Review**.
- See every 24-hour preview on the **Previews** page, also the previews of your GitHub branches.
- See the commits that Revdoku sends to GitHub as **Verified**.

### Fixed

- Sync GitHub repositories again.
- See no request to connect GitHub or add docs while the first sync of a connected bucket runs.
- Read a clear message when a GitHub sync fails.

## 1.0.621 — 2026-11-06

### Added

- Publish edits to GitHub when they are ready. Edits in a bucket linked to GitHub wait as pending changes: **Publish** commits them to your branch, and **Open pull request** sends them for review.
- Merge Revdoku's pull request from the GitHub panel with **Merge and publish**. While the pull request is open, new edits go to it.
- Choose how edits reach GitHub in **Edits in Revdoku**: Publish manually, Commit at once or Read-only.
- See who reads your docs in the bucket's **Analytics**: AI agents and their requests, bots, countries, what visitors and agents searched, and the questions that visitors asked.
- Let visitors leave a message when the docs do not answer their question. It opens a support ticket, and your reply goes to their email.
- Set the name, address, access and docs layout of a site in one **Publish** dialog.
- Add your own security check for the questions of visitors on a custom domain in Website settings. See [Security check for Ask](/guides/ask-security-check).

### Improved

- See only your GitHub branch on your live docs site: edits that wait for Publish or for review never go live. The changes for a protected branch go through a pull request.
- Ask questions on a docs site in a panel beside the page, with a security check for visitors.
- Give AI agents links to the Markdown of a page and to the site's MCP server on every docs page.
- Find Site, Analytics, Support and Files in the sidebar of a bucket with a site. Compose, the folders and Agents are in Support.
- Name a new bucket when you create it. A bucket without a chosen name takes the name of its first GitHub repository.
- Keep your support email address private: a site never shows it to visitors or AI agents.

### Fixed

- Start a bucket from the docs template again.
- Read a clearer message when a publish fails, and try the publish again.
- Get the email about a failed publish again.

## 1.0.620 — 2026-11-06

### Added

- Add AI agents to any bucket from its Agents view. An agent runs on new email with your instructions and uses the account's credits: it can draft replies, email your team, write files and add labels.

## 1.0.619 — 2026-11-06

### Added

- Answer support email from your docs: the built-in support agent drafts a reply to each support email from the bucket's docs pages, and a person sends it.
- Connect a GitHub repository from the new GitHub tab in Website settings.
- Track support requests as tickets: each conversation in Support has a number. Filter open or solved tickets, and solve or reopen one from the email.
- Let the visitors of public docs sites ask a question with Ask AI: they get an answer from your docs with links to its pages, and can contact support.
- Connect AI agents to the MCP server of a public docs site without sign-in, and search a docs site from code. See [Docs sites](/docs-sites).
- Show the bucket's email address to AI agents from the Site tab, so that they send questions and requests by email.
- Try API requests from the API console of a public docs site.
- See each publish from GitHub on its commit: the Revdoku check shows the build while it runs, then links the published site, or the bucket when publishing failed.
- Preview every branch of a published site: a push to another branch of the connected repository gets a 24-hour preview, linked from its commit on GitHub.

### Improved

- Set up a new account by adding your docs: connect a GitHub repository, upload files or start from the docs template, then publish.
- Read bucket, not mailbox, in the dashboard, notifications and messages, and find the Mailbox tab under its new name, Support. Notifications name a bucket by its title.
- See docs sites first on the pricing page: https://app.revdoku.com/pricing.
- Give AI agents a list of the pages of a docs site by navigation group, each with a summary. Help search engines find every page of a docs site that allows search indexing.
- Search the whole text of the pages from the search box of a docs site.

## 1.0.618 — 2026-11-05

### Added

- Publish a bucket as a website or a docs site. A Mintlify repository works as it is: its navigation, pages with snippets and components, an OpenAPI document and endpoint pages.
- Connect a GitHub repository to a bucket. The bucket's files follow the repository, and each push publishes the site.
- Start a new account by connecting a GitHub repository. Connect GitHub… is the first choice in the Connect menu and in an empty bucket.

## 1.0.616 — 2026-11-05

### Improved

- Work with buckets: a bucket has files, a site, a mailbox and agents. The API, MCP, the CLI and the SDKs use the new name: see the [API guide](/api).

## 1.0.614 — 2026-11-03

### Improved

- Filter Logs by the built-in AI filter, separately from connected apps and people.
- See more action names in Logs, such as Viewed email list and Opened email.

### Fixed

- Improve the reliability of the built-in AI filter.
- See a notice on an email that the built-in AI filter could not check.

## 1.0.613 — 2026-11-03

### Improved

- See Compose, the folders and the labels in the mailbox sidebar in Mail, Files and Agents.
- See the title and the address of each mailbox on two lines in the mailbox switcher.
- See agents as numbered steps, each with a Settings button. Change their order by dragging, with the arrow keys or with Move up and Move down, then select Save order.
- Open the built-in AI filter from the Agents view, like other agents. Account Settings no longer has an AI Agents tab.
- Try an agent on an email in a panel beside its settings. The result shows what the agent would do, or why it skipped the email.
- Find agent settings in the groups When it runs, What it reads, What it does and Instructions.
- Go back one step with Back at the top right of Set up this mailbox.

### Fixed

- Save the new order after you drag an agent down.
- See the full focus outline of form fields in dialogs.

## 1.0.548 — 2026-10-08

### Improved

- Create new accounts in the browser at app.revdoku.com. Signup through the API and MCP is unavailable, and the API documentation, the SDKs and the Skill say so.
- Sign in before an AI app connects to MCP.

## 1.0.547 — 2026-10-08

### Improved

- Connect Claude on the web and on the desktop to your account.
- Open reconnect instructions from Account → Access when a saved Claude connector fails.

### Fixed

- See a sign-in request when an AI app has no valid connection.
- Improve the security of AI app connections.

## 1.0.540 — 2026-10-06

### Improved

- Sign up in fewer steps on the web and through the API. The first mailbox gets its address automatically.
- Read a shorter API guide: see the [API guide](/api).

## 1.0.538 — 2026-10-06

### Improved

- Get a new mailbox address that starts with a readable name. See https://app.revdoku.com/pricing.
- See links to custom-domain or upgrade settings when an email name is unavailable.
- Open archived mailboxes from the bottom of the mailbox sidebar.
- Manage labels without the automatic-source marker.

### Fixed

- Keep account switching available in client accounts, so that people can return to their agency account and its mailboxes.
- Read notification emails more easily: the content lines up with the footer, long addresses wrap on phones, and a deleted mailbox shows its name and deletion time.
- Read error text more easily in dark mode. The dashboard follows your system theme by default and keeps a theme that you chose.
- See subjects across the full width of the message list.
- Keep Select mode in the mailbox directory, and go back to the view that you came from.
- See the test-email link only until a mailbox receives its first email.
- Fix an error when an AI app connects.

## 1.0.535 — 2026-10-05

### Improved

- Identify mailboxes by their email address throughout the dashboard, the API, MCP, the CLI, the SDKs and integrations.
- Open a mailbox by selecting its address in mailbox lists. Use separate controls to copy the address or compose an email.
- Browse notification history in Analytics. Choose Short or Details in logs.
- See connection icons, counts, action reasons and mailbox links in activity logs.
- Open large mailboxes and Analytics faster, with simpler mailbox settings and menus.

## 1.0.519 — 2026-09-30

### Improved

- Create a mailbox with a ready receiving address in one API request, and read your account's limits from the API, the CLI or MCP. See the [API guide](/api).
- Complete API signup in fewer steps.
- Follow reorganized API and developer guides, with examples for JavaScript, TypeScript and Python.

### Fixed

- Hide the GitHub Sync controls while GitHub Sync is unavailable.
- Correct the developer examples, the CLI and MCP so that they match the API.

## 1.0.518 — 2026-09-30

### Added

- Choose a mailbox username in the API, MCP, the CLI and at signup, or get a generated address.
- List the accounts that a connection can use, and delete single emails with their attachments, through the API and agent tools.

### Improved

- Read email through the API without a change to its shared read status.
- Use direct HTTP examples for JavaScript, TypeScript and Python, without a Revdoku SDK.
- Verify your email when you sign up through the API.

### Fixed

- Fix downloads of email attachments through the API.

## 1.0.516 — 2026-09-30

- Read emails, conversations, originals and attachments through the API, MCP and the CLI.
- Use consistent responses and retry guidance in the API, with runnable JavaScript and TypeScript examples.
- Navigate with Mailboxes and Analytics in the header and switch accounts from the sidebar. API connections come first in the Connect menu.
- Find billing and usage in a separate Subscription tab of Account settings.

## 1.0.513 — 2026-09-29

- Install the CLI on its own from GitHub Releases. The skill and plugin installs still work: see the [CLI guide](/cli).
- Run JavaScript or TypeScript examples that create a mailbox, read mail, download attachments, upload files and read quotas.

## 1.0.508 — 2026-09-29

- Read in the skill and plugin descriptions what they can do: upload and change files, delete mailboxes and create client accounts, as well as receive email.
- Improve the safety of uploads from the CLI.

## 1.0.507 — 2026-09-28

- Find Revdoku as an email mailbox with shared file storage for people and AI agents.
- Start with examples for summarizing mail, collecting invoices and attachments, and monitoring submission replies.
- Read in the skill and plugin descriptions that email support is incoming only.

## 1.0.506 — 2026-09-28

- Name the path that you upload from the CLI, and check the selection before you upload. See the [CLI guide](/cli).
- Confirm a permanent deletion in the CLI after a preview of what it deletes.
- Improve the security of the CLI.
- Fix CLI uploads on macOS. Deletion previews show complete counts.

## 1.0.499 — 2026-09-25

- Filter messages by read status or attachments, and sort newest, oldest, or unread first.
- Choose a mailbox name before you create it. The name stays when you try again after an error.
- Review clearer activity totals and relative email arrival times, with exact timestamps on hover.
- Install the agent skills with their resources in one package.

## 1.0.492 — 2026-09-23

- Store, share, and version files in private cloud mailboxes.
- Use each mailbox as a mailbox for messages and attachments.
- Read decoded message bodies and originals through the CLI, API, or hosted MCP.
- Coordinate authorized agents with account selection, locks, and revision checks.
