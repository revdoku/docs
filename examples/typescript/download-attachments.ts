import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const apiKey = process.env.REVDOKU_API_KEY;
if (!apiKey) throw new Error('Set REVDOKU_API_KEY in your local .env file.');
const accountId = process.env.REVDOKU_ACCOUNT_ID;
const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };
const projectId = process.env.REVDOKU_PROJECT_ID;
if (!projectId || !/^prj_[A-Za-z0-9]+$/.test(projectId)) throw new Error('Set REVDOKU_PROJECT_ID.');

const [ticketId, messageId, attachmentId, directory = 'downloads'] = process.argv.slice(2);
if (!ticketId || !messageId || !attachmentId) throw new Error('Usage: download-attachments.js TICKET_ID MESSAGE_ID ATTACHMENT_ID [DIRECTORY]');
const url = new URL(`https://api.revdoku.com/v1/projects/${projectId}/tickets/${encodeURIComponent(ticketId)}/messages/${encodeURIComponent(messageId)}/attachments/${encodeURIComponent(attachmentId)}`);
if (accountId) url.searchParams.set('account_id', accountId);
const response = await fetch(url, { headers, redirect: 'error', signal: AbortSignal.timeout(30000) });
const result = await response.json();
if (!response.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
const attachment = result.data.download;
const temporaryUrl = new URL(attachment.url);
if (temporaryUrl.protocol !== 'https:' || temporaryUrl.username || temporaryUrl.password) throw new Error('Invalid download URL.');
// Use the temporary URL only when downloading. Never forward your API key to it.
const download = await fetch(temporaryUrl, { redirect: 'error', signal: AbortSignal.timeout(30000) })
  .catch(() => { throw new Error('Download failed. Request a fresh temporary link and retry.'); });
if (!download.ok) throw new Error(`Download HTTP ${download.status}`);
const bytes = new Uint8Array(await download.arrayBuffer());
// The sender chose the name: keep only safe characters.
const filename = String(attachment.name).replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 120);
await mkdir(directory, { recursive: true, mode: 0o700 });
const destination = join(directory, `attachment-${filename || 'download'}`);
await writeFile(destination, bytes, { flag: 'wx', mode: 0o600 });
console.log(`Saved ${bytes.length} bytes to ${destination}`);
