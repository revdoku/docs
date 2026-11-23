"""Create a project. Success returns its ID and its support email address."""
import os
import sys
import requests

username = sys.argv[1] if len(sys.argv) > 1 else None
response = requests.post(
    "https://api.revdoku.com/v1/projects",
    headers={"Authorization": f"Bearer {os.environ['REVDOKU_API_KEY']}"},
    timeout=30, allow_redirects=False,
    json={"account_id": os.getenv("REVDOKU_ACCOUNT_ID"),
          "project": {"email": {"username": username} if username else {}}},
)
result = response.json()
if response.status_code != 201:
    raise RuntimeError(f"{result['error']['code']}: {result['error']['message']}")
project = result["data"]["project"]
print(f"Project: {project['id']}")
print(f"Support email: {project['email']['address']}")
