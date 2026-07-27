# @30k/starcomm-client

TypeScript client for the [Star Comms](https://star-comms.org) shard Owner API. Zero dependencies, uses native `fetch` (Node 18+, Bun, Deno, browsers).

## Install

```bash
pnpm add @30k/starcomm-client
```

## Usage

```typescript
import { StarCommsClient } from "@30k/starcomm-client";

const client = new StarCommsClient({
  baseUrl: "http://your-shard:25588",
  ownerApiKey: "scok_your_key_here",
});

const status = await client.status.get();
await client.assignments.assign("discord_user_id", 1);
await client.comms.sendAcars("Fleet departing!");
```

## Docs

Full API documentation: [30k-inc.github.io/starcomm-client](https://30k-inc.github.io/starcomm-client/index.html)

## Config

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | `string` | — | Shard URL (no trailing slash) |
| `ownerApiKey` | `string` | — | Owner key (`scok_...`) |
| `serviceKey` | `string?` | — | Service key (`scsk_...`) for audio listening |
| `shardToken` | `string?` | — | Shard token for debug endpoint |
| `timeoutMs` | `number?` | `10000` | Request timeout |
| `connectTimeoutMs` | `number?` | `30000` | Connection timeout for streaming endpoints |
| `fetch` | `typeof fetch?` | `globalThis.fetch` | Custom fetch impl |

## Audio Listener

Listen-only voice connection that receives Opus audio frames and PTT events from shard nets. Requires a service key (`scsk_...`) obtained from the shard API key management.

```typescript
const client = new StarCommsClient({
  baseUrl: "http://your-shard:25588",
  ownerApiKey: "scok_...",
  serviceKey: "scsk_...",
});

// Event handlers
client.audio.on("ptt.start", (evt) => {
  console.log(`${evt.displayName} keyed up on net ${evt.netId}`);
});

client.audio.on("ptt.stop", (evt) => {
  console.log(`${evt.displayName} stopped on net ${evt.netId}`);
});

client.audio.on("audio", (frame) => {
  // frame.netId — which net
  // frame.userId — who's transmitting
  // frame.opus  — raw Opus data (Uint8Array)
});

// Lifecycle events
client.audio.on("connected", ({ guildId }) => console.log("Connected to", guildId));
client.audio.on("disconnected", ({ reason }) => console.warn("Lost:", reason));
client.audio.on("reconnected", ({ attempt }) => console.log("Back after", attempt, "tries"));
client.audio.on("error", ({ reason }) => console.error(reason));

// Connect and listen on specific nets
await client.audio.listen({
  guildId: "your_guild_id",
  nets: [1, 2, 3],
});

// Dynamic net management (no reconnect needed)
await client.audio.addNet(4);
await client.audio.removeNet(1);
client.audio.nets; // [2, 3, 4]

// Stop and cleanup
await client.audio.stop();
```

### Audio Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `guildId` | `string` | — | Discord guild ID |
| `nets` | `number[]?` | `[]` | Initial nets to listen on |
| `displayName` | `string?` | `""` | Name shown in shard roster |
| `autoReconnect` | `boolean?` | `true` | Reconnect on connection loss |
| `initialDelayMs` | `number?` | `2000` | First reconnect delay |
| `maxDelayMs` | `number?` | `30000` | Max reconnect delay |
| `maxAttempts` | `number?` | `Infinity` | Max reconnect attempts |

## Event Stream & Reconnection

The client includes a built-in SSE event stream with automatic reconnection:

```typescript
// Listen for events
client.on("user.joined", (event) => {
  console.log(event.data.displayName, "connected");
});

client.on("ready-check.started", (event) => {
  console.log(`Ready check initiated by ${event.data.initiatorName}, ${event.data.participantCount} participants`);
});

client.on("ready-check.completed", (event) => {
  const { summary } = event.data;
  console.log(`Ready check done: ${summary.ready}/${summary.total} ready`);
});

// Lifecycle hooks
client.onLifecycle("stream.disconnected", ({ reason }) => {
  console.warn("Stream lost:", reason);
});
client.onLifecycle("stream.reconnected", ({ attempt }) => {
  console.log("Back online after", attempt, "attempts");
});

// Connect with reconnection options (all optional)
await client.connect({
  autoReconnect: true,   // default: true
  initialDelayMs: 1000,  // default: 1000
  maxDelayMs: 30000,     // default: 30000
  maxAttempts: Infinity,  // default: Infinity
});

// Intentional disconnect (won't trigger reconnection)
client.disconnect();
```

## Ready Checks

20-second attendance polls targeting connected operators. Templates define reusable configs; sessions are live instances.

```typescript
// List templates
const { readyChecks } = await client.readyChecks.list();

// Create a template
const { readyCheck } = await client.readyChecks.upsert({
  message: "Fleet departing in 2 minutes — confirm ready",
  color: "#34CD84",
  target: { everyone: true },
});

// Start a session
const { session, summary } = await client.readyChecks.start(readyCheck.id, "Fleet Commander");
console.log(`${summary.total} participants, expires at ${session.expiresAt}`);

// Poll session status
const status = await client.readyChecks.getSession(session.id);
console.log(`${status.summary.ready}/${status.summary.total} ready`);

// Remove a template
await client.readyChecks.remove(readyCheck.id);
```

## ACARS Alerts

Broadcast short text alerts to all connected operators:

```typescript
await client.comms.sendAcars("Fleet departing in 60 seconds", {
  senderName: "Fleet Commander",
  durationMs: 8500,
  alertType: "emergency", // "critical" | "emergency" | "non-emergency"
});
```

## Error Handling

All methods throw `StarCommsError` on failure:

```typescript
import { StarCommsError } from "@30k/starcomm-client";

try {
  await client.assignments.assign("bad_id", 99);
} catch (err) {
  if (err instanceof StarCommsError) {
    console.error(err.statusCode, err.message);
  }
}
```

## SSE Event Types

| Event | Data Fields |
|-------|-------------|
| `user.joined` | `userId`, `displayName`, `transport`, `nets` |
| `user.left` | `userId`, `displayName`, `transport` |
| `ptt.start` | `userId`, `displayName`, `netId` |
| `ptt.stop` | `userId`, `displayName`, `netId`, `reason?` |
| `operation.opened` | `open` |
| `operation.closed` | `open` |
| `assignments.changed` | `source?`, `action?`, `userId?`, `netId?`, `keyId?` |
| `config.changed` | `keyId?`, `action?`, `uid?`, `preset?` |
| `client.disconnected` | `userId`, `keyId`, `disconnected` |
| `acars.sent` | `id`, `text`, `durationMs`, `alertType`, `senderId`, `senderName`, `source`, `routed` |
| `ready-check.configured` | `templateId`, `keyId?` |
| `ready-check.removed` | `templateId`, `keyId?` |
| `ready-check.started` | `sessionId`, `templateId`, `initiatorId`, `initiatorName`, `participantCount`, `expiresAt` |
| `ready-check.response` | `sessionId`, `userId`, `name`, `status`, `respondedAt` |
| `ready-check.completed` | `sessionId`, `templateId`, `summary` |

## License

MIT
