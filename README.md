# HBM Public Pool

A self-hosted solo Bitcoin mining pool based on [benjamin-wilson/public-pool](https://github.com/benjamin-wilson/public-pool).

## Modifications from upstream

- **MRR compatibility** — Fixed `ttl` field in authorization message that caused Mining Rig Rentals workers to be rejected
- **`/api/pool` endpoint** — Added pool stats endpoint compatible with miningpoolstats.stream
- **`/api/scores` endpoint** — Top 10 all-time best difficulty per worker
- **`/api/scores/device` endpoint** — Top 20 all-time best difficulty per device type
- **Persistent high scores** — Dedicated `high_score_entity` table that survives container restarts

## API Endpoints

| Endpoint               | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `/api/info`            | Current pool info, connected miners, user agents |
| `/api/network`         | Bitcoin network info, block height, difficulty   |
| `/api/pool`            | Pool stats for miningpoolstats.stream            |
| `/api/scores`          | Top 10 all-time best difficulty per worker       |
| `/api/scores/device`   | Top 20 all-time best difficulty per device type  |
| `/api/client/:address` | Per-address worker stats                         |
| `/api/info/chart`      | Hashrate chart data                              |

## Deployment

See [HomeBitcoinMiners.au](https://homebitcoinminers.au) for the live instance.

Stratum endpoints:

- `stratum+tcp://pool.homebitcoinminers.au:3333`
- `stratum+tls://pool.homebitcoinminers.au:4333`

## Docker

```bash
docker pull ghcr.io/homebitcoinminers/public-pool:latest
```

## Environment Variables

See `.env.example` for configuration options.

## Credits

Based on [benjamin-wilson/public-pool](https://github.com/benjamin-wilson/public-pool) — all credit to the original author.
