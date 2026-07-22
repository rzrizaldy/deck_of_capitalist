import { describe, expect, it } from 'vitest';
import { MARKET_DIFFICULTY, MARKET_TARGETS, marketTarget, priceFor, scoreHand } from '../src/game/engine';
import { createRun, gameReducer } from '../src/game/reducer';
import type { Card, Difficulty, GameState, Tycoon } from '../src/game/types';

/**
 * Headless balance harness.
 *
 * Plays deterministic greedy-best-hand runs and reports how often each market
 * is cleared at every difficulty. This is the evidence used to tune
 * MARKET_TARGETS: if a specific round shows a wall, it shows up here as a
 * collapse in the per-round clear rate.
 */

const RUNS = 120;
const MAX_SELECTION = 5;

/** Every non-empty subset of up to five cards, as index lists. */
function subsets(size: number): number[][] {
  const output: number[][] = [];
  const walk = (start: number, current: number[]) => {
    if (current.length > 0) output.push([...current]);
    if (current.length === MAX_SELECTION) return;
    for (let index = start; index < size; index += 1) {
      current.push(index);
      walk(index + 1, current);
      current.pop();
    }
  };
  walk(0, []);
  return output;
}

const SUBSETS_BY_SIZE = new Map<number, number[][]>();
function subsetsFor(size: number): number[][] {
  let cached = SUBSETS_BY_SIZE.get(size);
  if (!cached) { cached = subsets(size); SUBSETS_BY_SIZE.set(size, cached); }
  return cached;
}

function bestPlay(hand: Card[], tycoons: Tycoon[]): { cards: Card[]; total: number } {
  let best: { cards: Card[]; total: number } = { cards: [], total: -1 };
  for (const indices of subsetsFor(hand.length)) {
    const cards = indices.map((index) => hand[index]);
    const total = scoreHand(cards, tycoons).total;
    if (total > best.total) best = { cards, total };
  }
  return best;
}

function select(state: GameState, cards: Card[]): GameState {
  return cards.reduce((current, card) => gameReducer(current, { type: 'TOGGLE_CARD', cardId: card.instanceId }), state);
}

/** Cards the best play does not use, worst first — the natural discard set. */
function deadWeight(hand: Card[], keep: Card[]): Card[] {
  const kept = new Set(keep.map((card) => card.instanceId));
  return hand
    .filter((card) => !kept.has(card.instanceId))
    .sort((a, b) => (a.chips + a.bonus) - (b.chips + b.bonus))
    .slice(0, MAX_SELECTION);
}

/**
 * `skilled` uses discards and buys helpers; `naive` never discards and never
 * shops, which brackets the range of play the targets have to survive.
 */
type Policy = 'skilled' | 'naive';

function playRound(state: GameState, policy: Policy): GameState {
  let current = state;
  while (current.phase === 'playing' && current.player.handsLeft > 0) {
    const target = marketTarget(current.round, current.difficulty);
    const needed = Math.max(0, target - current.player.score);
    const pace = needed / current.player.handsLeft;
    let best = bestPlay(current.player.hand, current.player.tycoons);

    // Redraw while the best available hand is well short of the pace we need.
    while (policy === 'skilled' && current.player.discardsLeft > 0 && best.total < pace * 0.85) {
      const junk = deadWeight(current.player.hand, best.cards);
      if (!junk.length) break;
      const after = gameReducer(select(current, junk), { type: 'PLAYER_DISCARD' });
      if (after === current) break;
      current = after;
      best = bestPlay(current.player.hand, current.player.tycoons);
    }

    current = gameReducer(select(current, best.cards), { type: 'PLAYER_PLAY' });
  }
  return current;
}

/** Spend down: cheapest useful Tycoon first, then renovate the best deed. */
function shopTurn(state: GameState, policy: Policy): GameState {
  let current = state;
  if (policy === 'naive') return gameReducer(current, { type: 'NEXT_ROUND' });
  const offers = [...(current.shop?.tycoons ?? [])].sort((a, b) => a.cost - b.cost);
  for (const tycoon of offers) {
    if (current.player.tycoons.length >= 5) break;
    if (current.player.cash < priceFor(current.player, tycoon.cost)) continue;
    current = gameReducer(current, { type: 'BUY_TYCOON', tycoonId: tycoon.id });
  }
  const richest = [...current.player.hand, ...current.player.drawPile, ...current.player.discardPile]
    .sort((a, b) => (b.chips + b.bonus) - (a.chips + a.bonus))[0];
  if (richest && current.player.cash >= priceFor(current.player, 4)) {
    current = gameReducer(current, { type: 'RENOVATE', cardId: richest.instanceId });
  }
  return gameReducer(current, { type: 'NEXT_ROUND' });
}

interface RunOutcome { reached: number; won: boolean }

function simulate(difficulty: Difficulty, seed: number, policy: Policy): RunOutcome {
  let state = createRun(difficulty, seed);
  for (let guard = 0; guard < 32; guard += 1) {
    if (state.phase === 'playing') { state = playRound(state, policy); continue; }
    if (state.phase === 'shop') { state = shopTurn(state, policy); continue; }
    break;
  }
  return { reached: state.phase === 'victory' ? MARKET_TARGETS.length : state.round - 1, won: state.phase === 'victory' };
}

interface Report { difficulty: Difficulty; policy: Policy; clearedPerRound: number[]; winRate: number }

function report(difficulty: Difficulty, policy: Policy): Report {
  const clearedPerRound = new Array(MARKET_TARGETS.length).fill(0);
  let wins = 0;
  for (let seed = 1; seed <= RUNS; seed += 1) {
    const outcome = simulate(difficulty, seed * 7919, policy);
    for (let round = 0; round < outcome.reached; round += 1) clearedPerRound[round] += 1;
    if (outcome.won) wins += 1;
  }
  return { difficulty, policy, clearedPerRound: clearedPerRound.map((count) => count / RUNS), winRate: wins / RUNS };
}

const DIFFICULTIES: Difficulty[] = ['casual', 'trader', 'tycoon'];

describe('market target balance', () => {
  const skilled = DIFFICULTIES.map((difficulty) => report(difficulty, 'skilled'));
  const naive = DIFFICULTIES.map((difficulty) => report(difficulty, 'naive'));

  it('reports clear rates per difficulty and policy', () => {
    const line = (result: Report) => {
      const perRound = result.clearedPerRound.map((rate, index) => `M${index + 1} ${(rate * 100).toFixed(0).padStart(3)}%`).join(' ');
      return `  ${MARKET_DIFFICULTY[result.difficulty].label.padEnd(11)} win ${(result.winRate * 100).toFixed(0).padStart(3)}%  ${perRound}`;
    };
    console.log([
      `\nbest-hand simulation, ${RUNS} deterministic seeds per difficulty`,
      'skilled (uses discards + hires Tycoons):',
      ...skilled.map(line),
      'naive (never discards, never shops):',
      ...naive.map(line),
      '',
    ].join('\n'));
    expect(skilled).toHaveLength(3);
  }, 120_000);

  it('is clearable end to end on every difficulty', () => {
    skilled.forEach((result) => {
      expect(result.winRate, `${result.difficulty} skilled win rate`).toBeGreaterThan(0.5);
    });
  }, 120_000);

  it('rewards discards and Tycoon hires over naive play', () => {
    DIFFICULTIES.forEach((_, index) => {
      expect(skilled[index].winRate).toBeGreaterThanOrEqual(naive[index].winRate);
    });
  }, 120_000);

  it('gets no easier as difficulty rises', () => {
    [skilled, naive].forEach(([casual, trader, tycoon]) => {
      expect(casual.winRate).toBeGreaterThanOrEqual(trader.winRate);
      expect(trader.winRate).toBeGreaterThanOrEqual(tycoon.winRate);
    });
  }, 120_000);

  it('has no single round that walls the run off', () => {
    skilled.forEach((result) => {
      result.clearedPerRound.forEach((rate, index) => {
        if (index === 0) return;
        const previous = result.clearedPerRound[index - 1];
        if (previous < 0.05) return;
        expect(rate / previous, `${result.difficulty} market ${index + 1} survival`).toBeGreaterThan(0.2);
      });
    });
  }, 120_000);
});
