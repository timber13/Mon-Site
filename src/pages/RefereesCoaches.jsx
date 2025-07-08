
// Composant RefereesCoaches : affichage placeholder pour la section referees-coaches
import React from 'react';

export default function RefereesCoaches({ isAdmin = false }) {
  const [people, setPeople] = React.useState(() => {
    // Persistance locale
    const saved = localStorage.getItem('refereesCoaches');
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = React.useState({ nom: '', prenom: '', type: '', photo: '' });
  const [preview, setPreview] = React.useState('');

  React.useEffect(() => {
    localStorage.setItem('refereesCoaches', JSON.stringify(people));
  }, [people]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm(f => ({ ...f, photo: ev.target.result }));
        setPreview(ev.target.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.type || !form.photo) return;
    setPeople([...people, form]);
    setForm({ nom: '', prenom: '', type: '', photo: '' });
    setPreview('');
  };

  const style = {
    background: 'rgba(255,255,255,0.98)',
    borderRadius: 16,
    boxShadow: '0 2px 16px #c0020a',
    padding: '40px 32px',
    minHeight: 320,
    border: '1.5px solid #f8d7da',
    margin: '0 auto',
    maxWidth: 700,
    fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
    color: '#c00',
    fontWeight: 600,
    fontSize: '1.2rem',
    textAlign: 'center',
    letterSpacing: '0.04em',
  };

  return (
    <div style={style}>
      <div style={{ width: '100%' }}>
        <h2 style={{ color: '#c00', marginBottom: 24, fontWeight: 700, fontSize: '1.5em', letterSpacing: '0.04em' }}>Referees & Coaches</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {people.length === 0 && <div style={{ color: '#888', fontSize: 17 }}>Aucun coach ou referee ajouté.</div>}
          {people.map((p, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 18, background: '#fff0f0', borderRadius: 10, padding: 16, boxShadow: '0 2px 8px #c0020a22', position: 'relative' }}>
              <img src={p.photo} alt={p.nom + ' ' + p.prenom} style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: '50%', border: '2.5px solid #c00', background: '#fff' }} />
              <div style={{ flex: 1, textAlign: 'left', color: '#c00' }}>
                <div style={{ fontWeight: 700, fontSize: 20 }}>{p.prenom} {p.nom}</div>
                <div style={{ fontWeight: 400, fontSize: 16, color: '#a00', marginTop: 2 }}>{p.type}</div>
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    if(window.confirm('Supprimer ce profil ?')) {
                      setPeople(people.filter((_, i) => i !== idx));
                    }
                  }}
                  style={{ position: 'absolute', top: 10, right: 10, background: '#c00', color: 'white', border: 'none', borderRadius: '50%', width: 32, height: 32, fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #c0020a22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Supprimer"
                >×</button>
              )}
            </div>
          ))}
        </div>
        {isAdmin && (
          <form onSubmit={handleAdd} style={{ marginTop: 36, background: '#f8f8f8', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px #c0020a11', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <input type="file" name="photo" accept="image/*" onChange={handleChange} style={{ fontSize: 15 }} />
              {preview && <img src={preview} alt="preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '50%', border: '2px solid #c00', marginLeft: 8 }} />}
            </div>
            <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #c00', fontSize: 16, width: 180 }} />
            <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #c00', fontSize: 16, width: 180 }} />
            <input name="type" placeholder="Type de coach (ex: Referee, Coach, Assistant...)" value={form.type} onChange={handleChange} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #c00', fontSize: 16, width: 260 }} />
            <button type="submit" style={{ background: '#c00', color: 'white', border: 'none', borderRadius: 6, padding: '8px 22px', fontWeight: 700, fontSize: 16, marginTop: 8, cursor: 'pointer' }}>Ajouter</button>
          </form>
        )}
      </div>
    </div>
  );
}
