import React, { useState, useRef } from 'react';
import RichTextEditor from './RichTextEditor';
import { supabase } from '../supabase/client';

export default function SeniorsSwissTeam({ isAdmin, fontFamily }) {
  // Texte
  const defaultText = `<h3 style='color:#c00;margin-bottom:12px;'>The Seniors Swiss Team</h3><p style='font-size:18px;'>Write here about the Seniors Swiss Team, its values, history, and achievements.</p>`;
  const [text, setText] = useState(defaultText);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(defaultText);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    async function fetchSeniors() {
      const { data } = await supabase.from('seniors_swiss_team').select('*').single();
      setText(data?.text || defaultText);
      setDraft(data?.text || defaultText);
      setImage(data?.image || null);
      setLocalFont(data?.font || 'Oswald, Arial Black, Arial, sans-serif');
      setLocalSize(data?.size || 11);
      setLoading(false);
    }
    fetchSeniors();
  }, []);
  const fileInputRef = useRef();

  // Police et taille
  const fontOptions = [
    { label: 'Oswald', value: 'Oswald, Arial Black, Arial, sans-serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times', value: 'Times New Roman, Times, serif' },
    { label: 'Roboto', value: 'Roboto, Arial, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Comic Sans', value: 'Comic Sans MS, cursive, sans-serif' },
  ];
  const sizeOptions = [11, 13, 15, 18, 22, 28];
  const [localFont, setLocalFont] = useState(() => localStorage.getItem('seniorsFontFamily') || fontOptions[0].value);
  const [localSize, setLocalSize] = useState(() => Number(localStorage.getItem('seniorsFontSize')) || 11);
  const handleFontChange = (e) => {
  setLocalFont(e.target.value);
  supabase.from('seniors_swiss_team').upsert({ id: 1, font: e.target.value });
  };
  const handleSizeChange = (e) => {
  setLocalSize(Number(e.target.value));
  supabase.from('seniors_swiss_team').upsert({ id: 1, size: Number(e.target.value) });
  };

  const handleSave = () => {
    async function saveSeniors() {
      setText(draft);
      await supabase.from('seniors_swiss_team').upsert({ id: 1, text: draft });
      setEditing(false);
    }
    saveSeniors();
  };
  const handleEdit = () => {
    setDraft(text);
    setEditing(true);
  };
  const handleCancel = () => {
    setDraft(text);
    setEditing(false);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new window.FileReader();
      reader.onload = async (ev) => {
        setImage(ev.target.result);
        await supabase.from('seniors_swiss_team').upsert({ id: 1, image: ev.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 32, marginBottom: 38 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minWidth: 180 }}>
        <div style={{ marginBottom: 12 }}>
          {image ? (
            <img src={image} alt="Seniors Swiss Team" style={{ width: 260, height: 180, objectFit: 'cover', borderRadius: 16, border: '3px solid #c00' }} />
          ) : (
            <div style={{ width: 180, height: 180, background: '#eee', borderRadius: 16, border: '3px solid #c00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c00', fontSize: 18 }}>No image</div>
          )}
        </div>
        {isAdmin && (
          <>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ marginBottom: 8 }} />
        {image && <button onClick={() => { setImage(null); localStorage.removeItem('seniorsSwissTeamImage'); }} style={{ fontFamily: localFont, background: '#888', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Remove</button>}
  {image && <button onClick={async () => { setImage(null); await supabase.from('seniors_swiss_team').upsert({ id: 1, image: null }); }} style={{ fontFamily: localFont, background: '#888', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Remove</button>}
          </>
        )}
      </div>
      <div style={{ flex: 2 }}>
        <h2 style={{ color: '#c00', fontSize: 28, marginBottom: 8 }}>The Seniors Swiss Team</h2>
        {/* Font/size selectors for Seniors Swiss Team block, admin only */}
        {isAdmin && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
            <div>
              <label htmlFor="seniors-font-select" style={{ fontWeight: 700, color: '#c00', fontSize: 15, marginRight: 8 }}>Police :</label>
              <select id="seniors-font-select" value={localFont} onChange={handleFontChange} style={{ fontSize: 15, padding: '6px 18px', borderRadius: 8, border: '1.5px solid #c00', fontFamily: localFont }}>
                {fontOptions.map(opt => (
                  <option key={opt.value} value={opt.value} style={{ fontFamily: opt.value }}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="seniors-size-select" style={{ fontWeight: 700, color: '#c00', fontSize: 15, marginRight: 8 }}>Taille :</label>
              <select id="seniors-size-select" value={localSize} onChange={handleSizeChange} style={{ fontSize: 15, padding: '6px 18px', borderRadius: 8, border: '1.5px solid #c00' }}>
                {sizeOptions.map(size => (
                  <option key={size} value={size}>{size}px</option>
                ))}
              </select>
            </div>
          </div>
        )}
        {isAdmin && !editing && (
          <button onClick={handleEdit} style={{ marginBottom: 10, fontFamily: localFont, background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Edit</button>
        )}
        {isAdmin && editing ? (
          <div style={{ marginTop: 6 }}>
            <RichTextEditor value={draft} onChange={setDraft} />
            <div style={{ marginTop: 6 }}>
              <button onClick={handleSave} style={{ marginRight: 8, fontFamily: localFont, background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Save</button>
              <button onClick={handleCancel} style={{ fontFamily: localFont, background: '#888', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 10, fontFamily: localFont, fontSize: localSize }} dangerouslySetInnerHTML={{ __html: text }} />
        )}
      </div>
    </div>
  );
}
