---
title: Custom email domains
description: Connect your own email domain in the dashboard, then create buckets with addresses on it through the API.
---

Every bucket has an address on the built-in domain `revdokumail.com`. With your own
domain, a bucket can have an address such as `support@mail.example.com`.

You connect a domain, change the address of a bucket and add aliases in the dashboard.
The API has no endpoints for domains, address changes or aliases. The API creates a bucket
on a domain that is ready, and reads the address and its state in `bucket.email`.
Plans differ in custom email domains and aliases: see [Pricing](https://app.revdoku.com/pricing).
`GET /v1/account/limits` returns the limits of your account, such as `max_email_domains`.

## Connect a domain in the dashboard

An account owner or administrator connects the domain.

1. Open [Account Settings → Domains](https://app.revdoku.com/account/domains).
2. Enter the hostname. See [Choose a hostname](#choose-a-hostname).
3. Add the DNS records that the page shows at your DNS provider. Each record has a copy button.
4. Wait until the page shows the domain as ready.

Revdoku does not change your DNS records.

### Choose a hostname

| Your setup | Hostname to connect | Example address |
| --- | --- | --- |
| `example.com` already receives email through another provider | An unused subdomain, such as `mail.example.com` | `support@mail.example.com` |
| A domain that only Revdoku uses for email | The root domain, such as `example.com` | `support@example.com` |

The setup refuses a hostname that has MX or CNAME records of another provider.
Keep those records and choose an unused subdomain.

## Create a bucket on your domain

Send the ready domain as `bucket.email.domain` and the name before `@` as `bucket.email.username`
to [`POST /v1/buckets`](/api-reference/buckets#create-a-bucket). The key needs admin access to all buckets.

<CodeGroup>

```ts TypeScript
const { data } = await client.createBucket({ username: 'support', domain: 'mail.example.com' });
console.log(data.bucket.id, data.bucket.email.address);
```

```python Python
bucket = client.create_bucket(username="support", domain="mail.example.com").data.bucket
print(bucket.id, bucket.email.address)
```

```http HTTP
POST /v1/buckets
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{ "bucket": { "email": { "username": "support", "domain": "mail.example.com" } } }
```

</CodeGroup>

Creation never connects a domain and never uses another domain in its place.
The [username rules](/api#create-a-bucket) apply. Without `email.domain`, the address is on `revdokumail.com`.

| Error code | Action |
| --- | --- |
| `EMAIL_DOMAINS_UPGRADE_REQUIRED` | The plan has no custom email domains. `error.details.upgrade_url` has the [Pricing](https://app.revdoku.com/pricing) link. |
| `EMAIL_DOMAIN_NOT_REGISTERED` | Connect the domain in [Account Settings → Domains](https://app.revdoku.com/account/domains) first. |
| `EMAIL_DOMAIN_NOT_READY` | Complete the DNS setup of the domain, then try again. |
| `EMAIL_ALREADY_EXISTS` | Another bucket uses the address. Choose another `email.username`. |

After creation, read the bucket: `bucket.email.address` is the address, and
`receiving_enabled` with `receiving_blocked_reason` shows if it can receive now.

## Change an address or add an alias

Use **Email Settings** of the bucket in the dashboard. An account owner or administrator can:

- change the address of an existing bucket to a connected domain, or back to `revdokumail.com`;
- add alias addresses, which deliver to the same bucket.

A bucket on your domain keeps a built-in `revdokumail.com` address. Replies to tickets are sent from that address.
Connecting a domain does not change the addresses of existing buckets.
A domain can be removed in Account Settings → Domains after no bucket uses it.

[API guide](/api#email-settings) · [API reference](/api-reference)
