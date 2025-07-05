import React, { useContext, useEffect, useState } from 'react';
import { useContext as useExcelContext } from 'react';
import { ExcelContext } from '../contexts/ExcelContext';
import { ResultatsContext } from '../contexts/ResultatsContext';
import ResultatsNationals from './Resultats_Nationals';
import ResultatsRegionalWest from './Resultats_Regional_West';
import ResultatsRegionalEast from './Resultats_Regional_East';

export default function Resultats({ isAdmin, adminEmail }) {
  const { addTables } = useContext(ResultatsContext);
  const { parseExcelFiles } = useExcelContext(ExcelContext);

  const [tablesNationals, setTablesNationals] = useState([]);
  const [tablesWest, setTablesWest] = useState([]);
  const [tablesEast, setTablesEast] = useState([]);
  const [activeTab, setActiveTab] = useState('nationals');

  // Charger depuis localStorage au montage
  useEffect(() => {
    const savedN = localStorage.getItem('resultatsData_nationals');
    const savedW = localStorage.getItem('resultatsData_regionalWest');
    const savedE = localStorage.getItem('resultatsData_regionalEast');
    setTablesNationals(savedN ? JSON.parse(savedN) : []);
    setTablesWest(savedW ? JSON.parse(savedW) : []);
    setTablesEast(savedE ? JSON.parse(savedE) : []);
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem('resultatsData_nationals', JSON.stringify(tablesNationals));
  }, [tablesNationals]);
  useEffect(() => {
    localStorage.setItem('resultatsData_regionalWest', JSON.stringify(tablesWest));
  }, [tablesWest]);
  useEffect(() => {
    localStorage.setItem('resultatsData_regionalEast', JSON.stringify(tablesEast));
  }, [tablesEast]);

  const handleFileByTab = async (e, tab) => {
    const files = e.target.files;
    if (!files.length) return;
    try {
      const newTables = await parseExcelFiles(files);
      // 👉 injecter dans le contexte global pour Scorers.jsx
      addTables(newTables);
      if (tab === 'nationals')    setTablesNationals(prev => [...prev, ...newTables]);
      if (tab === 'regionalWest') setTablesWest(prev    => [...prev, ...newTables]);
      if (tab === 'regionalEast') setTablesEast(prev    => [...prev, ...newTables]);
    } catch (err) {
      console.error('Erreur lecture fichiers:', err);
    }
    e.target.value = '';
  };

  const resetDataByTab = (tab) => {
    if (!window.confirm('Voulez-vous vraiment réinitialiser tous les résultats ?')) return;
    if (tab === 'nationals') {
      localStorage.removeItem('resultatsData_nationals');
      setTablesNationals([]);
    }
    if (tab === 'regionalWest') {
      localStorage.removeItem('resultatsData_regionalWest');
      setTablesWest([]);
    }
    if (tab === 'regionalEast') {
      localStorage.removeItem('resultatsData_regionalEast');
      setTablesEast([]);
    }
  };

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
    }),
  };

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <button style={styles.tabBtn(activeTab==='nationals')} onClick={() => setActiveTab('nationals')}>
          Nationals
        </button>
        <button style={styles.tabBtn(activeTab==='regionalWest')} onClick={() => setActiveTab('regionalWest')}>
          Regional West
        </button>
        <button style={styles.tabBtn(activeTab==='regionalEast')} onClick={() => setActiveTab('regionalEast')}>
          Regional East
        </button>
      </div>

      {activeTab === 'nationals' && (
        <ResultatsNationals
          isAdmin={isAdmin}
          tablesNationals={tablesNationals}
          setTablesNationals={setTablesNationals}
          onImport={(e) => handleFileByTab(e, 'nationals')}
          onReset={() => resetDataByTab('nationals')}
        />
      )}
      {activeTab === 'regionalWest' && (
        <ResultatsRegionalWest
          isAdmin={isAdmin}
          tablesWest={tablesWest}
          setTablesWest={setTablesWest}
          onImport={(e) => handleFileByTab(e, 'regionalWest')}
          onReset={() => resetDataByTab('regionalWest')}
        />
      )}
      {activeTab === 'regionalEast' && (
        <ResultatsRegionalEast
          isAdmin={isAdmin}
          tablesEast={tablesEast}
          setTablesEast={setTablesEast}
          onImport={(e) => handleFileByTab(e, 'regionalEast')}
          onReset={() => resetDataByTab('regionalEast')}
        />
      )}
    </div>
  );
}

