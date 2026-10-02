# Laberflash - Unlimited

Browserless AT automation running on Cloudflare Workers.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Maxwells-Demon/Laberflash)

## Deploy

Make this repository public, then click **Deploy to Cloudflare**. Cloudflare can clone the repository, provision declared resources such as the Durable Object namespace, and deploy the Worker.

After deployment:

1. Open the Worker URL.
2. Choose an admin password.
3. Add one or more AT username/password combinations.
4. Set the interval in seconds.
5. Set the minimum remaining data in MB.
6. Click **Start**.

The scheduler then runs in the background. A manual **Run now** button is also available.

## Features

- Password-protected web interface.
- Multiple AT accounts.
- Encrypted AT passwords using AES-256-GCM.
- Configurable interval and minimum remaining data.
- Start/stop/manual-run controls.
- Automatic contract ID recovery through `navigation-list`.
- Current offer ID is taken from the offers response; no separate offer-ID request.
- Remaining data is calculated as `allocated - used`.
- Calls `updateUnlimited` only below the configured minimum.
- Durable Object alarm scheduling; no always-running server is required.

## Settings

- **Interval:** seconds between account checks; minimum 30 seconds.
- **Minimum MB:** trigger threshold.
- **Amount KB:** `amount` sent to `updateUnlimited`, default 1048576.
- **Refill threshold KB:** `refillThresholdValue`, default 1048576.
- **updateOfferResourceID:** default 172.

## Architecture

```
Browser
  -> Cloudflare Worker
  -> Scheduler Durable Object
       -> private SQLite storage
       -> alarm scheduler
       -> AT authentication/API
```

The Durable Object is deliberately a single scheduler instance. Account checks are processed sequentially, avoiding concurrent logins and making the scheduling state strongly consistent.

## Security

The admin password is stored as a PBKDF2 verifier. AT passwords are encrypted at rest with AES-256-GCM using a randomly generated key kept in the Durable Object's private storage. The web session uses an HttpOnly, Secure, SameSite cookie.

This keeps credentials out of GitHub and Wrangler configuration. Anyone with administrative control of the Cloudflare Worker can ultimately access its runtime and storage, so use a strong unique admin password.

## Development

```sh
npm install
npm run dev
```

Deployment:

```sh
npm run deploy
```

Dry bundle check:

```sh
npm run dry-run
```
