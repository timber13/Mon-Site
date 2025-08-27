
import React, { useState, useContext } from 'react';
import { AdminContext } from '../contexts/AdminContext';
import RichTextEditor from './RichTextEditor';
import { supabase } from '../supabase/client';

function VisionStrategyEditor() {
  const isAdmin = useContext(AdminContext);
  const fontFamily = 'Oswald, Arial Black, Arial, sans-serif';
  const defaultText = `<h3 style='color:#c00;margin-bottom:12px;'>Our Vision</h3><p style='font-size:18px;'>Touch Switzerland aims to promote, develop and support Touch Rugby across the country, fostering inclusivity, excellence, and community spirit.</p>`;
  const [text, setText] = useState(defaultText);
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    async function fetchVision() {
      const { data } = await supabase.from('vision').select('*').single();
      setText(data?.text || defaultText);
      setDraft(data?.text || defaultText);
      setLoading(false);
    }
    fetchVision();
  }, []);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  const handleSave = () => {
    async function saveVision() {
      setText(draft);
      await supabase.from('vision').upsert({ id: 1, text: draft });
      setEditing(false);
    }
    saveVision();
  };
  const handleCancel = () => {
    setDraft(text);
    setEditing(false);
  };

  return (
    <div>
      <h2 style={{ color: '#c00', fontFamily }}>Vision & Strategy</h2>
      {isAdmin && !editing && (
        <button onClick={() => setEditing(true)} style={{ marginBottom: 18, fontFamily, background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Edit</button>
      )}
      {isAdmin && editing ? (
        <div style={{ marginTop: 12 }}>
          <RichTextEditor value={draft} onChange={setDraft} />
          <div>
            <button onClick={handleSave} style={{ marginRight: 10, fontFamily, background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Save</button>
            <button onClick={handleCancel} style={{ fontFamily, background: '#888', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 24, fontFamily, fontSize: 18 }} dangerouslySetInnerHTML={{ __html: text }} />
      )}
    </div>
  );
}

export default function AboutVision() {
  return <VisionStrategyEditor />;
}
