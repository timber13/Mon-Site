import React from 'react';

export default function LogoTS({ style = {}, size = 44 }) {
  // Simple Swiss cross + text logo, can be replaced by an SVG or image
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, ...style }}>
      <div style={{
        width: size, height: size, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #a00a', position: 'relative',
      }}>
        <svg width={size} height={size} style={{ position: 'absolute', left: 0, top: 0 }}>
          <rect x={size*0.44} y={size*0.18} width={size*0.12} height={size*0.64} fill="#e30613" />
          <rect x={size*0.18} y={size*0.44} width={size*0.64} height={size*0.12} fill="#e30613" />
        </svg>
      </div>
      <span style={{ color: '#fff', fontWeight: 900, fontSize: size * 0.72, fontFamily: 'Oswald, Arial Black, Arial, sans-serif', letterSpacing: '0.04em', textShadow: '0 2px 8px #a00a' }}>
        Touch Switzerland
      </span>
    </div>
  );
}
