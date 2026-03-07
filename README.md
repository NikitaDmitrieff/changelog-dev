# changelog.dev

**Turn GitHub commits into beautiful changelogs your users actually read.**

changelog.dev connects to your repo, uses AI to draft release notes from commits, and publishes them to a hosted page with email notifications -- so your users always know what shipped.

[Live Site](https://www.changelogdev.com) | [API Docs](https://www.changelogdev.com/docs/api) | [Demo](https://www.changelogdev.com/demo) | [CLI](https://www.npmjs.com/package/changelogdev-cli) | [GitHub Action](https://github.com/NikitaDmitrieff/changelog-action) | [Widget](https://www.npmjs.com/package/changelogdev-widget)

---

## Quick Start

### 1. Use the hosted version (recommended)

Sign up at [changelogdev.com](https://www.changelogdev.com), connect your GitHub repo, and publish your first entry in under 2 minutes.

### 2. Push entries via CLI

```bash
npx changelogdev-cli push "v2.1" "New dashboard with keyboard shortcuts"
```

### 3. Automate with GitHub Actions

```yaml
- uses: NikitaDmitrieff/changelog-action@v1
  with:
    project-id: my-app
    api-key: ${{ secrets.CHANGELOGDEV_API_KEY }}
```

### 4. Use the REST API directly

```bash
curl -X POST https://www.changelogdev.com/api/v1/entries \
  -H "Authorization: Bearer cldev_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"title": "v2.1", "content": "New dashboard with keyboard shortcuts", "tags": ["feature"]}'
```

---

## Features

- **GitHub-native** -- Connects to any public or private repo. Reads commits, PRs, and tags automatically.
- **AI-drafted entries** -- Claude translates commit messages into clear, customer-readable release notes. Edit or publish as-is.
- **Email subscribers** -- Visitors subscribe on your changelog page. Emails go out automatically when you publish.
- **Embeddable widget** -- Drop a `<changelog-widget>` web component into your app. Users see a bell icon with an unread badge.
- **Scheduled publishing** -- Write entries ahead of time and set them to publish on a schedule.
- **Custom branding** -- Accent colors, logo, custom domain. Make it look like your own product.
- **REST API + CLI + GitHub Action** -- Push entries from anywhere: your terminal, CI pipeline, or any HTTP client.
- **Import / Export** -- Migrate existing changelogs in or take your data out. No lock-in.

---

## Embed the Widget

Add the widget to your app so users can see updates without leaving your product:

```html
<script src="https://unpkg.com/changelogdev-widget"></script>
<changelog-widget project-id="my-app" />
```

---

## API Reference

All endpoints require an API key. Generate one from your dashboard.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/entries` | List entries (supports `limit`, `offset`, `status` params) |
| `POST` | `/api/v1/entries` | Create a new entry |
| `GET` | `/api/widget?project=slug` | Widget data endpoint (public, CORS-enabled) |

Authentication: `Authorization: Bearer cldev_your_key`

Rate limits: 60 requests/minute for API, 30/minute for widget.

Full documentation: [changelogdev.com/docs/api](https://www.changelogdev.com/docs/api)

---

## Pricing

| | Free | Pro ($29/mo) |
|---|---|---|
| Changelogs | 1 | Unlimited |
| Subscribers | 100 | Unlimited |
| AI-generated entries | Yes | Yes |
| GitHub integration | Yes | Yes |
| RSS feed | Yes | Yes |
| Custom domain | -- | Yes |
| Custom branding | -- | Yes |
| Remove "powered by" | -- | Yes |
| Priority support | -- | Yes |

No credit card required to start. Free tier is free forever.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (Postgres + Auth + Storage)
- **Styling:** Tailwind CSS v4
- **AI:** Anthropic Claude API
- **Email:** Resend
- **Payments:** Stripe
- **Hosting:** Vercel

---

## Self-Hosting

Clone the repo and set up your own instance:

```bash
git clone https://github.com/NikitaDmitrieff/changelog-dev.git
cd changelog-dev
npm install
cp .env.example .env.local  # fill in your keys
npm run dev
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` -- Supabase project
- `ANTHROPIC_API_KEY` -- for AI entry generation
- `RESEND_API_KEY` -- for subscriber emails
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` -- for payments (optional if free-only)

Run the Supabase migrations from the `supabase/` directory to set up your database schema.

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes
4. Push to the branch and open a Pull Request

---

## License

MIT

---

Built by [changelog.dev](https://www.changelogdev.com)
