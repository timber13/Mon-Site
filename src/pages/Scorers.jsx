// src/pages/Scorers.jsx
import React, { useContext, useMemo } from 'react';
import { ResultatsContext } from '../contexts/ResultatsContext';

export default function Scorers() {
  const { tables } = useContext(ResultatsContext);

  // Récupère tous les matchs de toutes les tables
  const matches = useMemo(
    () => tables.flatMap((table) => table.data),
    [tables]
  );

  // Accumule les buts par joueur
  const scorerCounts = useMemo(() => {
    const counts = {};
    matches.forEach((match) => {
      const {
        scorerNames_1 = [],
        scorerNames_2 = [],
        team_1,
        team_2,
      } = match;

      // Pour chaque nom dans scorerNames_1, incrémente
      scorerNames_1.forEach((name) => {
        if (!name) return;
        const key = name + '|' + team_1;
        if (!counts[key]) {
          counts[key] = { name, team: team_1, goals: 0 };
        }
        counts[key].goals++;
      });

      // Pour chaque nom dans scorerNames_2, incrémente
      scorerNames_2.forEach((name) => {
        if (!name) return;
        const key = name + '|' + team_2;
        if (!counts[key]) {
          counts[key] = { name, team: team_2, goals: 0 };
        }
        counts[key].goals++;
      });
    });

    // Transforme en tableau et trie par nombre de buts décroissant
    return Object.values(counts).sort((a, b) => b.goals - a.goals);
  }, [matches]);

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ color: '#c00', textTransform: 'uppercase', marginBottom: 16 }}>Top Scorers</h2>
      {scorerCounts.length === 0 ? (
        <p>Aucun buteur enregistré.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#c00', color: 'white' }}>
              <th style={{ padding: '10px', textAlign: 'center' }}>#</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Joueur</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Équipe</th>
              <th style={{ padding: '10px', textAlign: 'center' }}>Buts</th>
            </tr>
          </thead>
          <tbody>
            {scorerCounts.map((p, idx) => (
              <tr
                key={p.name}
                style={{
                  backgroundColor: idx % 2 === 1 ? '#fef0f0' : 'white',
                }}
              >
                <td style={{ padding: '8px', textAlign: 'center' }}>{idx + 1}</td>
                <td style={{ padding: '8px' }}>{p.name}</td>
                <td style={{ padding: '8px' }}>{p.team}</td>
                <td style={{ padding: '8px', textAlign: 'center' }}>{p.goals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
