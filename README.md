# Hono/MCP with Cloudflare Workers and Deno Deploy

This project supports both Cloudflare Workers and Deno Deploy platforms.

## Cloudflare Workers

### Development
```bash
pnpm cloudflare:dev
```

### Deployment
```bash
pnpm cloudflare:deploy
```

## Deno Deploy

### Prerequisites
Install Deno:
```bash
# macOS/Linux
curl -fsSL https://deno.land/install.sh | sh

# Windows
irm https://deno.land/install.ps1 | iex
```

### Development
```bash
pnpm deno:dev
# or directly with deno
deno task dev
```

### Deployment
First, create a new app (one-time setup):
```bash
deno deploy create --org=<your-org>
```

```bash
# Deploy to production
pnpm deno:deploy
# or directly with deno
deno task deploy

```

## Supabase Edge Functions

### Prerequisites
Supabase CLI should be installed. If needed, install it as a dependency:
```bash
# Install as dev dependency
pnpm add -D supabase
```

### Development
```bash
supabase functions serve
```

### Deployment
First, link your project (one-time setup):
```bash
supabase link --project-ref <your-project-ref>
```
*Note: Find your project ref in your Supabase dashboard URL: `https://supabase.com/dashboard/project/<your-project-ref>` or in Project Settings > General > Reference ID*

Then deploy the function:
```bash
supabase functions deploy hono-oauth-mcp
```

Or deploy all functions:
```bash
supabase functions deploy
```
