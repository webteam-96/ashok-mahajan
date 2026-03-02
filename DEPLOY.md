# Deployment Guide — IIS + Windows Server

## What goes on the server

Copy these folders/files to `C:\Inetpub\vhosts\ashokmahajan.in\httpdocs\`:

```
httpdocs/
├── server.js                   ← from .next/standalone/server.js
├── node_modules/               ← from .next/standalone/node_modules/
├── .next/
│   └── static/                 ← from .next/static/ (copy entire folder here)
├── public/                     ← your public/ folder (images, uploads, etc.)
├── prisma/
│   └── dev.db                  ← your SQLite database
├── web.config                  ← IIS ARR config (this file)
└── ecosystem.config.js         ← PM2 config
```

## Step 1 — Install Node.js on the server

Download and install Node.js 20 LTS from https://nodejs.org
Verify: `node -v` and `npm -v`

## Step 2 — Install PM2 globally

```cmd
npm install -g pm2
```

## Step 3 — Edit ecosystem.config.js

Open `ecosystem.config.js` and set:
- `NEXTAUTH_SECRET` — any long random string (e.g. 32+ random chars)
- `NEXTAUTH_URL` — `https://www.ashokmahajan.in`
- `DATABASE_URL` — path to your SQLite DB: `file:./prisma/dev.db`
- `ADMIN_PASSWORD` — your admin password

## Step 4 — Start the app with PM2

```cmd
cd C:\Inetpub\vhosts\ashokmahajan.in\httpdocs
pm2 start ecosystem.config.js
```

Check it's running:
```cmd
pm2 list
pm2 logs ashokmahajan
```

Test Node.js is listening:
```cmd
curl http://localhost:3000
```

## Step 5 — Enable ARR Proxy in IIS Manager

1. Open IIS Manager
2. Click the server node (top level) → **Application Request Routing Cache**
3. Click **Server Proxy Settings** in the right panel
4. Check **Enable proxy** → Apply

## Step 6 — Verify web.config is in httpdocs

The `web.config` file rewrites all requests to `http://localhost:3000`.
Make sure it's in the root of your httpdocs folder.

## Step 7 — Auto-start on reboot

```cmd
pm2 startup
pm2 save
```

PM2 will generate a command — run it as Administrator.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| 502 Bad Gateway | Run `pm2 list` — is the app running? |
| App crashes | Run `pm2 logs ashokmahajan` to see errors |
| Database error | Check `prisma/dev.db` exists and `DATABASE_URL` path is correct |
| Auth not working | Check `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set correctly |
| Static files 404 | Ensure `.next/static/` is at `httpdocs/.next/static/` |
