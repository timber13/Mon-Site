
import { supabase } from '../../supabase/client';

import React, { useState } from "react";

// ClassementRegionalWest is now a pure component that receives tablesWest as a prop
export default function ClassementRegionalWest({ tablesWest = [] }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const getMatchsForTeam = (team) => {
    const matchs = [];
    tablesWest.forEach(({ data }) => {
      data.forEach((row) => {
        if (row.team_1 === team || row.team_2 === team) {
          matchs.push(row);
        }
      });
    });
    return matchs;
  };

  const getClassement = (tablesSource) => {
    const teams = {};
    tablesSource.forEach(({ data }) => {
      data.forEach(({ team_1, score_1, score_2, team_2 }) => {
        const s1 = Number(score_1);
        const s2 = Number(score_2);
        if (!team_1 || !team_2 || isNaN(s1) || isNaN(s2)) return;
        if (!teams[team_1]) {
          teams[team_1] = {
            points: 0, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0,
          };
        }
        if (!teams[team_2]) {
          teams[team_2] = {
            points: 0, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDiff: 0,
          };
        }
        teams[team_1].played += 1;
        teams[team_2].played += 1;
        teams[team_1].goalsFor += s1;
        teams[team_1].goalsAgainst += s2;
        teams[team_2].goalsFor += s2;
        teams[team_2].goalsAgainst += s1;
        teams[team_1].goalDiff = teams[team_1].goalsFor - teams[team_1].goalsAgainst;
        teams[team_2].goalDiff = teams[team_2].goalsFor - teams[team_2].goalsAgainst;
        if (s1 > s2) {
          teams[team_1].points += 3; teams[team_1].won += 1; teams[team_2].lost += 1;
        } else if (s1 < s2) {
          teams[team_2].points += 3; teams[team_2].won += 1; teams[team_1].lost += 1;
        } else {
          teams[team_1].points += 1; teams[team_2].points += 1; teams[team_1].drawn += 1; teams[team_2].drawn += 1;
        }
      });
    });
    const classementArray = Object.entries(teams).map(([team, stats]) => ({ team, ...stats }));
    classementArray.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goalsFor - a.goalsFor;
    });
    return classementArray;
  };

  const styles = {
    container: {
      maxWidth: 900,
      margin: "auto",
      backgroundColor: "white",
      borderRadius: 10,
      boxShadow: "0 6px 15px rgba(192, 0, 0, 0.3)",
      padding: 20,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    title: {
      color: "#c00",
      textAlign: "center",
      marginBottom: 20,
      fontWeight: "700",
      fontSize: "1.8rem",
      letterSpacing: "1.2px",
      textTransform: "uppercase",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    thead: {
      backgroundColor: "#c00",
      color: "white",
      fontWeight: "600",
      fontSize: "1rem",
    },
    th: {
      padding: "12px 10px",
      textAlign: "center",
      userSelect: "none",
    },
    tbody: {
      fontSize: "0.95rem",
      color: "#222",
    },
    tr: {
      transition: "background-color 0.25s ease",
    },
    trOdd: {
      backgroundColor: "#fef0f0",
    },
    trHover: {
      backgroundColor: "#ffe6e6",
    },
    td: {
      padding: "10px 8px",
      textAlign: "center",
      borderBottom: "1px solid #eee",
    },
    teamName: {
      textAlign: "left",
      paddingLeft: 15,
      fontWeight: "600",
      color: "#8B0000",
    },
  };

  return (
    <div style={styles.container}>
  <h2 style={styles.title}>Regional West Standings</h2>
      {getClassement(tablesWest).length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>
          No results available to calculate the standings.
        </p>
      ) : (
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Teams</th>
              <th style={styles.th}>Pts</th>
              <th style={styles.th}>P</th>
              <th style={styles.th}>W</th>
              <th style={styles.th}>D</th>
              <th style={styles.th}>L</th>
              <th style={styles.th}>TF</th>
              <th style={styles.th}>TA</th>
              <th style={styles.th}>TD</th>
            </tr>
          </thead>
          <tbody style={styles.tbody}>
            {getClassement(tablesWest).map((team, idx) => {
              const isOdd = idx % 2 === 1;
              return (
                <tr
                  key={team.team}
                  style={{
                    ...styles.tr,
                    ...(isOdd ? styles.trOdd : {}),
                    ...(hoverIndex === idx ? styles.trHover : {}),
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => setHoverIndex(idx)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onClick={() => setSelectedTeam(team.team)}
                >
                  <td style={styles.td}>{idx + 1}</td>
                  <td style={{ ...styles.td, ...styles.teamName }}>{team.team}</td>
                  <td style={styles.td}>{team.points}</td>
                  <td style={styles.td}>{team.played}</td>
                  <td style={styles.td}>{team.won}</td>
                  <td style={styles.td}>{team.drawn}</td>
                  <td style={styles.td}>{team.lost}</td>
                  <td style={styles.td}>{team.goalsFor}</td>
                  <td style={styles.td}>{team.goalsAgainst}</td>
                  <td style={styles.td}>{team.goalDiff}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {selectedTeam && (
        <div style={{ marginTop: 30, background: '#f9f9f9', borderRadius: 8, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <h3 style={{ color: '#c00', marginTop: 0 }}>Matches for {selectedTeam}</h3>
          <button style={{ marginBottom: 15, background: '#c00', color: 'white', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setSelectedTeam(null)}>Close</button>
          {getMatchsForTeam(selectedTeam).length === 0 ? (
            <p>No match found for this team.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
              <thead>
                <tr style={{ background: '#eee' }}>
                  <th style={{ padding: '8px' }}>Location</th>
                  <th style={{ padding: '8px' }}>Time</th>
                  <th style={{ padding: '8px' }}>Team 1</th>
                  <th style={{ padding: '8px' }}>Score</th>
                  <th style={{ padding: '8px' }}>Team 2</th>
                </tr>
              </thead>
              <tbody>
                {getMatchsForTeam(selectedTeam).map((m, i) => {
                  const score1 = Number(m.score_1);
                  const score2 = Number(m.score_2);
                  const team1Win = !isNaN(score1) && !isNaN(score2) && score1 > score2;
                  const team2Win = !isNaN(score1) && !isNaN(score2) && score2 > score1;
                  return (
                    <tr key={i} style={{ background: i % 2 === 1 ? '#fff0f0' : 'white' }}>
                      <td style={{ padding: '8px', textAlign: 'center' }}>{m.lieu || ''}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>{m.time}</td>
                      <td style={{ padding: '8px', textAlign: 'left', fontWeight: team1Win ? 'bold' : 'normal' }}>{m.team_1}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        <span style={{ fontWeight: team1Win ? 'bold' : 'normal' }}>{m.score_1}</span>
                        -
                        <span style={{ fontWeight: team2Win ? 'bold' : 'normal' }}>{m.score_2}</span>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'left', fontWeight: team2Win ? 'bold' : 'normal' }}>{m.team_2}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
