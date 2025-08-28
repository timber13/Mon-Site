
import { supabase } from '../../supabase/client';
import React, { useState, useContext } from 'react';
import { AdminContext } from '../contexts/AdminContext';

function ExecutiveCommitteeTable() {
  const isAdmin = useContext(AdminContext);
  const [rows, setRows] = useState([
    { name: 'Tom Pulles', role: 'President', email: 'president@touchswitzerland.ch' },
    { name: 'Ania Tomaszewska', role: 'Operational Excellence/Secretary', email: 'secretary@touchswitzerland.ch' },
    { name: 'Thom Klaus', role: 'Treasurer', email: 'treasurer@touchswitzerland.ch' },
    { name: 'Jen Hinam', role: 'Marketing and Financial Sustainability', email: '—' },
    { name: 'Anika Rahm', role: 'Competition, Pathways and Events', email: 'events@touchswitzerland.ch' },
    { name: 'Creedy Waetford', role: 'Player, Coach and Referee Development', email: '—' },
    { name: 'Michèle Coco', role: 'Referee Director', email: 'referees@touchswitzerland.ch' },
    { name: 'Nazanin Azari', role: 'Women’s Engagment', email: 'women@touchswitzerland.ch' },
    { name: 'Sandra Schärer', role: 'Youth Engagement', email: 'youth@touchswitzerland.ch' },
    { name: 'Luciano Bello', role: 'Webmaster', email: '—' },
  ]);
  const [editIdx, setEditIdx] = useState(null);
  const [editRow, setEditRow] = useState({ role: '', name: '', email: '' });
  const [adding, setAdding] = useState(false);

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditRow(rows[idx]);
    setAdding(false);
  };
  const handleDelete = (idx) => {
    setRows(rows.filter((_, i) => i !== idx));
    setEditIdx(null);
    setAdding(false);
  };
  const handleSave = () => {
    if (editIdx === null) return;
    const newRows = [...rows];
    newRows[editIdx] = editRow;
    setRows(newRows);
    setEditIdx(null);
  };
  const handleAdd = () => {
    if (!editRow.role || !editRow.name || !editRow.email) return;
    setRows([...rows, editRow]);
    setEditRow({ role: '', name: '', email: '' });
    setAdding(false);
  };

  const fontFamily = 'Oswald, Arial Black, Arial, sans-serif';
  return (
    <>
      <h2 style={{ color: '#c00', fontFamily }}>Executive Committee</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily, fontSize: 18, marginBottom: 32 }}>
        <thead>
          <tr style={{ background: '#f5f5f5', color: '#c00', fontWeight: 700 }}>
            <th style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>Role</th>
            <th style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>Name</th>
            <th style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>Email</th>
            {isAdmin && <th style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              {editIdx === idx ? (
                <>
                  <td style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>
                    <input value={editRow.role} onChange={e => setEditRow({ ...editRow, role: e.target.value })} style={{ fontFamily, fontSize: 16, width: '100%' }} />
                  </td>
                  <td style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>
                    <input value={editRow.name} onChange={e => setEditRow({ ...editRow, name: e.target.value })} style={{ fontFamily, fontSize: 16, width: '100%' }} />
                  </td>
                  <td style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>
                    <input value={editRow.email} onChange={e => setEditRow({ ...editRow, email: e.target.value })} style={{ fontFamily, fontSize: 16, width: '100%' }} />
                  </td>
                  {isAdmin && (
                    <td style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>
                      <button onClick={handleSave} style={{ marginRight: 8, fontFamily, background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Save</button>
                      <button onClick={() => setEditIdx(null)} style={{ fontFamily, background: '#888', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                    </td>
                  )}
                </>
              ) : (
                <>
                  <td style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>{row.role}</td>
                  <td style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>{row.name}</td>
                  <td style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>{row.email}</td>
                  {isAdmin && (
                    <td style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>
                      <button onClick={() => handleEdit(idx)} style={{ marginRight: 8, fontFamily, background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(idx)} style={{ fontFamily, background: '#888', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Delete</button>
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
          {isAdmin && adding && (
            <tr>
              <td style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>
                <input value={editRow.role} onChange={e => setEditRow({ ...editRow, role: e.target.value })} style={{ fontFamily, fontSize: 16, width: '100%' }} />
              </td>
              <td style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>
                <input value={editRow.name} onChange={e => setEditRow({ ...editRow, name: e.target.value })} style={{ fontFamily, fontSize: 16, width: '100%' }} />
              </td>
              <td style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>
                <input value={editRow.email} onChange={e => setEditRow({ ...editRow, email: e.target.value })} style={{ fontFamily, fontSize: 16, width: '100%' }} />
              </td>
              <td style={{ padding: '2px 12px', border: '1.5px solid #c00' }}>
                <button onClick={handleAdd} style={{ marginRight: 8, fontFamily, background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Add</button>
                <button onClick={() => { setAdding(false); setEditRow({ role: '', name: '', email: '' }); }} style={{ fontFamily, background: '#888', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isAdmin && !adding && editIdx === null && (
        <button onClick={() => { setAdding(true); setEditRow({ role: '', name: '', email: '' }); }} style={{ fontFamily, background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Add Row</button>
      )}
    </>
  );
}

export default function AboutExecutive() {
  return <ExecutiveCommitteeTable />;
}
