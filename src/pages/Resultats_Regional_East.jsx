

import React, { useState, useContext } from 'react';
import { ExcelContext } from '../contexts/ExcelContext';
import { ResultatsContext } from '../contexts/ResultatsContext';
import Fiche from '../components/Fiche';

export default function ResultatsRegionalEast({ isAdmin, tablesEast, setTablesEast }) {
  // Sauvegarde automatique dans localStorage à chaque changement
  React.useEffect(() => {
    localStorage.setItem('resultatsData_regionalEast', JSON.stringify(tablesEast));
  }, [tablesEast]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { setTables } = useContext(ResultatsContext);

  const styles = {
    container: {
      maxWidth: 900,
      margin: 'auto',
      backgroundColor: 'white',
      borderRadius: 10,
      boxShadow: '0 6px 15px rgba(192, 0, 0, 0.3)',
      padding: 20,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    titleContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      color: '#c00',
      marginTop: 0,
      marginBottom: 12,
      fontWeight: '700',
      fontSize: '1.6rem',
      textTransform: 'uppercase',
      letterSpacing: 1.1,
    },
    deleteBtn: {
      backgroundColor: '#c00',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0,
      borderRadius: 8,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginTop: 10,
    },
    thead: {
      backgroundColor: '#c00',
      color: 'white',
      fontWeight: '600',
      fontSize: '1rem',
      userSelect: 'none',
    },
    th: {
      padding: '10px 12px',
      textAlign: 'center',
    },
    tbody: {
      fontSize: '0.95rem',
      color: '#222',
    },
    tr: {
      transition: 'background-color 0.25s ease',
      cursor: 'default',
    },
    trOdd: {
      backgroundColor: '#fff0f0',
    },
    trHover: {
      backgroundColor: '#ffe6e6',
    },
    td: {
      padding: '10px 12px',
      textAlign: 'center',
      borderBottom: '1px solid #eee',
      color: 'black',
    },
    teamCell: (isWinner) => ({
      textAlign: 'left',
      paddingLeft: 16,
      fontWeight: isWinner ? '700' : '400',
      color: '#8B0000',
    }),
    scoreCell: (isWinner) => ({
      fontWeight: isWinner ? '700' : '400',
    }),
    timeCell: {
      color: '#222',
      fontWeight: '600',
    },
    ficheBtn: {
      backgroundColor: '#c00',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
  };

  // Import handler (via ExcelContext)
  const { parseExcelFiles } = useContext(ExcelContext);
  const handleImport = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    try {
      const newTables = await parseExcelFiles(files);
      const updated = [...tablesEast, ...newTables];
      setTablesEast(updated);
      // Merge all divisions for global context
      const nationals = JSON.parse(localStorage.getItem('resultatsData_nationals') || '[]');
      const west = JSON.parse(localStorage.getItem('resultatsData_regionalWest') || '[]');
      setTables([...nationals, ...west, ...updated]);
    } catch (err) {
      alert("Erreur lors de l'importation du fichier. Assurez-vous que le format est correct.");
    }
    e.target.value = '';
  };

  // Reset handler
  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser les résultats Regional East ?')) {
      localStorage.removeItem('resultatsData_regionalEast');
      setTablesEast([]);
      // Merge all divisions for global context
      const nationals = JSON.parse(localStorage.getItem('resultatsData_nationals') || '[]');
      const west = JSON.parse(localStorage.getItem('resultatsData_regionalWest') || '[]');
      setTables([...nationals, ...west]);
    }
  };

  return (
    <>
      {isAdmin && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: 20 }}>
          <label style={{ background: '#c00', color: 'white', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', fontWeight: 'bold' }}>
            Importer
            <input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} multiple onChange={handleImport} />
          </label>
          <button style={{ background: '#c00', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleReset}>
            Réinitialiser
          </button>
        </div>
      )}
      {tablesEast.length === 0
        ? <p style={{ color: '#888' }}>No Result for Regional East</p>
        : tablesEast.map(({ title, data }, idx) => (
          <div key={idx} style={styles.container}>
            <div style={styles.titleContainer}>
              <h2 style={styles.title}>{title}</h2>
              {isAdmin && (
                <button
                  style={styles.deleteBtn}
                  onClick={() => {
                    const updated = tablesEast.filter((_, i2) => i2 !== idx);
                    setTablesEast(updated);
                    // Merge all divisions for global context
                    const nationals = JSON.parse(localStorage.getItem('resultatsData_nationals') || '[]');
                    const west = JSON.parse(localStorage.getItem('resultatsData_regionalWest') || '[]');
                    setTables([...nationals, ...west, ...updated]);
                  }}
                >🗑 Supprimer</button>
              )}
            </div>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Heure</th>
                  <th style={styles.th}>Équipe 1</th>
                  <th style={styles.th}>Score</th>
                  <th style={styles.th}>Équipe 2</th>
                  <th style={styles.th}>Fiche</th>
                </tr>
              </thead>
              <tbody style={styles.tbody}>
                {data.map((row, i) => {
                  const score1 = Number(row.score_1);
                  const score2 = Number(row.score_2);
                  const team1Win = !isNaN(score1) && !isNaN(score2) && score1 > score2;
                  const team2Win = !isNaN(score1) && !isNaN(score2) && score2 > score1;
                  const isOdd = i % 2 === 1;
                  const isHovered = hoverIndex === i;
                return (
                  <tr
                    key={i}
                    style={{
                      ...styles.tr,
                      ...(isOdd ? styles.trOdd : {}),
                      ...(isHovered ? styles.trHover : {}),
                    }}
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <td style={{ ...styles.td, ...styles.timeCell }}>{row.time}</td>
                    <td style={{ ...styles.td, ...styles.teamCell(team1Win) }}>{row.team_1}</td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: team1Win ? 'bold' : 'normal' }}>{row.score_1}</span> - <span style={{ fontWeight: team2Win ? 'bold' : 'normal' }}>{row.score_2}</span>
                    </td>
                    <td style={{ ...styles.td, ...styles.teamCell(team2Win) }}>{row.team_2}</td>
                    <td style={styles.td}>
                      <button style={styles.ficheBtn} onClick={() => setSelectedMatch({ ...row })}>
                        Fiche
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
      {selectedMatch && (
        <Fiche match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      )}
    </>
  );
}

