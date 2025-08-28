
import { supabase } from '../../supabase/client';
import React, { useState, useEffect } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

export default function Language({ currentLang, setLang }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.lang-dropdown')) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="lang-dropdown" style={{ position: 'absolute', top: 74, right: 24, zIndex: 1200 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: '#fff',
          color: '#c00',
          border: '1.5px solid #e30613',
          borderRadius: 6,
          padding: '7px 18px',
          fontWeight: 700,
          fontSize: '1em',
          cursor: 'pointer',
          boxShadow: '0 2px 8px #e3061322',
          minWidth: 90,
        }}
      >
        {LANGUAGES.find(l => l.code === currentLang)?.label || 'Language'} ▼
      </button>
      {open && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          background: '#fff',
          border: '1px solid #e30613',
          borderRadius: 6,
          margin: 0,
          padding: '4px 0',
          listStyle: 'none',
          boxShadow: '0 6px 18px #c0020a33',
          zIndex: 1300,
          minWidth: 120,
        }}>
          {LANGUAGES.map(lang => (
            <li
              key={lang.code}
              onClick={() => { setLang(lang.code); setOpen(false); }}
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                background: lang.code === currentLang ? '#e30613' : 'transparent',
                color: lang.code === currentLang ? '#fff' : '#c00',
                fontWeight: lang.code === currentLang ? 700 : 500,
                fontSize: '1em',
              }}
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
