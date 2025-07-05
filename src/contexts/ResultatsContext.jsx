import React, { createContext, useState, useEffect } from 'react';

export const ResultatsContext = createContext();

export const ResultatsProvider = ({ children }) => {
  const [tables, setTables] = useState([]);

  // Charger depuis le localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('resultatsTables');
    if (saved) {
      try {
        setTables(JSON.parse(saved));
      } catch (err) {
        console.error("Erreur parsing localStorage:", err);
      }
    }
  }, []);

  // Sauvegarder à chaque modification
  useEffect(() => {
    localStorage.setItem('resultatsTables', JSON.stringify(tables));
  }, [tables]);

  const addTables = (newTables) => {
    setTables(prev => [...prev, ...newTables]);
  };

  const removeTable = (index) => {
    setTables(prev => prev.filter((_, i) => i !== index));
  };

  const clearTables = () => {
    setTables([]);
    localStorage.removeItem('resultatsTables');
  };

  const resetTables = () => {
    setTables([]);
  };

  return (
    <ResultatsContext.Provider
      value={{
        tables,
        setTables,
        addTables,
        removeTable,
        clearTables,
        resetTables, // ✅ ajout ici
      }}
    >
      {children}
    </ResultatsContext.Provider>
  );
};
