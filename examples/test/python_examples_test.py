"""Run the Python examples offline with a requests fixture, without changing their source."""
import contextlib
import io
import json
import os
from pathlib import Path
import runpy
import tempfile
import types
import unittest
from unittest.mock import Mock, patch

EXAMPLES = Path(__file__).resolve().parents[1] / "python"


class Response:
    def __init__(self, data=None, status=200, chunks=()):
        self.status_code, self.data, self.chunks = status, data, chunks

    def json(self):
        return self.data

    def __enter__(self):
        return self

    def __exit__(self, *args):
        pass

    def iter_content(self, size):
        yield from self.chunks


def success(data, status=200):
    return Response({"success": True, "data": data}, status)


class PythonExamplesTest(unittest.TestCase):
    def run_example(self, name, requests, *args):
        output = io.StringIO()
        env = {"REVDOKU_API_KEY": "private-fixture-key", "REVDOKU_ACCOUNT_ID": "acct_fixture",
               "REVDOKU_BUCKET_ID": "bkt_fixture"}
        with patch.dict(os.environ, env, clear=True), patch.dict("sys.modules", {"requests": requests}), \
                patch("sys.argv", [name, *args]), patch("time.sleep"), contextlib.redirect_stdout(output):
            runpy.run_path(str(EXAMPLES / name), run_name="__main__")
        self.assertNotIn("private-fixture-key", output.getvalue())
        return output.getvalue()

    def test_create_returns_the_bucket_and_its_address_without_polling_or_retry_key(self):
        requests = types.SimpleNamespace(post=Mock(return_value=success({"bucket": {
            "id": "bkt_fixture", "email": {"receiving_enabled": True, "sending_enabled": False, "address": "acme-docs@revdokumail.com"}}}, 201)), get=Mock())
        output = self.run_example("create-bucket.py", requests, "acme-docs")
        self.assertIn("Bucket: bkt_fixture", output)
        self.assertIn("Support email: acme-docs@revdokumail.com", output)
        payload = requests.post.call_args.kwargs
        self.assertEqual(payload["json"]["bucket"], {"email": {"username": "acme-docs"}})
        self.assertNotIn("idempotency_key", payload["json"])
        self.assertEqual(payload["json"]["account_id"], "acct_fixture")
        self.assertFalse(payload["allow_redirects"])
        requests.post.assert_called_once()
        requests.get.assert_not_called()

    def test_quota_failure_does_not_retry_creation(self):
        requests = types.SimpleNamespace(post=Mock(return_value=Response({"error": {
            "code": "BUCKET_CREATION_LIMIT_REACHED", "message": "Monthly limit"}}, 429)), get=Mock())
        with self.assertRaisesRegex(RuntimeError, "BUCKET_CREATION_LIMIT_REACHED"):
            self.run_example("create-bucket.py", requests)
        requests.post.assert_called_once()
        requests.get.assert_not_called()

    def test_reads_ticket_messages_and_prints_the_next_check_time(self):
        requests = types.SimpleNamespace(get=Mock(side_effect=[
            success({"tickets": [{"id": "tkt_fixture", "updated_at": "2026-11-10T08:00:00Z"}],
                "pagination": {"has_more": True, "next_cursor": "next"}}),
            success({"messages": [{"id": "eml_fixture", "direction": "received", "labels": []},
                {"id": "eml_reply", "direction": "sent", "labels": []}], "pagination": {"has_more": False, "next_cursor": None}}),
            success({"message": {"id": "eml_fixture", "body_text": "private body", "body_status": "complete", "attachments": []}}),
            success({"tickets": [], "pagination": {"has_more": False, "next_cursor": None}})]))
        output = self.run_example("read-tickets.py", requests)
        self.assertNotIn("private body", output)
        self.assertEqual(json.loads(output.splitlines()[0])["ticket_id"], "tkt_fixture")
        self.assertEqual(json.loads(output.splitlines()[-1]), {"updated_after": "2026-11-10T08:00:00Z"})
        calls = requests.get.call_args_list
        self.assertEqual(calls[1].args[0], "https://api.revdoku.com/v1/buckets/bkt_fixture/tickets/tkt_fixture/messages")
        self.assertEqual(calls[2].args[0], "https://api.revdoku.com/v1/buckets/bkt_fixture/tickets/tkt_fixture/messages/eml_fixture")
        self.assertEqual(calls[-1].kwargs["params"]["cursor"], "next")
        self.assertEqual(requests.get.call_count, 4)
        for call in calls:
            self.assertFalse(call.kwargs["allow_redirects"])
            self.assertEqual(call.kwargs["params"]["account_id"], "acct_fixture")

    def test_attachment_download_keeps_credentials_off_storage(self):
        with tempfile.TemporaryDirectory() as directory:
            output = str(Path(directory) / "receipt.txt")
            requests = types.SimpleNamespace(get=Mock(side_effect=[
                success({"download": {"url": "https://storage.example/attachment?signed=secret"}}),
                Response(chunks=[b"hello", b" world"])]))
            self.run_example("download-attachment.py", requests, "tkt_fixture", "eml_fixture", "df_fixture", output)
            self.assertEqual(Path(output).read_bytes(), b"hello world")
            self.assertEqual(Path(output).stat().st_mode & 0o777, 0o600)
            self.assertEqual(requests.get.call_args_list[0].kwargs["headers"]["Authorization"], "Bearer private-fixture-key")
            download = requests.get.call_args_list[1].kwargs
            self.assertNotIn("headers", download)
            self.assertFalse(download["allow_redirects"])
            self.assertTrue(download["stream"])

    def test_attachment_redirect_does_not_create_a_file(self):
        with tempfile.TemporaryDirectory() as directory:
            output = str(Path(directory) / "receipt.txt")
            requests = types.SimpleNamespace(get=Mock(side_effect=[
                success({"download": {"url": "https://storage.example/attachment"}}), Response(status=302)]))
            with self.assertRaisesRegex(RuntimeError, "Download failed"):
                self.run_example("download-attachment.py", requests, "tkt_fixture", "eml_fixture", "df_fixture", output)
            self.assertFalse(Path(output).exists())

    def test_attachment_does_not_overwrite_existing_files(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "receipt.txt"
            output.write_text("keep")
            requests = types.SimpleNamespace(get=Mock(side_effect=[
                success({"download": {"url": "https://storage.example/attachment"}}), Response(chunks=[b"overwrite"])]))
            with self.assertRaisesRegex(RuntimeError, "Download failed"):
                self.run_example("download-attachment.py", requests, "tkt_fixture", "eml_fixture", "df_fixture", str(output))
            self.assertEqual(output.read_text(), "keep")


if __name__ == "__main__":
    unittest.main()
