
// Composant Matchs : affichage placeholder pour la section matchs
import React from 'react';

export default function Matchs() {
  // Style principal du bloc matchs
  const style = {
    background: 'rgba(255,255,255,0.98)',
    borderRadius: 16,
    boxShadow: '0 2px 16px #c0020a',
    padding: '40px 32px',
    minHeight: 320,
    border: '1.5px solid #f8d7da',
    margin: '0 auto',
    maxWidth: 700,
    fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
    color: '#c00',
    fontWeight: 600,
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    letterSpacing: '0.04em',
  };

  // Rendu principal
  return (
    <div style={style}>
      🏉 Match (prochains matchs à afficher ici)
    </div>
  );
}