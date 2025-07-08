
// Page Classement : affichage des classements et des topscorers avec onglets
import React, { useState } from "react";
import ClassementNationals from "./Classement_Nationals";
import ClassementRegionalWest from "./Classement_Regional_West";
import ClassementRegionalEast from "./Classement_Regional_East";
import Scorers from "./Scorers";

export default function Classement({ showTopScorersTab = true }) {
  // Onglet actif (nationals, regionalWest, regionalEast, [topscorer])
  const [activeTab, setActiveTab] = useState('nationals');

  // Liste des onglets
  const tabs = [
    { key: 'nationals', label: 'Nationals' },
    { key: 'regionalWest', label: 'Regional West' },
    { key: 'regionalEast', label: 'Regional East' },
  ];
  if (showTopScorersTab) {
    tabs.push({ key: 'topscorer', label: 'TopScorers' });
  }

  // Styles pour la barre d'onglets et les boutons
  const tabBarStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: 0,
    marginBottom: 36,
    background: 'rgba(255,255,255,0.97)',
    borderRadius: 16,
    boxShadow: '0 2px 16px #c0020a',
    border: '1.5px solid #c00',
    overflow: 'hidden',
    width: 'fit-content',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };
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
  });

  // Rendu principal
  return (
    <div style={{
      maxWidth: 900,
      margin: '48px auto',
      padding: 0,
      background: 'linear-gradient(120deg, #fff 60%, #ffe5e5 100%)',
      borderRadius: 18,
      boxShadow: '0 6px 32px #c0020a',
      border: '1.5px solid #c00',
      minHeight: 600,
      position: 'relative',
    }}>
      {/* Barre d'onglets horizontale */}
      <nav style={tabBarStyle}>
        {tabs.map((tab, idx, arr) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={tabBtnStyle(activeTab === tab.key, idx, arr)}
            title={tab.label}
          >
            <span style={{ fontSize: '1.3em', marginRight: 2 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
      {/* Affichage du contenu selon l'onglet actif */}
      <main style={{
        background: 'rgba(255,255,255,0.98)',
        borderRadius: 16,
        boxShadow: '0 2px 16px #c0020a',
        padding: '40px 32px',
        minHeight: 420,
        border: '1.5px solid #f8d7da',
        margin: '0 auto',
        maxWidth: 750,
        fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
      }}>
        {activeTab === 'nationals' && <ClassementNationals />}
        {activeTab === 'regionalWest' && <ClassementRegionalWest />}
        {activeTab === 'regionalEast' && <ClassementRegionalEast />}
        {showTopScorersTab && activeTab === 'topscorer' && <Scorers />}
      </main>
    </div>
  );
}
