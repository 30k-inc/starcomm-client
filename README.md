# @starcomms/client

TypeScript API client for the [Star Comms](https://starcomms.duckdns.org) shard Owner API. Framework-agnostic, zero dependencies — uses the native `fetch` API available in Node 18+, Bun, Deno, and browsers.

## What is Star Comms?

Star Comms is a real-time voice communications system for Star Citizen organizations. It provides radio-net style push-to-talk (PTT) voice channels that operators connect to via a lightweight client. The infrastructure consists of:

- **Central server** — manages guild configuration, authentication, and shard registration.
- **Shard servers** — dedicated processes handling WebSocket connections, UDP voice routing, and the Owner HTTP API. Each shard serves one Discord guild.

This package is a typed client for the **shard Owner API**, giving you programmatic control over nets, assignments, operations, broadcasts, and more.

## Installation

```bash
npm install @starcomms/client
# or
pnpm add @starcomms/client
# or
yarn add @starcomms/client
```

## Quick Start

```typescript
import { StarCommsClient } from "@starcomms/client";

const client = new StarCommsClient({
  baseUrl: "http://your-shard-host:25588",
  ownerApiKey: "scok_your_key_here",
});

// Check shard health (unauthenticated)
const health = await client.getHealth();
console.log(`Shard: ${health.app}, Clients: ${health.clients}`);

// Get live net status
const status = await client.getStatus();
for (const net of status.nets) {
  console.log(`Net ${net.id} "${net.name}" — ${net.occupancy} operators`);
}

// Assign a user to a net
await client.assignNet("discord_user_id", 1);

// Broadcast an alert to all connected operators
await client.sendAcars({ text: "Fleet departing in 5 minutes!" });
```

## Configuration

```typescript
interface StarCommsClientConfig {
  /** Base URL of the shard (e.g., "http://216.114.75.146:25588"). No trailing slash. */
  baseUrl: string;

  /** Owner API key (scok_...) for authenticated endpoints. */
  ownerApiKey: string;

  /** Optional shard token (scsh_...) for the /debug endpoint. */
  shardToken?: string;

  /** Request timeout in milliseconds (default: 10000). */
  timeoutMs?: number;

  /** Optional custom fetch implementation (default: global fetch). */
  fetch?: typeof fetch;
}
```

### Custom Fetch

You can inject a custom `fetch` for testing, proxying, or environments without a global fetch:

```typescript
import { StarCommsClient } from "@starcomms/client";
import nodeFetch from "node-fetch";

const client = new StarCommsClient({
  baseUrl: "http://your-shard:25588",
  ownerApiKey: "scok_...",
  fetch: nodeFetch as unknown as typeof fetch,
});
```

## Authentication

Star Comms uses two token types:

### Owner API Key (`scok_...`)

Used for all `/api/v1/*` endpoints. The shard validates each key against central on first use, then caches verification for ~60 seconds. Keys have scoped permissions.

### Shard Token (`scsh_...`)

Only needed for the `GET /debug` endpoint. Pass it via the `shardToken` config option.

### Owner API Scopes

| Scope | Grants access to |
|-------|-----------------|
| `read:status` | `/status`, `/features`, `/public-token` |
| `read:roster` | `/roster` |
| `read:roster:roles` | Includes Discord role IDs in roster |
| `read:assignments` | `/assignments`, `/rules` |
| `read:events` | `/stream`, `/webhooks` |
| `read:metrics` | `/metrics`, `/metrics/prometheus` |
| `read:audit` | `/audit` |
| `write:assignments` | `/assignments` POST, `/assignments/bulk`, `/assignments/temporary` |
| `write:acars` | `/acars` |
| `write:nets` | `/nets`, `/nets/rename`, `/nets/remove` |
| `write:operation` | `/operation` |
| `write:rules` | `/rules` POST |
| `write:presets` | `/presets` GET/POST/DELETE, apply |
| `write:clients` | `/clients/disconnect` |
| `manage:features` | `/features` POST |

## API Reference

### Public Endpoints (unauthenticated)

| Method | Description |
|--------|-------------|
| `getHealth()` | Shard health, features, and client count |
| `getOpenApiSpec()` | OpenAPI 3.0 spec from the shard |
| `getEmbedStatus(token)` | Public status view (requires signed token) |
| `getEmbedWidget(token)` | Embeddable HTML widget (returns raw HTML string) |

### Status & Roster

| Method | Description |
|--------|-------------|
| `getStatus()` | Net status, occupancy, transmitting operators |
| `getRoster()` | All connected operators with net assignments |

### Assignments

| Method | Description |
|--------|-------------|
| `getAssignments()` | Raw userId → netId[] assignment map |
| `assignNet(userId, netId, action?)` | Assign or unassign a user to a net |
| `bulkAssign(payload)` | Bulk assign/unassign multiple users |
| `temporaryAssign(payload)` | Temporary assignment with auto-expire TTL |

### ACARS Broadcast

| Method | Description |
|--------|-------------|
| `sendAcars(payload)` | Broadcast text alert to all connected operators |

### Nets

| Method | Description |
|--------|-------------|
| `createNet(payload)` | Create a new radio net |
| `renameNet(payload)` | Rename an existing net |
| `removeNet(payload)` | Remove a net by ID |
| `removeNetByRef(ref)` | Remove a net by UID or numeric ID string |

### Operation

| Method | Description |
|--------|-------------|
| `setOperation(payload)` | Open or close the operation |

### Features

| Method | Description |
|--------|-------------|
| `getFeatures()` | Read shard feature toggles |
| `setFeatures(payload)` | Update shard feature toggles |

### Rules

| Method | Description |
|--------|-------------|
| `getRules()` | List role-to-net auto-assignment rules |
| `setRules(payload)` | Replace role-to-net auto-assignment rules |

### Presets

| Method | Description |
|--------|-------------|
| `getPresets()` | List saved operation presets |
| `savePreset(preset)` | Create or replace a preset |
| `applyPreset(name)` | Apply a saved preset |
| `removePreset(name)` | Delete a preset |

### Clients

| Method | Description |
|--------|-------------|
| `disconnectClient(payload)` | Force-disconnect a connected operator |

### Metrics

| Method | Description |
|--------|-------------|
| `getMetrics(sinceMinutes?)` | Occupancy and talk-time metrics (JSON) |
| `getPrometheusMetrics()` | Metrics in Prometheus text format |

### Webhooks

| Method | Description |
|--------|-------------|
| `getWebhooks()` | List registered webhooks |
| `registerWebhook(payload)` | Register an event webhook |
| `removeWebhook(id)` | Remove a webhook |

### Audit

| Method | Description |
|--------|-------------|
| `getAudit(limit?)` | Recent owner API calls |

### Public Token

| Method | Description |
|--------|-------------|
| `getPublicToken()` | Get signed read-only embed token and URLs |

### Debug

| Method | Description |
|--------|-------------|
| `getDebug()` | Full diagnostic snapshot (requires shard token) |

### Archive

| Method | Description |
|--------|-------------|
| `getArchive(query?)` | List archived channels (filter by tag, search, limit) |
| `getArchiveEntry(uid)` | Get a single archived channel |
| `upsertArchive(payload)` | Create or update an archive entry |
| `updateArchiveEntry(uid, payload)` | Update a specific archive entry |
| `deleteArchiveEntry(uid)` | Delete an archived channel |
| `restoreArchiveEntry(uid)` | Restore an archived channel as a live net |
| `getArchiveSyncStatus()` | Archive sync status and pending operations |

### Event Stream (SSE)

| Method | Description |
|--------|-------------|
| `openEventStream()` | Open an SSE event stream (returns raw Response) |

## Error Handling

All methods throw `StarCommsError` on failure:

```typescript
import { StarCommsClient, StarCommsError } from "@starcomms/client";

const client = new StarCommsClient({ /* ... */ });

try {
  await client.assignNet("invalid_user", 99);
} catch (error) {
  if (error instanceof StarCommsError) {
    console.error(`Status: ${error.statusCode}, Message: ${error.message}`);
    // Status: 404, Message: "User not found"
  }
}
```

Error codes:
- `4xx` — shard returned a client error (bad request, unauthorized, not found, etc.)
- `5xx` — shard returned a server error
- `500` with message about configuration — client-side config issue (missing API key, missing shard token)

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Star Comms Central (starcomms.duckdns.org)                     │
│  - Guild config management                                      │
│  - Owner API key (scok_) verification                           │
│  - Shard registry                                               │
└────────────────┬─────────────────────────────┬──────────────────┘
                 │ register (scsh_ token)      │ verify key
                 ▼                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Star Comms Shard (your-host:25588)                             │
│  - WebSocket voice server (/ws)                                 │
│  - UDP voice router (same port)                                 │
│  - Owner HTTP API (/api/v1/*)     ◄── this client talks here   │
│  - Health endpoint (/health)                                    │
│  - SSE event stream (/api/v1/stream)                            │
└─────────────────────────────────────────────────────────────────┘
                 ▲
                 │ HTTP calls
                 │
┌─────────────────────────────────────────────────────────────────┐
│  Your Application (using @starcomms/client)                     │
│  - Bot, dashboard, automation, Discord integration, etc.        │
└─────────────────────────────────────────────────────────────────┘
```

## Key Concepts

### Nets (Radio Channels)

Nets are numbered radio channels (1–50). Each net has an ID, a display name, and optional relay targets. Special nets: Net 250 (Public Net) and Net 255 (Global Alert).

### Operations

The `operationOpen` flag controls whether audio routing is active. When closed, clients connect but cannot transmit.

### ACARS Alerts

Text broadcasts sent to every connected operator's overlay. Rate-limited to 1/minute per key. Max 280 characters, duration 7–10 seconds.

### Temporary Assignments

Assigns a user to a net with automatic unassignment after TTL expires. Minimum 15 seconds, maximum 24 hours.

### Presets

Save and recall full operation configurations (net layout + assignments). Useful for recurring fleet operations with known net structures.

## Rate Limiting

The shard enforces 120 requests/minute per `scok_` key. ACARS broadcasts are additionally limited to 1/minute per key. Exceeding limits returns HTTP 429.

## SSE Event Stream

The `openEventStream()` method returns a raw `Response` object. You're responsible for consuming the stream:

```typescript
const response = await client.openEventStream();
const reader = response.body!.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value, { stream: true });
  // Parse SSE format: "event: ...\ndata: ...\n\n"
  console.log(chunk);
}
```

Events include operator connections/disconnections, net changes, transmission starts/stops, and operation state changes.

## TypeScript Types

All request/response types are exported:

```typescript
import type {
  ShardStatusResponse,
  ShardRosterResponse,
  ShardOperator,
  AcarsPayload,
  BulkAssignmentPayload,
  TemporaryAssignmentPayload,
  OperationPreset,
  // ... all interfaces available
} from "@starcomms/client";
```

## Webhooks

Register webhook URLs to receive HMAC-signed POST callbacks for shard events:

```typescript
await client.registerWebhook({
  url: "https://your-server.com/webhooks/starcomms",
  events: ["operator.connected", "operator.disconnected", "net.created"],
  secret: "your_hmac_secret", // optional, for payload verification
});

const { webhooks, events } = await client.getWebhooks();
console.log("Available event types:", events);
```

## Contributing

Contributions are welcome. Please open an issue or pull request.

## License

MIT
