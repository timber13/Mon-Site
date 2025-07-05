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
            // Lecture du fichier et de la première feuille
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const firstSheet = workbook.Sheets[sheetName];
            const location = firstSheet['B1']?.v || '';

            // Conversion de la feuille en tableau brut
            const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

            // Construire le dictionnaire joueurs par équipe
            const playersByTeam = {};
            workbook.SheetNames.forEach((name) => {
              if (name === sheetName) return;
              const ws = workbook.Sheets[name];
              const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
              const header = data[1] || [];
              const headerLow = header.map((h) => String(h).toLowerCase());
              const idxNum = headerLow.findIndex((h) => h.includes('numero'));
              const idxNom = headerLow.findIndex((h) => h.includes('nom'));
              const idxPrenom = headerLow.findIndex((h) => h.includes('prenom'));

              const joueurs = data.slice(2)
                .filter((row) => row[idxNum] || row[idxNom] || row[idxPrenom])
                .map((row) => ({
                  numero: row[idxNum] || '',
                  nom: row[idxNom] || '',
                  prenom: row[idxPrenom] || '',
                }));

              playersByTeam[name.trim().toLowerCase()] = joueurs;
            });

            // Parcours des lignes pour chaque bloc GAME
            const rows = [];
            for (let i = 0; i < sheetData.length; i++) {
              const row = sheetData[i] || [];
              const rowLow = row.map((c) => String(c).toLowerCase());
              if (rowLow.some((c) => c.includes('game'))) {
                const headerRow = sheetData[i + 1] || [];
                const dataRow = sheetData[i + 2] || [];

                const headerLow = headerRow.map((h) => String(h).toLowerCase());
                const idxTime = headerLow.findIndex((h) => h === 'time');
                const idxTeam1 = headerLow.findIndex((h) => h.includes('team_1') || h.includes('team 1'));
                const idxScore1 = headerLow.findIndex((h) => h === 'score');
                const idxScore2 = idxScore1 >= 0 ? idxScore1 + 1 : -1;
                const idxTeam2 = headerLow.findIndex((h) => h.includes('team_2') || h.includes('team 2'));
                const idxRef1 = headerLow.findIndex((h) => h.includes('ref 1'));
                const idxRef2 = headerLow.findIndex((h) => h.includes('ref 2'));
                const idxRef3 = headerLow.findIndex((h) => h.includes('ref 3'));

                // Extraction et formatage de l'heure
                let time = dataRow[idxTime] || '';
                if (typeof time === 'number') {
                  const totalMin = Math.round(time * 24 * 60);
                  const hh = String(Math.floor(totalMin / 60)).padStart(2, '0');
                  const mm = String(totalMin % 60).padStart(2, '0');
                  time = `${hh}:${mm}`;
                } else {
                  time = String(time).trim();
                }

                // Extraction des équipes et scores
                const team1 = dataRow[idxTeam1] || '';
                const score1 = dataRow[idxScore1] || '';
                const score2 = idxScore2 >= 0 ? dataRow[idxScore2] : '';
                const team2 = dataRow[idxTeam2] || '';

                // Extraction des arbitres
                const ref1 = dataRow[idxRef1] || '';
                const ref2 = dataRow[idxRef2] || '';
                const ref3 = dataRow[idxRef3] || '';

                // Associer les joueurs depuis le dictionnaire
                const joueurs_1 = playersByTeam[team1.trim().toLowerCase()] || [];
                const joueurs_2 = playersByTeam[team2.trim().toLowerCase()] || [];

                // Extraction des buteurs (numéros sous les scores) sur 4 lignes
                const scorers_1 = [];
                const scorers_2 = [];
                for (let k = 1; k <= 4; k++) {
                  const scorerRow = sheetData[i + 2 + k] || [];
                  // Pour les colonnes de l'équipe 1 avant Score1
                  for (let col = idxTeam1; col < idxScore1; col++) {
                    const num = scorerRow[col];
                    if (num && String(num).trim() !== '') scorers_1.push(String(num).trim());
                  }
                  // Pour les colonnes de l'équipe 2 après Score2
                  for (let col = idxScore2 + 1; col < idxRef1; col++) {
                    const num = scorerRow[col];
                    if (num && String(num).trim() !== '') scorers_2.push(String(num).trim());
                  }
                }

                // Associer les numéros de buteurs à leur nom/prénom pour classement buteurs
                // (on ajoute une propriété scorersByName_1 et scorersByName_2)
                const scorerNames_1 = scorers_1.map(num => {
                  const joueur = joueurs_1.find(j => String(j.numero).trim() === num);
                  return joueur ? (joueur.prenom + ' ' + joueur.nom).trim() : num;
                });
                const scorerNames_2 = scorers_2.map(num => {
                  const joueur = joueurs_2.find(j => String(j.numero).trim() === num);
                  return joueur ? (joueur.prenom + ' ' + joueur.nom).trim() : num;
                });

                // Ajout de la ligne si valide
                if (team1 && team2 && (score1 !== '' || score2 !== '')) {
                  rows.push({
                    time,
                    team_1: team1,
                    score_1: String(score1).trim(),
                    score_2: String(score2).trim(),
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
