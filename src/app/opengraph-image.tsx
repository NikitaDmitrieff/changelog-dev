import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Changelog.dev — Beautiful hosted changelogs your customers actually read'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo / brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <span style={{ color: '#ffffff', fontSize: '24px', fontWeight: '600' }}>
            Changelog.dev
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            color: '#ffffff',
            fontSize: '64px',
            fontWeight: '700',
            lineHeight: '1.1',
            maxWidth: '900px',
            marginBottom: '32px',
          }}
        >
          Beautiful hosted changelogs your customers actually read
        </div>

        {/* Sub-line */}
        <div
          style={{
            color: '#9ca3af',
            fontSize: '28px',
            fontWeight: '400',
            maxWidth: '700px',
          }}
        >
          Connect GitHub → AI drafts entries → publish in seconds
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#111827',
            border: '1px solid #374151',
            borderRadius: '9999px',
            padding: '12px 24px',
          }}
        >
          <span style={{ color: '#ffffff', fontSize: '20px' }}>★</span>
          <span style={{ color: '#d1d5db', fontSize: '18px' }}>Free 14-day trial · $29/mo Pro</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
