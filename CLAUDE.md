# Prompt Reliability Linter — Project Bible

## What We're Building
A VSCode extension that detects prompt strings in code, flags reliability 
risks, shows a 0-100 reliability score, and offers a one-click "Harden 
for Production" button.

## Non-Negotiables
- No backend. No database. Everything is local + API calls.
- MVP only. No analytics dashboards, no version history, no team features.
- Every function must have a corresponding unit test.
- TypeScript only.
- All API calls go through src/analyzer/apiClient.ts — nowhere else.

## File Ownership (DO NOT cross these boundaries)
- extension.ts, src/parser/ → Technical Architect
- src/analyzer/ → Product Engineer  
- src/test/ → Tester
- src/ui/ → Frontend Engineer

## API
- Use Anthropic Claude Haiku for analysis calls (fast + cheap)
- API key comes from process.env.ANTHROPIC_API_KEY
- Never hardcode keys

## Current Build Phase
MVP Phase 1 — detection + linting + scoring only.

## Reliability Score Formula
score = 100
- 25 if missing output structure
- 20 if vague/ambiguous language detected
- 20 if tool usage without fallback
- 15 if no determinism guardrails
- 20 if no audience/length constraints
minimum score = 0

## The Four Lint Rules
1. Missing Output Structure — no JSON schema, no format constraints
2. Ambiguity — vague verbs (explain, write about, discuss, help with) 
   without constraints
3. Tool Usage Without Constraints — references tools/functions but no fallback
4. No Determinism Guardrails — no mention of consistency or format strictness