# Deck of Capitalist

A browser-based, pixel-noir property roguelike set above nighttime Jakarta. Build portfolios, hire Tycoons, tune a persistent 40-card deck, and clear eight escalating market targets.

## Play

**[Play Deck of Capitalist](https://deck-of-capitalist.allrize.tech)** — the live DigitalOcean App Platform URL.

The custom domain is the App Platform primary domain. Its CNAME points to `deck-of-capitalist-dkk8u.ondigitalocean.app`, and App Platform has issued the HTTPS certificate.

The whole game runs solo: there is no rival, no bot, and no online opponent. Difficulty changes the market target thresholds only.

Gameplay is locked to a landscape canvas. Desktop centres that canvas; landscape mobile fills it. Portrait mobile shows a rotation prompt while preserving the current run.

## Rules

Each market gives you an independently shuffled copy of the persistent deck, an eight-card hand, four scoring plays, and three discard actions. Select one to five cards. A published Market Target is the only win condition: clear it by the end of your fourth hand. Market difficulty changes only those targets: Street is 80%, Market is 100%, and High Stakes is 125%.

| Portfolio | Requirement | Multiplier |
| --- | --- | ---: |
| Liquidation | No matching group | ×1 |
| Development | One incomplete pair | ×2 |
| Joint Venture | Two separate pairs | ×3 |
| Monopoly | One complete asset group | ×5 |
| Conglomerate | Complete group plus another pair | ×7 |
| Diversified Portfolio | Five distinct groups | ×8 |
| Transport Network | Four distinct railroads | ×12 |

Scoring is `(card chips + chip bonuses) × (base multiplier + multiplier bonuses) × multiplicative effects`.

Winning opens the Night Market. Hire up to five illustrated Tycoon helpers, acquire deeds, renovate one deed by `+5` chips, liquidate one deed while the deck remains above 32 cards, or reroll the offers. You begin with `$4` and receive `$5 + interest` after each cleared market. Hired Tycoons stay visible at the centre of the table and apply their effects to matching portfolios.

## Development

```bash
npm install
npm run dev
npm run check
npm run test:e2e
```

The project uses React, TypeScript, Vite, Vitest, and Playwright. Saves are versioned in browser local storage. The application has no backend, accounts, analytics, or online leaderboard.

`tests/balance.test.ts` is a headless simulation harness: it plays deterministic greedy-best-hand runs across every difficulty and reports the per-round clear rate, which is how `MARKET_TARGETS` is tuned. Run `npx vitest run tests/balance.test.ts --reporter=verbose` to see the table.

All audio is generated procedurally with the Web Audio API — there are no binary audio assets. Volume, mute, and the ambient music loop are exposed on the title screen and in the in-game HUD, and persist in local storage.

## Deployment

`.do/app.yaml` defines a DigitalOcean App Platform static site. It builds with `npm ci && npm run build`, publishes `dist`, and falls back to `index.html` for client-side navigation. App Platform is the only deployment target for this project.

The app source is a plain git clone URL rather than a GitHub App integration, so pushing to `main` does not auto-deploy. Trigger a release explicitly:

```bash
doctl apps create-deployment 05e14d75-9c66-4ff9-a0ad-cc4da677b465 --wait
```

## Artwork

The table, ending scenes, all 32 unique deed-card illustrations, and 10 unique Tycoon helper-card illustrations are original pixel-noir assets generated for this project with OpenAI ImageGen. The UI and scoring visuals remain code-native for legibility and responsive behavior.
