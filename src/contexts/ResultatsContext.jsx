import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export const ResultatsContext = createContext();

export const ResultatsProvider = ({ children }) => {
  const [tables, setTables] = useState([]);

  // Charger depuis le localStorage au démarrage
  useEffect(() => {
    fetchTables();
  }, []);

  async function fetchTables() {
    const { data, error } = await supabase.from('resultats').select('*').order('created_at', { ascending: false });
    setTables(data || []);
  }

  // Sauvegarder à chaque modification
  useEffect(() => {
    // Plus besoin de localStorage, tout est sur Supabase
  }, [tables]);

  const addTables = (newTables) => {
    Promise.all(newTables.map(async (table) => {
      await supabase.from('resultats').insert([table]);
    })).then(fetchTables);
  };

  const removeTable = (index) => {
  const table = tables[index];
  supabase.from('resultats').delete().eq('id', table.id).then(fetchTables);
  };

  const clearTables = () => {
  supabase.from('resultats').delete().neq('id', 0).then(fetchTables);
  };

  const resetTables = () => {
  supabase.from('resultats').delete().neq('id', 0).then(fetchTables);
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
