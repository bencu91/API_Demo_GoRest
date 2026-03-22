# GoRest API Test Framework

This is an API test automation framework built on top of the [GoRest](https://gorest.co.in) public REST API. I put this together using Postman collections and Newman so the tests can run from the command line or automatically through GitHub Actions on every push.

---

## What's inside

| Tool | What it does |
|---|---|
| [Newman](https://github.com/postmanlabs/newman) | Runs Postman collections from the command line |
| [Postman Collections](https://www.postman.com/) | Where all the test cases and assertions live |
| [GitHub Actions](https://github.com/features/actions) | Runs the tests automatically on push and PR |
| Node.js 18+ | Runtime |

---

## Before you start

You'll need:
- Node.js 18 or higher
- A GoRest API token

**How to get your GoRest token:**
1. Head over to [gorest.co.in](https://gorest.co.in)
2. Sign in with your GitHub or Google account
3. Your token will be on the dashboard — copy it

---

## Setup

```cmd
:: Clone the repo
git clone https://github.com/bencu91/API_Demo_GoRest.git
cd API_Demo_GoRest

:: Install dependencies
npm install
```

Then open `environments\devGoRest.postman_environment.json` and paste your token into the `authToken` value field.

---

## How to run the tests

### With Node.js

```cmd
node run-all-tests.js
```

This picks up all collections automatically and runs them one by one.

### Run a single collection directly

```cmd
npx newman run collections\01-Authentication-Validation.postman_collection.json --environment environments\devGoRest.postman_environment.json
```

---

## CI/CD

Every push and pull request to `main` triggers the full test suite via GitHub Actions.

To make it work you need to add your token as a GitHub secret:
1. Go to your repo on GitHub
2. Settings → Secrets and variables → Actions
3. Add a new secret called `GOREST_TOKEN` and paste your token

After each run, test reports (JSON) are saved as downloadable artifacts and kept for 30 days.

---

## Project layout

```
API_framework/
├── collections/                          # Test collections, run in filename order
│   ├── 01-Authentication-Validation.postman_collection.json
│   └── 02-End-to-End Flow.postman_collection.json
├── environments/
│   └── devGoRest.postman_environment.json  # Local environment config (keep your token here)
├── data/
│   └── testData.json                     # Test data for data-driven test cases
├── reports/                              # Test output goes here (not tracked in git)
├── .github/workflows/
│   └── api-tests.yml                     # CI/CD pipeline definition
├── run-all-tests.js                      # The main runner script
├── dockerfile
└── docker-compose.yml
```

---

## What the tests cover

### 01 — Authentication Validation
Checks that the API handles auth correctly:
- Sending an invalid token should return `401 Unauthorized`
- A valid token should return `200 OK` with the right response shape and within 500ms

### 02 — End-to-End Flow
Walks through the full lifecycle of a user and their content, then cleans everything up:

| Step | What it does | What it checks |
|---|---|---|
| 1 | Create a user | 201, correct fields and types |
| 2 | Create a post for that user | 201, linked to the right user |
| 3 | Create a comment on that post | 201, linked to the right post |
| 4 | Delete the comment | 204, empty body |
| 5 | Confirm comment is gone | 404, error message present |
| 6 | Delete the post | 204, empty body |
| 7 | Confirm post is gone | 404, error message present |
| 8 | Delete the user | 204, empty body |
| 9 | Confirm user is gone | 404, error message present |

Every step also checks that the response comes back under 2000ms, is valid JSON, and has the right Content-Type header.
