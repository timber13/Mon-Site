
import { supabase } from '../../supabase/client';
import React, { createContext } from 'react';

// Par défaut, non admin
export const AdminContext = createContext(false);

// Utilisation :
// <AdminContext.Provider value={true|false}>...</AdminContext.Provider>
