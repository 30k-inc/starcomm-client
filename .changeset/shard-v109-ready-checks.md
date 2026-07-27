---
"@30k/starcomm-client": minor
---

Update for Star Comms bun shard v1.0.109 API changes:

### New: Ready Checks

Added `client.readyChecks` resource with full template and session management:
- `list()` — list configured ready check templates
- `upsert(input)` — create or update a template
- `remove(id)` — delete a template
- `start(templateId, initiatorName?)` — initiate a 20-second ready check session
- `getSessions()` — fetch all active/recent sessions
- `getSession(sessionId)` — fetch a single session with participant details and summary

### New: Ready Check SSE Events

Five new event types with typed data:
- `ready-check.configured` — template created/updated
- `ready-check.removed` — template deleted
- `ready-check.started` — session initiated
- `ready-check.response` — participant responded
- `ready-check.completed` — session expired/all responded

### New: ACARS Alert Types

- Added `AcarsAlertType` (`"critical" | "emergency" | "non-emergency"`)
- `comms.sendAcars()` now accepts `alertType` option
- `AcarsResult` and `acars.sent` event data include `alertType`

### New: Shard Features

- `ShardFeatures.readyCheckEnabled` — ready check feature toggle
- `ShardFeatures.orgLink` — org link feature config (`enabled`, `roleIds`, `netUid`)

### New: Debug Endpoint

- Added `ShardDebugResponse` typed interface for `/debug`
- Added `client.status.getDebug()` method (requires shard token)

### Breaking: Health Endpoint Simplified

- `ShardHealthResponse` now returns only `{ ok, app, version }` (was a large object)
- The old health data is now available via `client.status.getDebug()` or `client.metrics.getDebug()`

### Breaking: Embed Status Updated

- `ShardEmbedStatusResponse.operators` removed, replaced by `connected` (number)
- Added `publicNet` object and `updatedAt` field
- Net entries now include optional `uid`, `netUid`, `virtual`, `public`, `protected`

### Updated: Auto-Assignment Rules

- `AutoAssignRule` now supports `netIds: number[]` and `netUids: string[]` arrays
- Old `netId` field kept as optional deprecated

### Updated: Roster

- `ShardOperator.service` field added (identifies bot/service listener connections)
