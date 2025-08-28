
import { supabase } from '../../supabase/client';

import React, { useState } from 'react';
import AboutExecutive from './AboutExecutive';
import AboutVision from './AboutVision';
import AboutConstitution from './AboutConstitution';
import AboutCode from './AboutCode';

const tabs = [
  { key: 'executive', label: 'Executive Committee' },
  { key: 'constitution', label: 'Constitution' },
  { key: 'vision', label: 'Vision & Strategy' },
  { key: 'code', label: 'Code of Conduct' },
];

const tabContents = {
  executive: <AboutExecutive />,
  constitution: <AboutConstitution />,
  vision: <AboutVision />,
  code: <AboutCode />,
};



export default function About() {
  const [activeTab, setActiveTab] = useState('executive');

  const aboutContainerStyle = {
    width: '100vw',
    maxWidth: '100%',
    margin: '48px 0',
    padding: 0,
    background: 'rgba(255,255,255,0.98)',
    boxShadow: '0 2px 16px #c0020a',
    border: '1.5px solid #f8d7da',
    borderRadius: 16,
    minHeight: 320,
    overflowX: 'auto',
    fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
    color: '#222',
  };

  const tabBtnStyle = (active) => ({
    background: active ? 'linear-gradient(90deg, #c00 60%, #ff4d4d 100%)' : 'transparent',
    color: active ? '#fff' : '#c00',
    border: 'none',
    borderBottom: active ? '3px solid #fff' : '3px solid transparent',
    borderRadius: 0,
    padding: '16px 38px',
    fontWeight: 700,
    fontSize: '1.08rem',
    cursor: 'pointer',
    boxShadow: active ? '0 2px 12px #c003' : 'none',
    transition: 'all 0.16s',
    outline: 'none',
    minWidth: 120,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    letterSpacing: '0.04em',
    textShadow: active ? '0 2px 8px #a00a' : 'none',
    textTransform: 'uppercase',
    fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
  });

  return (
    <div style={aboutContainerStyle}>
  <h1 style={{ color: '#c00', fontSize: 36, marginBottom: 24, fontFamily: 'Oswald, Arial Black, Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', marginLeft: 48 }}>About</h1>
      <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'none', border: 'none', boxShadow: 'none', fontFamily: 'Oswald, Arial Black, Arial, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', minHeight: 64, gap: 0, borderRadius: '16px 16px 0 0', borderBottom: '1.5px solid #f8d7da' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={tabBtnStyle(activeTab === tab.key)}
            aria-selected={activeTab === tab.key}
            title={tab.label}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div style={{ flex: 1, padding: '32px 0', minHeight: 220, width: '100%', maxWidth: 900, margin: '0 auto' }}>
        {tabContents[activeTab]}
      </div>
    </div>
  );

}

