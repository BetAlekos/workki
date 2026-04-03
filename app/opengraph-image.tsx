import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Workki — Αγγελίες Εργασίας στην Ελλάδα'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #082f49 0%, #0c4a6e 50%, #075985 100%)',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '48px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '800',
              color: 'white',
            }}
          >
            W
          </div>
          <span style={{ fontSize: '36px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>
            Workki
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: '800',
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: '-2px',
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          Βρες τη δουλειά
          <br />
          <span style={{ color: '#7dd3fc' }}>που σου ταιριάζει.</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#bae6fd',
            fontWeight: '400',
            marginBottom: '48px',
          }}
        >
          Χιλιάδες αγγελίες εργασίας σε όλη την Ελλάδα
        </div>

        {/* Pills */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['Αθήνα', 'Θεσσαλονίκη', 'Remote', 'Εποχιακές', 'Τεχνολογία'].map((label) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '999px',
                padding: '8px 20px',
                fontSize: '20px',
                color: 'white',
                fontWeight: '500',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            fontSize: '22px',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: '500',
          }}
        >
          workki.gr
        </div>
      </div>
    ),
    { ...size }
  )
}
