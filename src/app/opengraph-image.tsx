import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ScholarBlitz - Master Quiz Bowl';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background pattern dots */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          display: 'flex',
        }} />

        {/* Lightning bolt icon */}
        <div style={{
          width: 100,
          height: 100,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          border: '2px solid rgba(255,255,255,0.2)',
        }}>
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <path d="M18.5 4L10 18h7l-3.5 10L26 14h-7.5L18.5 4z" fill="white"/>
          </svg>
        </div>

        {/* Title */}
        <div style={{
          fontSize: 72,
          fontWeight: 800,
          color: 'white',
          letterSpacing: '-2px',
          lineHeight: 1,
          marginBottom: 20,
        }}>
          ScholarBlitz
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 28,
          color: 'rgba(199, 210, 254, 1)',
          fontWeight: 500,
          marginBottom: 48,
          textAlign: 'center',
          maxWidth: 700,
          lineHeight: 1.4,
        }}>
          Master Quiz Bowl — Practice, Compete, Win
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          {['Progressive Reveal', 'Multiplayer', 'Text-to-Speech'].map((feat) => (
            <div key={feat} style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 100,
              padding: '10px 24px',
              fontSize: 18,
              color: 'rgba(224, 231, 255, 1)',
              fontWeight: 600,
            }}>
              {feat}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{
          position: 'absolute',
          bottom: 40,
          fontSize: 20,
          color: 'rgba(165, 180, 252, 1)',
          fontWeight: 500,
        }}>
          scholarblitz.com
        </div>
      </div>
    ),
    { ...size }
  );
}
