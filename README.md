# HBM Public Pool

A self-hosted solo Bitcoin mining pool based on [benjamin-wilson/public-pool](https://github.com/benjamin-wilson/public-pool).

## Modifications from upstream

- **MRR compatibility** — Fixed `ttl` field in authorization message that caused Mining Rig Rentals workers to be rejected
- **`/api/pool` endpoint** — Added pool stats endpoint compatible with miningpoolstats.stream
- **`/api/scores` endpoint** — Top 20 all-time best difficulty per worker
- **`/api/scores/device` endpoint** — Top 40 all-time best difficulty per device type
- **Persistent high scores** — Dedicated `high_score_entity` table that survives container restarts

## API Endpoints

| Endpoint               | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `/api/info`            | Current pool info, connected miners, user agents |
| `/api/network`         | Bitcoin network info, block height, difficulty   |
| `/api/pool`            | Pool stats for miningpoolstats.stream            |
| `/api/scores`          | Top 20 all-time best difficulty per worker       |
| `/api/scores/device`   | Top 40 all-time best difficulty per device type  |
| `/api/client/:address` | Per-address worker stats                         |
| `/api/info/chart`      | Hashrate chart data                              |

## Environment Variables

| Variable               | Description               | Example                           |
| ---------------------- | ------------------------- | --------------------------------- |
| `BITCOIN_RPC_URL`      | Bitcoin node RPC URL      | `http://192.168.x.x`              |
| `BITCOIN_RPC_PORT`     | Bitcoin node RPC port     | `8332`                            |
| `BITCOIN_RPC_USER`     | Bitcoin node RPC username | `miningpool`                      |
| `BITCOIN_RPC_PASSWORD` | Bitcoin node RPC password | `yourpassword`                    |
| `BITCOIN_RPC_TIMEOUT`  | RPC timeout in ms         | `10000`                           |
| `API_PORT`             | Backend API port          | `3334`                            |
| `STRATUM_PORT`         | Stratum port              | `3333`                            |
| `NETWORK`              | Bitcoin network           | `mainnet`                         |
| `API_SECURE`           | Enable HTTPS on API       | `false`                           |
| `ENABLE_SOLO`          | Enable solo mining        | `true`                            |
| `NODE_APP_INSTANCE`    | Instance number           | `0`                               |
| `DEV_FEE_ADDRESS`      | Address for dev fee       | `bc1q...`                         |
| `POOL_IDENTIFIER`      | Pool identifier string    | `Public-Pool Home Bitcoin Miners` |
| `NODE_ENV`             | Node environment          | `production`                      |

## Docker

```bash
docker pull ghcr.io/homebitcoinminers/public-pool:latest
```

## Deployment

See [HomeBitcoinMiners.au](https://homebitcoinminers.au) for the live instance.

Stratum endpoints:

- `stratum+tcp://pool.homebitcoinminers.au:3333`
- `stratum+tls://pool.homebitcoinminers.au:4333`

## Credits

Based on [benjamin-wilson/public-pool](https://github.com/benjamin-wilson/public-pool) — all credit to the original author.
