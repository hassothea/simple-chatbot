# Light Chat

A simple light-blue chatbot with a texting feel. Type or attach a file (txt, md, csv, json, images).

## Deploy to Vercel
1. Push this folder to GitHub (or run `npx vercel` inside it).
2. Import the repo in Vercel. No build settings needed: `public/` is served as the site and `api/chat.js` as the backend.

## Customize the conversation
Edit `conversation.js`: greeting, rules (regex -> replies), and fallback. Each reply is a list of short messages sent one by one.

## Optional AI replies
Add `ANTHROPIC_API_KEY` (and optionally `MODEL`) in Vercel project settings > Environment Variables. Without it, the bot uses your predefined conversation.

## Local test
`npx vercel dev`
