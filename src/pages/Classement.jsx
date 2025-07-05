import React, { useState } from "react";
import ClassementNationals from "./Classement_Nationals";
import ClassementRegionalWest from "./Classement_Regional_West";
import ClassementRegionalEast from "./Classement_Regional_East";
import Scorers from "./Scorers";

export default function Classement() {
  const [activeTab, setActiveTab] = useState('nationals');

  return (
    <div style={{ maxWidth: 900, margin: "auto", backgroundColor: "white", borderRadius: 10, boxShadow: "0 6px 15px rgba(192, 0, 0, 0.3)", padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab('nationals')}
          style={{
            background: activeTab === 'nationals' ? '#c00' : '#fff',
            color: activeTab === 'nationals' ? '#fff' : '#c00',
            border: '1px solid #c00',
            borderRadius: 6,
            padding: '8px 24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1.1rem',
            boxShadow: activeTab === 'nationals' ? '0 2px 8px #c00a' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Nationals
        </button>
        <button
          onClick={() => setActiveTab('regionalWest')}
          style={{
            background: activeTab === 'regionalWest' ? '#c00' : '#fff',
            color: activeTab === 'regionalWest' ? '#fff' : '#c00',
            border: '1px solid #c00',
            borderRadius: 6,
            padding: '8px 24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1.1rem',
            boxShadow: activeTab === 'regionalWest' ? '0 2px 8px #c00a' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Regional West
        </button>
        <button
          onClick={() => setActiveTab('regionalEast')}
          style={{
            background: activeTab === 'regionalEast' ? '#c00' : '#fff',
            color: activeTab === 'regionalEast' ? '#fff' : '#c00',
            border: '1px solid #c00',
            borderRadius: 6,
            padding: '8px 24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1.1rem',
            boxShadow: activeTab === 'regionalEast' ? '0 2px 8px #c00a' : 'none',
            transition: 'all 0.2s',
          }}
        >
          Regional East
        </button>
        <button
          onClick={() => setActiveTab('topscorer')}
          style={{
            background: activeTab === 'topscorer' ? '#c00' : '#fff',
            color: activeTab === 'topscorer' ? '#fff' : '#c00',
            border: '1px solid #c00',
            borderRadius: 6,
            padding: '8px 24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1.1rem',
            boxShadow: activeTab === 'topscorer' ? '0 2px 8px #c00a' : 'none',
            transition: 'all 0.2s',
          }}
        >
          TopScorers
        </button>
      </div>

      {/* Affichage selon l'onglet actif */}
      {activeTab === 'nationals' && <ClassementNationals />}
      {activeTab === 'regionalWest' && <ClassementRegionalWest />}
      {activeTab === 'regionalEast' && <ClassementRegionalEast />}
      {activeTab === 'topscorer' && <Scorers />}
    </div>
  );
}
