# Deploy — nurul.com.bd

Ubuntu + nginx + PM2. Canonical host is `nurul.com.bd`; `nurul.dev` 301-redirects to it.

```
client → nginx :443 (TLS, gzip, cache)
       → 127.0.0.1:3000  (next start, managed by PM2: process "nurul")
```

## Prerequisites (one-time, on the server)

```bash
# Node 22 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx git certbot python3-certbot-nginx

# PM2 (global)
sudo npm install -g pm2

# App user
sudo adduser --system --group --home /var/www/nurul --shell /bin/bash nurul
sudo mkdir -p /var/www/nurul /var/www/certbot /var/log/pm2
sudo chown -R nurul:nurul /var/www/nurul /var/log/pm2
```

DNS — point all four records at the server IP before issuing certs:

| Host | Type | Value |
| --- | --- | --- |
| `nurul.com.bd` | A | server IP |
| `www.nurul.com.bd` | A | server IP |
| `nurul.dev` | A | server IP |
| `www.nurul.dev` | A | server IP |

## First-time setup

```bash
# 1) Clone as the nurul user
sudo -u nurul git clone https://github.com/nurul-islam01/protfolio.git /var/www/nurul
cd /var/www/nurul

# 2) Env file (NOT in git)
sudo -u nurul tee /var/www/nurul/.env.local >/dev/null <<'EOF'
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=nurul.islam3f@gmail.com
CONTACT_FROM_EMAIL=hello@nurul.com.bd
NEXT_PUBLIC_SITE_URL=https://nurul.com.bd
EOF
sudo chmod 600 /var/www/nurul/.env.local
sudo chown nurul:nurul /var/www/nurul/.env.local

# 3) Install + build
sudo -u nurul npm ci
sudo -u nurul npm run build

# 4) Start with PM2 (as the nurul user)
sudo -u nurul -H pm2 start /var/www/nurul/deploy/ecosystem.config.cjs
sudo -u nurul -H pm2 save
sudo -u nurul -H pm2 status         # should show "online"
curl -I http://127.0.0.1:3000       # should return 200

# 5) Make PM2 survive reboots — run the command pm2 prints
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u nurul --hp /var/www/nurul
# (run the exact line the previous command echoes back)

# 6) nginx — bootstrap an HTTP-only server first so certbot can complete http-01
sudo tee /etc/nginx/sites-available/nurul-bootstrap >/dev/null <<'EOF'
server {
    listen 80;
    server_name nurul.com.bd www.nurul.com.bd nurul.dev www.nurul.dev;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 404; }
}
EOF
sudo ln -sf /etc/nginx/sites-available/nurul-bootstrap /etc/nginx/sites-enabled/nurul
sudo nginx -t && sudo systemctl reload nginx

# 7) Let's Encrypt — one cert per apex (covers its www)
sudo certbot certonly --webroot -w /var/www/certbot \
  -d nurul.com.bd -d www.nurul.com.bd \
  --agree-tos -m nurul.islam3f@gmail.com --no-eff-email

sudo certbot certonly --webroot -w /var/www/certbot \
  -d nurul.dev -d www.nurul.dev \
  --agree-tos -m nurul.islam3f@gmail.com --no-eff-email

# 8) Swap in the real nginx config
sudo cp deploy/nginx.conf /etc/nginx/sites-available/nurul
sudo ln -sf /etc/nginx/sites-available/nurul /etc/nginx/sites-enabled/nurul
sudo rm -f /etc/nginx/sites-enabled/default /etc/nginx/sites-available/nurul-bootstrap
sudo nginx -t && sudo systemctl reload nginx

# 9) Sanity
curl -I https://nurul.com.bd
curl -I https://nurul.dev          # expect 301 -> https://nurul.com.bd/
curl -I https://www.nurul.com.bd   # expect 301 -> https://nurul.com.bd/
```

Certbot installs a systemd timer (`certbot.timer`) that auto-renews twice daily. Verify:

```bash
sudo systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

## Routine deploys

```bash
sudo -u nurul -H /var/www/nurul/deploy/deploy.sh
```

The script does: `git reset --hard origin/main` → `npm ci` → `npm run build` → `pm2 reload nurul --update-env` → `pm2 save`. Zero-downtime reload is fine for fork mode with a single instance — PM2 swaps the new process in once it's healthy.

## Updating env vars

```bash
sudo -u nurul nano /var/www/nurul/.env.local
sudo -u nurul -H pm2 reload nurul --update-env
```

Next.js reads `.env.local` at server startup, so a reload is enough. **Rebuild** (`npm run build`) is only required when you change a `NEXT_PUBLIC_*` value — those are inlined into the client bundle at build time.

## PM2 cheat sheet

```bash
sudo -u nurul -H pm2 status
sudo -u nurul -H pm2 logs nurul              # tail combined logs
sudo -u nurul -H pm2 logs nurul --lines 200
sudo -u nurul -H pm2 reload nurul            # graceful (zero-downtime)
sudo -u nurul -H pm2 restart nurul           # hard restart
sudo -u nurul -H pm2 stop nurul
sudo -u nurul -H pm2 delete nurul            # remove from process list
sudo -u nurul -H pm2 monit                   # interactive dashboard
sudo -u nurul -H pm2 save                    # persist process list
```

Log files (also tailable via `pm2 logs`):

```
/var/log/pm2/nurul.out.log
/var/log/pm2/nurul.err.log
```

## nginx logs & debugging

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
curl -I http://127.0.0.1:3000     # is the upstream alive?
sudo nginx -t                     # config sanity
```

Common gotchas:

- **502 from nginx** — PM2 process is down or not bound to 127.0.0.1:3000. Check `pm2 status` + `pm2 logs nurul`.
- **PM2 doesn't restart after reboot** — you skipped step 5. Re-run `pm2 startup ...` and `pm2 save`.
- **Contact form 500** — missing `RESEND_API_KEY` in `.env.local`, or `CONTACT_FROM_EMAIL` domain not verified in Resend. Reload after edits: `pm2 reload nurul --update-env`.
- **Stale assets after deploy** — hard-refresh; hashed `_next/static/*` are cache-busted automatically, but browsers cache the HTML for a few seconds.
- **`brotli` directive unknown** — your nginx doesn't have the brotli module. Leave it commented out in `nginx.conf`; gzip is sufficient.

## Post-deploy checklist

- [ ] `https://nurul.com.bd` loads, all sections render, theme toggle works
- [ ] `https://nurul.dev` → 301 → `https://nurul.com.bd`
- [ ] `https://www.nurul.com.bd` → 301 → `https://nurul.com.bd`
- [ ] `/sitemap.xml`, `/robots.txt`, `/feed.xml` all 200
- [ ] `/resume.pdf` downloads
- [ ] `/opengraph-image` returns a PNG
- [ ] Contact form submits successfully to the test inbox
- [ ] `https://www.ssllabs.com/ssltest/` — A or A+
- [ ] Reboot the server once and confirm PM2 brings the app back up
- [ ] Submit `https://nurul.com.bd/sitemap.xml` to Google Search Console + Bing Webmaster Tools
