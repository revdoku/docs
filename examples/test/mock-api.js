// Imported only by offline subprocess tests. Every unknown request fails closed.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

let upload;
let ticketListAttempts = 0;
const UPDATED_AT = '2026-09-29T00:00:00Z';
const mail = { subject: 'Fixture message', from_addresses: [{ address: 'sender@example.test', name: null }], body_text: 'Fixture body',
  body_status: 'complete', received_at: '2026-09-29T00:00:00Z',
  attachments: [{ id: 'df_note', filename: 'note.txt', size_bytes: 5 }] };
const ok = data => Response.json({ success: true, data });

globalThis.fetch = async (input, options = {}) => {
  const url = new URL(input);
  const headers = new Headers(options.headers);
  const body = options.body && typeof options.body === 'string' ? JSON.parse(options.body) : null;
  if (url.origin === 'https://api.revdoku.com') {
    assert.equal(headers.get('Authorization'), 'Bearer offline-fixture-key');
    assert.equal(options.redirect, 'error');
    if ((options.method ?? 'GET') === 'GET') assert.equal(url.searchParams.get('account_id'), 'acct_fixture');
    else assert.equal(body.account_id, 'acct_fixture');
    if (url.pathname === '/v1/buckets') {
      assert.equal(body.idempotency_key, undefined);
      return ok({ bucket: { id: 'bkt_fixture', email: { address: 'fixture@revdokumail.com', receiving_enabled: true, sending_enabled: false }, dashboard_url: 'https://app.revdoku.com/buckets/bkt_fixture' } });
    }
    if (url.pathname.endsWith('/events/subscription')) return ok({ subscription: {
      token: 'offline-token', websocket_url: 'wss://app.revdoku.com/cable', channel: 'BucketEventsChannel',
      account_id: 'acct_fixture', bucket_id: 'bkt_fixture'
    } });
    if (url.pathname.endsWith('/tickets')) {
      ticketListAttempts++;
      if (process.env.FIXTURE_INDEX_BUILDING === 'always') {
        assert.ok(ticketListAttempts <= 4, 'Read retries must be bounded');
      }
      if (process.env.FIXTURE_INDEX_BUILDING === 'always' ||
          (process.env.FIXTURE_INDEX_BUILDING === 'twice' && ticketListAttempts <= 2)) {
        return Response.json({ error: { code: 'EMAIL_INDEX_BUILDING', message: 'Email index is being prepared' } }, { status: 503 });
      }
      const cursor = url.searchParams.get('cursor');
      if (process.env.FIXTURE_WATCH_RECOVERY && cursor === 'next') {
        try {
          writeFileSync('.fixture-page-failed', '', { flag: 'wx' });
          return Response.json({ error: { code: 'UNAVAILABLE', message: 'Later page failed once' } }, { status: 503 });
        } catch (error) { if (error.code !== 'EEXIST') throw error; }
      }
      // Two tickets on two pages. Nothing changed after the fixture time.
      if (url.searchParams.get('updated_after') === UPDATED_AT) return ok({ tickets: [], pagination: { has_more: false, next_cursor: null } });
      return ok({ tickets: [{ id: cursor ? 'tkt_second' : 'tkt_first', channel: 'email', status: 'open', updated_at: UPDATED_AT }],
        pagination: { has_more: !cursor, next_cursor: cursor ? null : 'next' } });
    }
    if (url.pathname.endsWith('/attachments/df_note')) {
      assert.match(url.pathname, /\/tickets\/tkt_first\/messages\/eml_first\/attachments\/df_note$/);
      return ok({ download: { url: 'https://storage.example/file?path=attachments/note.txt', filename: 'note.txt' } });
    }
    const thread = url.pathname.match(/\/tickets\/tkt_(first|second)\/messages(?:\/(eml_\w+))?$/);
    if (thread && !thread[2]) {
      return ok({ messages: [{ id: `eml_${thread[1]}`, direction: 'received', labels: [] }, { id: `eml_${thread[1]}_reply`, direction: 'sent', labels: [] }],
        pagination: { has_more: false, next_cursor: null } });
    }
    if (thread) {
      assert.equal(thread[2], `eml_${thread[1]}`);
      if (process.env.FIXTURE_EMAIL_DELAY) await new Promise(resolve => setTimeout(resolve, 250));
      return ok({ message: { id: thread[2], ticket_id: `tkt_${thread[1]}`, ...mail } });
    }
    if (url.pathname.endsWith('/files') && options.method === 'POST') {
      assert.equal(body.signed_blob_id, 'fixture-signed-id'); assert.equal(body.path, 'project/notes.txt'); return ok({ file: { id: 'df_uploaded' } });
    }
    if (url.pathname.endsWith('/files/df_uploaded/download')) {
      return ok({ download: { url: 'https://storage.example/file?path=project%2Fnotes.txt' } });
    }
    if (url.pathname === '/v1/buckets/bkt_fixture/uploads') {
      assert.equal(body.blob.purpose, 'bucket_file'); assert.equal(body.bucket_id, undefined);
      return ok({ signed_id: 'fixture-signed-id', direct_upload: { url: 'https://storage.example/upload', headers: { 'Content-Type': body.blob.content_type } } });
    }
    if (url.pathname === '/v1/account/limits') {
      if (process.env.FIXTURE_QUOTA) return Response.json({ error: { code: 'BUCKET_CREATION_LIMIT_REACHED', message: 'Monthly creation limit reached', details: { resets_at: '2026-10-01T00:00:00Z' } } }, { status: 429 });
      return ok({ account_id: 'acct_fixture', limits: { max_buckets: 25, api_rate_limit_requests_per_minute: 120 } });
    }
  } else if (url.origin === 'https://storage.example') {
    assert.equal(headers.get('Authorization'), null); assert.equal(headers.get('Cookie'), null);
    if (url.pathname === '/upload' && options.method === 'PUT') { upload = Buffer.from(options.body); return new Response(null); }
    const path = url.searchParams.get('path');
    if (path.endsWith('attachments/note.txt')) return new Response('hello');
    if (path === 'project/notes.txt' && upload) return new Response(upload);
  }
  throw new Error(`Unexpected offline request: ${url.origin}${url.pathname}`);
};

// Test-only transport; published examples use the native WebSocket unchanged.
if (process.env.FIXTURE_SOCKET_END) {
  globalThis.WebSocket = class extends EventTarget {
    constructor(url) {
      super();
      assert.equal(new URL(url).searchParams.get('subscription_token'), 'offline-token');
      setTimeout(() => this.dispatchEvent(new Event('open')), 0);
    }
    send() {
      this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ type: process.env.FIXTURE_SOCKET_END, reconnect: false }) }));
    }
    close() { this.dispatchEvent(new Event('close')); }
  };
}

if (process.env.FIXTURE_WATCH_RECOVERY) {
  globalThis.WebSocket = class extends EventTarget {
    timer;
    closed = false;
    constructor(url) {
      super();
      assert.equal(new URL(url).searchParams.get('subscription_token'), 'offline-token');
      setTimeout(() => this.dispatchEvent(new Event('open')), 0);
    }
    send() {
      this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ type: 'confirm_subscription' }) }));
      this.timer = setInterval(() => {
        let cursor;
        try { cursor = JSON.parse(readFileSync('.revdoku-examples/acct_fixture-bkt_fixture.json', 'utf8')).updated_after; }
        catch (error) { if (error.code !== 'ENOENT') throw error; }
        if (cursor === UPDATED_AT) {
          this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ type: 'disconnect', reconnect: false }) }));
        }
      }, 20);
    }
    close() {
      if (this.closed) return;
      this.closed = true;
      clearInterval(this.timer);
      this.dispatchEvent(new Event('close'));
    }
  };
}
