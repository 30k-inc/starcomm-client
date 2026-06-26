# @30k/starcomm-client

TypeScript client for the [Star Comms](https://starcomms.duckdns.org) shard Owner API. Zero dependencies, uses native `fetch` (Node 18+, Bun, Deno, browsers).

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
await client.assignments.set("discord_user_id", 1);
await client.comms.sendAcars({ text: "Fleet departing!" });
```

## Docs

Full API documentation: [30k-inc.github.io/starcomm-client](https://30k-inc.github.io/starcomm-client/index.html)

## Error Handling

All methods throw `StarCommsError` on failure:

```typescript
import { StarCommsError } from "@30k/starcomm-client";

try {
  await client.assignments.set("bad_id", 99);
} catch (err) {
  if (err instanceof StarCommsError) {
    console.error(err.statusCode, err.message);
  }
}
```

## Config

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | `string` | — | Shard URL (no trailing slash) |
| `ownerApiKey` | `string` | — | Owner key (`scok_...`) |
| `shardToken` | `string?` | — | Shard token for debug endpoint |
| `timeoutMs` | `number?` | `10000` | Request timeout |
| `connectTimeoutMs` | `number?` | `30000` | Connection timeout for streaming endpoints |
| `fetch` | `typeof fetch?` | `globalThis.fetch` | Custom fetch impl |

## Event Stream & Reconnection

The client includes a built-in SSE event stream with automatic reconnection:

```typescript
// Listen for events
client.on("user.joined", (event) => {
  console.log(event.data.displayName, "connected");
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

## License

MIT
