# Overlap

An English-language mobile prototype for informal workplace connection. It builds on the previous neutral/violet design and adds conversation-led intent capture with editable cards.

## Try it

The local preview runs at http://127.0.0.1:4173/.

- “Lunch at twelve, with one other person.” Then: “Actually, four people please.”
- “A coffee chat about moving from design to product.”
- “A slow walk after work, anyone up for it?”

You can also use the Lunch/Coffee shortcuts, Create menu, Calendar, Inbox and profile onboarding.

All data is simulated and resets on reload. AI interpretation is a limited local rule-based prototype. No messages or invitations are sent externally. Use the explicitly labeled prototype controls to simulate other participants accepting.

## Development

`npm run dev -- --host 127.0.0.1 --port 4173 --strictPort`

`npm run build`

App-owned files: `src/Prototype.tsx`, `src/prototype.css`. Preserve the bundled mobile runtime. See `design-qa.md` for browser verification and scope.
