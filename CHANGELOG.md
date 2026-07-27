# @30k/starcomm-client

## 0.5.0

### Minor Changes

- [#12](https://github.com/30k-inc/starcomm-client/pull/12) [`9f87f81`](https://github.com/30k-inc/starcomm-client/commit/9f87f811e5c204b15c49c4bafbc125262ac5c6ea) Thanks [@bombitmanbomb](https://github.com/bombitmanbomb)! - Update for Star Comms bun shard v1.0.109 API changes:

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

## 0.4.1

### Patch Changes

- [#10](https://github.com/30k-inc/starcomm-client/pull/10) [`21e0485`](https://github.com/30k-inc/starcomm-client/commit/21e0485544a7a5b9dbcf45e2d702ba5d3deb0531) Thanks [@bombitmanbomb](https://github.com/bombitmanbomb)! - Cleanup URI docs and handling

## 0.4.0

### Minor Changes

- [#8](https://github.com/30k-inc/starcomm-client/pull/8) [`73cc5ee`](https://github.com/30k-inc/starcomm-client/commit/73cc5ee4033a583ca9222c56d15d40ee3a25ac73) Thanks [@bombitmanbomb](https://github.com/bombitmanbomb)! - URI Link support

## 0.3.0

### Minor Changes

- [#6](https://github.com/30k-inc/starcomm-client/pull/6) [`53316a3`](https://github.com/30k-inc/starcomm-client/commit/53316a336a8b848e2906406bd32e314b6d5c9cab) Thanks [@bombitmanbomb](https://github.com/bombitmanbomb)! - Audio Support

## 0.2.1

### Patch Changes

- [#4](https://github.com/30k-inc/starcomm-client/pull/4) [`d3bb778`](https://github.com/30k-inc/starcomm-client/commit/d3bb778294633eb1e8bde24ee9e341ac6ffc0867) Thanks [@bombitmanbomb](https://github.com/bombitmanbomb)! - Fix SSE stream early timeout

## 0.2.0

### Minor Changes

- [`cedc6ab`](https://github.com/30k-inc/starcomm-client/commit/cedc6ab660c8663f4e402f02494311082b05ed21) Thanks [@bombitmanbomb](https://github.com/bombitmanbomb)! - Flatten the resource methods

## 0.1.1

### Patch Changes

- [`8c1b2fe`](https://github.com/30k-inc/starcomm-client/commit/8c1b2fe77cfc7b4f131922d4a36b3412bd2009b1) Thanks [@bombitmanbomb](https://github.com/bombitmanbomb)! - Cleanup client and add a nets list method
