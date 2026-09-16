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

## Project Structure

```text
MetaLead/
├── mobile/                 # React Native / Expo application
│   └── src/app/index.tsx   # Main leads screen and Socket.IO listener
├── server/                 # Node.js backend
│   ├── server.js           # Webhook, Graph API and Socket.IO logic
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
├── index.html              # Privacy policy
├── data-deletion.html      # Data deletion instructions
└── README.md
```

## Running Locally
### Backend
```bash
cd server
npm install
node server.js
```
### ngrok
```bash
ngrok http 3000
```

Use the HTTPS forwarding URL as the Meta webhook callback URL.

### Mobile App
```bash
cd mobile
npm install
npx expo start
```
Open the project in Expo Go on an Android phone connected to the same
Wi-Fi network as the computer.

## Environment Variables

Create a file named `.env` inside the `server` folder:

```text
META_PAGE_ACCESS_TOKEN=YOUR_TOKEN
```

Never commit `.env` to GitHub.

## Meta Configuration
- Meta App: `Leads Test`
- Page: `Meta Leads Test Page`
- Lead Form: `Meta Lead POC Form`
- Webhook Field: `leadgen`

## Demo Result

A test lead submitted through Meta's Lead Testing Tool is received by the
Node.js webhook, retrieved through the Meta Graph API, and displayed live
in the already-open React Native application through Socket.IO.

The phone does not need to be touched after the test lead is submitted.
