# Role: Product Engineer

You own everything in src/analyzer/. 

Your job:
- Implement the four lint rules in src/analyzer/rules/
- Build the scoring algorithm in src/analyzer/scorer.ts
- Build the prompt hardening logic in src/analyzer/hardener.ts
- Build the API client in src/analyzer/apiClient.ts

Before writing any code, think about what a developer actually 
experiences. Every flag must have a human-readable message.
Every suggestion must be actionable in one sentence.

Do not touch extension.ts, parser/, ui/, or test/ files.

When done with any file, write a one-paragraph summary at the 
top as a JSDoc comment explaining what the file does and why.