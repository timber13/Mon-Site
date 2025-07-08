// Page Referees : gestion des sous-onglets pour les arbitres (formation, news, ressources, coaches)
import React, { useState } from 'react';
import Formation from './Formation';
import News from './News';
import Ressources from './Ressources';
import RefereesCoaches from './RefereesCoaches';

export default function Referees({ isAdmin = false }) {
  // Onglet actif (formation, news, ressources, refereesCoaches)
  const [activeTab, setActiveTab] = useState('formation');

  // Styles harmonisés avec Resultats.jsx
  const tabBarStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: 0,
    margin: '44px auto 36px auto',
    background: 'rgba(255,255,255,0.97)',
    borderRadius: 16,
    boxShadow: '0 2px 16px #c0020a',
    border: '1.5px solid #c00',
    overflow: 'hidden',
    width: 'fit-content',
    fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };

  const tabs = [
    { key: 'formation', label: 'Formations' },
    { key: 'news', label: 'News' },
    { key: 'ressources', label: 'Ressources' },
    { key: 'refereesCoaches', label: 'Referees-coaches' },
  ];

  const tabBtnStyle = (active, idx, arr) => ({
    background: active ? 'linear-gradient(90deg, #c00 60%, #ff4d4d 100%)' : 'transparent',
    color: active ? '#fff' : '#c00',
    border: 'none',
    borderRight: idx < arr.length - 1 ? '1.5px solid #c00' : 'none',
    borderRadius: 0,
    padding: '18px 38px',
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

  // Un seul bloc visuel englobant la barre d'onglets et le contenu
  return (
    <div style={{
      maxWidth: 900,
      margin: '48px auto',
      padding: 0,
      background: 'rgba(255,255,255,0.98)',
      boxShadow: '0 2px 16px #c0020a',
      border: '1.5px solid #f8d7da',
      borderRadius: 16,
      minHeight: 400,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    }}>
      {/* Barre d'onglets harmonisée */}
      <nav style={{ ...tabBarStyle, margin: '0 0 36px 0', borderRadius: '16px 16px 0 0', boxShadow: 'none', borderBottom: '1.5px solid #f8d7da', border: 'none', background: 'transparent' }}>
        {tabs.map((tab, idx, arr) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={tabBtnStyle(activeTab === tab.key, idx, arr)}
            title={tab.label}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {/* Contenu de l'onglet actif */}
      <div style={{ flex: 1, padding: '0 0 32px 0', minHeight: 320 }}>
        {/* Les contenus sont visibles par tous, mais l'édition est réservée aux admins via la prop isAdmin */}
        {activeTab === 'formation' && <Formation isAdmin={isAdmin} />}
        {activeTab === 'news' && <News isAdmin={isAdmin} />}
        {activeTab === 'ressources' && <Ressources isAdmin={isAdmin} />}
        {activeTab === 'refereesCoaches' && <RefereesCoaches isAdmin={isAdmin} />}
      </div>
    </div>
  );
}