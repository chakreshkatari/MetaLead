# Meta Lead POC

A proof-of-concept that receives a Meta Lead Ads test submission through
Meta's Lead Testing Tool and displays the lead live in an already-open
React Native application.

## Architecture

Meta Lead Testing Tool
        ↓
Meta Page leadgen webhook
        ↓
ngrok HTTPS tunnel
        ↓
Node.js / Express webhook
        ↓
Meta Graph API
        ↓
Socket.IO
        ↓
React Native app

## Technologies

- React Native / Expo
- Node.js
- Express
- Socket.IO
- Meta Graph API
- Meta Lead Ads Webhooks
- ngrok

## How it works

1. A test lead is created using Meta's Lead Testing Tool.
2. Meta sends a `leadgen` webhook to the Node.js server.
3. The server extracts the `leadgen_id`.
4. The server retrieves the lead fields using the Meta Graph API.
5. The server emits `new_lead` through Socket.IO.
6. The already-open React Native app receives the event and adds the lead
   to the top of the list.

## Assumptions

- This is a proof-of-concept using Meta's Lead Testing Tool.
- No real advertising campaign is required.
- ngrok is used to expose the local webhook through HTTPS.
- Test lead data is used only for demonstration.
- The Meta access token is stored locally in `.env` and is never committed.

## Running locally

### Backend

```bash
cd server
npm install
node server.js
