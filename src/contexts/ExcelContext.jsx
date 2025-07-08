import React, { createContext } from 'react';
import * as XLSX from 'xlsx';

export const ExcelContext = createContext();

export const ExcelProvider = ({ children }) => {
  const parseExcelFiles = async (files) => {
    const promises = Array.from(files).map((file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            // Lire le fichier
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const firstSheet = workbook.Sheets[sheetName];

            // Lieu en B1
            const location = firstSheet['B1']?.v || '';

            // Convertir tout le sheet en array de lignes
            const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

            // Construire playersByTeam
            const playersByTeam = {};
            workbook.SheetNames.forEach((name) => {
              if (name === sheetName) return;
              const ws = workbook.Sheets[name];
              const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
              const header = rows[1] || [];
              const headerLow = header.map((h) => String(h).toLowerCase());
              const idxNum    = headerLow.findIndex((h) => h.includes('numero'));
              const idxNom    = headerLow.findIndex((h) => h.includes('nom'));
              const idxPrenom = headerLow.findIndex((h) => h.includes('prenom'));

              const joueurs = rows.slice(2)
                .filter(row => row[idxNum] || row[idxNom] || row[idxPrenom])
                .map(row => ({
                  numero: String(row[idxNum]    || '').trim(),
                  nom:    String(row[idxNom]    || '').trim(),
                  prenom: String(row[idxPrenom] || '').trim(),
                }));

              playersByTeam[name.trim().toLowerCase()] = joueurs;
            });

            const rows = [];

            // Pour chaque ligne du sheet, on cherche les "Game"
            for (let i = 0; i < sheetData.length; i++) {
              const line = sheetData[i] || [];
              const lineLow = line.map(c => String(c).toLowerCase());

              // Récupérer toutes les colonnes où on trouve "game"
              const gameCols = lineLow
                .map((c, idx) => (c.includes('game') ? idx : null))
                .filter((idx) => idx !== null);

              if (gameCols.length === 0) continue;

              // Les lignes suivantes : headerRow = i+1, dataRow = i+2
              const headerRow = sheetData[i + 1] || [];
              const dataRow   = sheetData[i + 2] || [];
              const headerLow = headerRow.map((h) => String(h).toLowerCase());

              // Pour chaque bloc Game trouvé

              gameCols.forEach((startCol) => {
                // Version simple et robuste : l'heure est toujours la première colonne du bloc (startCol)
                const hourIdx = startCol;
                let rawTime = dataRow[hourIdx];
                let time = '';
                if (typeof rawTime === 'number' && rawTime >= 0 && rawTime < 1) {
                  // Excel time as fraction of day
                  const totalMinutes = Math.round(rawTime * 24 * 60);
                  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
                  const minutes = (totalMinutes % 60).toString().padStart(2, '0');
                  time = `${hours}:${minutes}`;
                } else {
                  time = String(rawTime ?? '').trim();
                }
                const hasTime = time !== '';

                const idxTeam1  = headerLow.findIndex((h, idx) => idx > startCol && h.includes('team') && h.includes('1'));
                // Score1 = premier "score" après team1
                let idxScore1 = -1;
                for (let idx = idxTeam1 + 1; idx < headerLow.length; idx++) {
                  if (headerLow[idx] === 'score') { idxScore1 = idx; break; }
                }
                // Score2 = premier "score" après score1, sinon la colonne juste après score1 (jamais égal à score1)
                let idxScore2 = -1;
                for (let idx = idxScore1 + 1; idx < headerLow.length; idx++) {
                  if (headerLow[idx] === 'score') { idxScore2 = idx; break; }
                }
                if ((idxScore2 === -1 || idxScore2 === idxScore1) && idxScore1 !== -1 && idxScore1 + 1 < headerLow.length) {
                  idxScore2 = idxScore1 + 1;
                }
                const idxTeam2  = headerLow.findIndex((h, idx) => idx > idxScore1 && h.includes('team') && h.includes('2'));
                const idxRef1   = headerLow.findIndex((h, idx) => idx > startCol && h.includes('ref') && h.includes('1'));
                const idxRef2   = headerLow.findIndex((h, idx) => idx > startCol && h.includes('ref') && h.includes('2'));
                const idxRef3   = headerLow.findIndex((h, idx) => idx > startCol && h.includes('ref') && h.includes('3'));

                // Equipes
                const team1 = hasTime && idxTeam1 !== -1 ? String(dataRow[idxTeam1] ?? '').trim() : '';
                const team2 = hasTime && idxTeam2 !== -1 ? String(dataRow[idxTeam2] ?? '').trim() : '';

                // Scores
                let score1 = idxScore1 !== -1 ? String(dataRow[idxScore1] ?? '').trim() : '';
                let score2 = idxScore2 !== -1 ? String(dataRow[idxScore2] ?? '').trim() : '';

                // Références
                const ref1 = idxRef1 !== -1 ? String(dataRow[idxRef1] || '').trim() : '';
                const ref2 = idxRef2 !== -1 ? String(dataRow[idxRef2] || '').trim() : '';
                const ref3 = idxRef3 !== -1 ? String(dataRow[idxRef3] || '').trim() : '';

                // Joueurs
                const joueurs_1 = playersByTeam[team1.toLowerCase()] || [];
                const joueurs_2 = playersByTeam[team2.toLowerCase()] || [];

                // Buteurs : on lit les 4 lignes suivantes (i+3 à i+6)
                const scorers_1 = [];
                const scorers_2 = [];
                const scorerNames_1 = [];
                const scorerNames_2 = [];
                // On ne tente l'extraction que si les index sont valides
                const validScorer1 = idxTeam1 !== -1 && idxScore1 !== -1 && idxTeam1 + 1 < idxScore1;
                const validScorer2 = idxScore2 !== -1 && idxRef1 !== -1 && idxScore2 + 1 < idxRef1;
                if (validScorer1 || validScorer2) {
                  for (let k = 1; k <= 4; k++) {
                    const scorerRow = sheetData[i + 2 + k] || [];
                    if (validScorer1) {
                      for (let c = idxTeam1 ; c < idxScore1; c++) {
                        const num = scorerRow[c];
                        if (num !== undefined && String(num).trim() !== '') {
                          scorers_1.push(String(num).trim());
                          const joueur = joueurs_1.find(j => j.numero === String(num).trim());
                          if (joueur) {
                            const nomComplet = `${joueur.prenom} ${joueur.nom}`.trim();
                            if (nomComplet && !scorerNames_1.includes(nomComplet)) scorerNames_1.push(nomComplet);
                          }
                        }
                      }
                    }
                    if (validScorer2) {
                      for (let c = idxScore2 + 1; c < idxRef1; c++) {
                        const num = scorerRow[c];
                        if (num !== undefined && String(num).trim() !== '') {
                          scorers_2.push(String(num).trim());
                          const joueur = joueurs_2.find(j => j.numero === String(num).trim());
                          if (joueur) {
                            const nomComplet = `${joueur.prenom} ${joueur.nom}`.trim();
                            if (nomComplet && !scorerNames_2.includes(nomComplet)) scorerNames_2.push(nomComplet);
                          }
                        }
                      }
                    }
                  }
                }

                // On ajoute ce match si on a bien les deux équipes
                if (team1 && team2) {
                  rows.push({
                    time,
                    team_1: team1,
                    score_1: score1,
                    score_2: score2,
                    team_2: team2,
                    lieu: location,
                    arbitres: [ref1, ref2, ref3].filter(Boolean).join(', '),
                    joueurs_1,
                    joueurs_2,
                    scorers_1,
                    scorers_2,
                    scorerNames_1,
                    scorerNames_2,
                  });
                }
              });
            }

            // Sauvegarde dans le localStorage si c'est la feuille principale (Nationals)
            if (sheetName.toLowerCase().includes('nationals') || sheetName.toLowerCase().includes('national')) {
              try {
                localStorage.setItem('resultatsData_nationals', JSON.stringify([{ title: `Swiss Cup ${location}`, data: rows }]));
              } catch (e) {
                // ignore erreur quota
              }
            }
            resolve({ title: `Swiss Cup ${location}`, data: rows });
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsArrayBuffer(file);
      })
    );

    return Promise.all(promises);
  };

  return (
    <ExcelContext.Provider value={{ parseExcelFiles }}>
      {children}
    </ExcelContext.Provider>
  );
};