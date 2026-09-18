# Jev trolley experiment

A minimal Three.js trolley experiment. Jev chooses whether the train should
continue on its current track or switch to an alternate track.

The scenario has five people on the current track and one person on the
alternate track.

## Setup

Install the dependencies:

```sh
npm install
```

Copy `.env.example` to `.env` and add your Vercel AI Gateway API key:

```sh
cp .env.example .env
```

```env
AI_GATEWAY_API_KEY=your_api_key
```

## Run

```sh
npm start
```

Open <http://localhost:3000>.
