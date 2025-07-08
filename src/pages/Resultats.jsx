
// Page principale pour l'affichage et la gestion des résultats (Nationals, Regional West, Regional East)
import React, { useContext, useEffect, useState } from 'react';
import { useContext as useExcelContext } from 'react';
import { ExcelContext } from '../contexts/ExcelContext';
import { ResultatsContext } from '../contexts/ResultatsContext';
import ResultatsNationals from './Resultats_Nationals';
import ResultatsRegionalWest from './Resultats_Regional_West';
import ResultatsRegionalEast from './Resultats_Regional_East';

export default function Resultats({ isAdmin, adminEmail }) {
  // Contextes globaux pour la gestion des résultats et l'import Excel
  const { addTables, setTables } = useContext(ResultatsContext);
  const { parseExcelFiles } = useExcelContext(ExcelContext);

  // Etats locaux pour chaque catégorie de résultats
  const [tablesNationals, setTablesNationals] = useState([]); // Résultats nationaux
  const [tablesWest, setTablesWest] = useState([]);           // Résultats région Ouest
  const [tablesEast, setTablesEast] = useState([]);           // Résultats région Est
  const [activeTab, setActiveTab] = useState('nationals');    // Onglet actif

  // Au montage : charger les résultats sauvegardés dans le localStorage
  useEffect(() => {
    const savedN = localStorage.getItem('resultatsData_nationals');
    const savedW = localStorage.getItem('resultatsData_regionalWest');
    const savedE = localStorage.getItem('resultatsData_regionalEast');
    const nationals = savedN ? JSON.parse(savedN) : [];
    const west = savedW ? JSON.parse(savedW) : [];
    const east = savedE ? JSON.parse(savedE) : [];
    setTablesNationals(nationals);
    setTablesWest(west);
    setTablesEast(east);
    // Concatène toutes les tables pour TopScorers et les remet dans le contexte global (et localStorage)
    setTables([...nationals, ...west, ...east]);
  }, []);

  // Sauvegarder chaque catégorie dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('resultatsData_nationals', JSON.stringify(tablesNationals));
  }, [tablesNationals]);
  useEffect(() => {
    localStorage.setItem('resultatsData_regionalWest', JSON.stringify(tablesWest));
  }, [tablesWest]);
  useEffect(() => {
    localStorage.setItem('resultatsData_regionalEast', JSON.stringify(tablesEast));
  }, [tablesEast]);

  // Gestion de l'import de fichiers Excel pour chaque onglet
  const handleFileByTab = async (e, tab) => {
    const files = e.target.files;
    if (!files.length) return;
    try {
      const newTables = await parseExcelFiles(files);
      // Ajoute les nouvelles tables dans le contexte global (pour Scorers)
      addTables(newTables);
      // Ajoute les nouvelles tables dans l'état local correspondant
      if (tab === 'nationals')    setTablesNationals(prev => [...prev, ...newTables]);
      if (tab === 'regionalWest') setTablesWest(prev    => [...prev, ...newTables]);
      if (tab === 'regionalEast') setTablesEast(prev    => [...prev, ...newTables]);
    } catch (err) {
      console.error('Erreur lecture fichiers:', err);
    }
    e.target.value = '';
  };

  // Réinitialise les résultats pour un onglet donné
  const resetDataByTab = (tab) => {
    if (!window.confirm('Voulez-vous vraiment réinitialiser tous les résultats ?')) return;
    let newNationals = tablesNationals;
    let newWest = tablesWest;
    let newEast = tablesEast;
    if (tab === 'nationals') {
      localStorage.removeItem('resultatsData_nationals');
      setTablesNationals([]);
      newNationals = [];
    }
    if (tab === 'regionalWest') {
      localStorage.removeItem('resultatsData_regionalWest');
      setTablesWest([]);
      newWest = [];
    }
    if (tab === 'regionalEast') {
      localStorage.removeItem('resultatsData_regionalEast');
      setTablesEast([]);
      newEast = [];
    }
    // Met à jour le contexte global pour TopScorers avec toutes les tables restantes
    setTables([...newNationals, ...newWest, ...newEast]);
  };

  // Styles pour les boutons d'onglet
  const styles = {
    container: { maxWidth: 900, margin: 'auto', padding: 20, position: 'relative' },
    tabBtn: (active) => ({
      padding: '8px 16px',
      marginRight: 8,
      borderRadius: 4,
      border: '1px solid #c00',
      background: active ? '#c00' : '#fff',
      color: active ? '#fff' : '#c00',
      cursor: 'pointer',
      fontWeight: 'bold',
    })
  };

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
      {/* Barre d'onglets horizontale pour naviguer entre les catégories de résultats */}
      <nav
        style={{
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
        }}
      >
        {/* Liste des onglets */}
        {[
          { key: 'nationals', label: 'Nationals'},
          { key: 'regionalWest', label: 'Regional West'},
          { key: 'regionalEast', label: 'Regional East'},
        ].map((tab, idx, arr) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key ? 'linear-gradient(90deg, #c00 60%, #ff4d4d 100%)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : '#c00',
              border: 'none',
              borderRight: idx < arr.length - 1 ? '1.5px solid #c00' : 'none',
              borderRadius: 0,
              padding: '18px 38px',
              fontWeight: 700,
              fontSize: '1.08rem',
              cursor: 'pointer',
              boxShadow: activeTab === tab.key ? '0 2px 12px #c003' : 'none',
              transition: 'all 0.16s',
              outline: 'none',
              minWidth: 120,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              letterSpacing: '0.04em',
              textShadow: activeTab === tab.key ? '0 2px 8px #a00a' : 'none',
              textTransform: 'uppercase',
            }}
            title={tab.label}
          >
            <span style={{ fontSize: '1.3em', marginRight: 2 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
      {/* Affichage du contenu selon l'onglet actif */}
      <main
        style={{
          background: 'rgba(255,255,255,0.98)',
          borderRadius: 16,
          boxShadow: '0 2px 16px #c0020a',
          padding: '40px 32px',
          minHeight: 420,
          border: '1.5px solid #f8d7da',
          margin: '0 auto',
          maxWidth: 750,
          fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
        }}
      >
        {/* Nationals */}
        {activeTab === 'nationals' && (
          <ResultatsNationals
            isAdmin={isAdmin}
            tablesNationals={tablesNationals}
            setTablesNationals={setTablesNationals}
            onImport={(e) => handleFileByTab(e, 'nationals')}
            onReset={() => resetDataByTab('nationals')}
          />
        )}
        {/* Regional West */}
        {activeTab === 'regionalWest' && (
          <ResultatsRegionalWest
            isAdmin={isAdmin}
            tablesWest={tablesWest}
            setTablesWest={setTablesWest}
            onImport={(e) => handleFileByTab(e, 'regionalWest')}
            onReset={() => resetDataByTab('regionalWest')}
          />
        )}
        {/* Regional East */}
        {activeTab === 'regionalEast' && (
          <ResultatsRegionalEast
            isAdmin={isAdmin}
            tablesEast={tablesEast}
            setTablesEast={setTablesEast}
            onImport={(e) => handleFileByTab(e, 'regionalEast')}
            onReset={() => resetDataByTab('regionalEast')}
          />
        )}
      </main>
    </div>
  );
}

