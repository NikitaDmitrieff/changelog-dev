import { NextResponse } from 'next/server'

export async function GET() {
  const checks = {
    supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabase_service_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    stripe_secret_key: !!process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: !!process.env.STRIPE_WEBHOOK_SECRET,
    resend_api_key: !!process.env.RESEND_API_KEY,
    github_token: !!process.env.GITHUB_TOKEN,
  }

  const missing = Object.entries(checks)
    .filter(([, ok]) => !ok)
    .map(([key]) => key)

  const status = missing.length === 0 ? 'healthy' : 'degraded'

  return NextResponse.json({
    status,
    timestamp: new Date().toISOString(),
    services: {
      email: checks.resend_api_key ? 'active' : 'disabled',
      payments: checks.stripe_secret_key ? 'active' : 'disabled',
      webhooks: checks.stripe_webhook_secret ? 'active' : 'disabled',
      github: checks.github_token ? 'authenticated' : 'unauthenticated (rate limited)',
    },
    ...(missing.length > 0 && { missing_env_vars: missing }),
  })
}
