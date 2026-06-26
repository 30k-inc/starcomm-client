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

## Sub-Resources

Methods are organized into namespaced resources:

| Resource | Purpose |
|----------|---------|
| `client.status` | Health, status, roster, embed |
| `client.assignments` | Assign/unassign users to nets |
| `client.nets` | Create, rename, remove nets |
| `client.operations` | Open/close operation, features, rules |
| `client.presets` | Save/apply/remove operation presets |
| `client.comms` | ACARS broadcasts, disconnect clients |
| `client.metrics` | Performance metrics, audit log, debug |
| `client.webhooks` | Register/remove event webhooks |
| `client.archive` | Net archive CRUD + sync status |
| `client.stream` | SSE event stream, public token |

## Docs

Full API documentation is generated from JSDoc using [TypeDoc](https://typedoc.org):

```bash
pnpm run docs
```

Output is written to `docs/`. Open `docs/index.html` to browse.

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
| `fetch` | `typeof fetch?` | `globalThis.fetch` | Custom fetch impl |

## License

MIT
