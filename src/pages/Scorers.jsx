
import React, { useContext, useMemo, useEffect, useState } from 'react';
import { ResultatsContext } from '../contexts/ResultatsContext';


const Scorers = () => {
  const { tables } = useContext(ResultatsContext);
  const [topScorers, setTopScorers] = useState([]);

  useEffect(() => {
    const scorerMap = {};
    tables.forEach(({ data }) => {
      data.forEach(match => {
        const addEssais = (scorers, joueurs, club) => {
          if (!Array.isArray(scorers) || !Array.isArray(joueurs)) return;
          scorers.forEach(num => {
            const joueur = joueurs.find(j => String(j.numero).trim() === String(num).trim());
            if (joueur) {
              const key = (String(joueur.prenom || '') + '-' + (joueur.nom || '') + '-' + (club || '')).trim();
              if (!scorerMap[key]) scorerMap[key] = { club, nom: joueur.nom, prenom: joueur.prenom, essais: 0 };
              scorerMap[key].essais += 1;
            }
          });
        };
        addEssais(match.scorers_1, match.joueurs_1, match.team_1);
        addEssais(match.scorers_2, match.joueurs_2, match.team_2);
      });
    });
    const result = Object.values(scorerMap)
      .filter(j => (j.nom || j.prenom) && j.essais > 0)
      .sort((a, b) => b.essais - a.essais)
      .slice(0, 50);
    setTopScorers(result);
  // Synchronisation locale retirée (calcul dynamique)
  }, [tables]);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', background: 'white', borderRadius: 12, boxShadow: '0 4px 18px #c0020a33', padding: 32 }}>
      <h2 style={{ color: '#c00', textAlign: 'center', marginBottom: 24, textTransform: 'uppercase', letterSpacing: 1.2 }}>Top Scorers</h2>
        {topScorers.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>No tries recorded yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.08em' }}>
            <thead>
              <tr style={{ background: '#c00', color: 'white' }}>
                <th style={{ padding: '10px 8px' }}>#</th>
                <th style={{ padding: '10px 8px' }}>First Name</th>
                <th style={{ padding: '10px 8px' }}>Last Name</th>
                <th style={{ padding: '10px 8px' }}>Club</th>
                <th style={{ padding: '10px 8px' }}>Tries</th>
              </tr>
            </thead>
            <tbody>
              {topScorers.map((j, idx) => (
                <tr key={j.club + '-' + j.nom + '-' + j.prenom} style={{ background: idx % 2 === 1 ? '#fff0f0' : 'white' }}>
                  <td style={{ padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>{j.prenom}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>{j.nom}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>{j.club}</td>
                  <td style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold', color: '#c00' }}>{j.essais}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
};

export default Scorers;
