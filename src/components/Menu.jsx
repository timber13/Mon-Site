import React from 'react';

export default function Menu({ activeTab, setActiveTab }) {
  const buttonStyle = (tabName) => ({
    marginRight: 10,
    padding: '8px 16px',
    backgroundColor: activeTab === tabName ? '#c00' : '#eee',
    color: activeTab === tabName ? 'white' : 'black',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  });

  return (
    <nav style={{ marginBottom: 20 }}>
      <button
        onClick={() => setActiveTab('resultats')}
        style={buttonStyle('resultats')}
      >
        Résultats
      </button>
      <button
        onClick={() => setActiveTab('classement')}
        style={buttonStyle('classement')}
      >
        Classement
      </button>
      <button
        onClick={() => setActiveTab('matchs')}
        style={buttonStyle('matchs')}
      >
        Matchs
      </button>
      <button
        onClick={() => setActiveTab('formations')}
        style={buttonStyle('formations')}
      >
        Formations
      </button>
      <button
        onClick={() => setActiveTab('photos')}
        style={buttonStyle('photos')}
      >
        Photos
      </button>
    </nav>
  );
}
