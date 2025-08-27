import React, { useState, useContext, useRef } from 'react';
import { AdminContext } from '../contexts/AdminContext';
import RichTextEditor from './RichTextEditor';
import SeniorsSwissTeam from './SeniorsSwissTeam';
import { supabase } from '../supabase/client';

const tabs = [
  { key: 'swiss', label: 'The Swiss Team' },
  { key: 'competitions', label: 'Competitions' },
  { key: 'selections', label: 'Selections' },
];

const tabContents = {
  swiss: null, // sera généré dynamiquement
  competitions: null,
  selections: (
    <div>
      <h2 style={{ color: '#c00', fontSize: 28, marginBottom: 18 }}>Selections</h2>
      <p style={{ fontSize: 18, color: '#222' }}>Selection process and info for players.</p>
    </div>
  ),
};

export default function NationalTeam() {
  // Stockage des équipes par compétition
  const [competitionTeams, setCompetitionTeams] = useState({});
  const [teamName, setTeamName] = useState('');
  const [teamLink, setTeamLink] = useState('');

  // Ajout d'une équipe pour la compétition sélectionnée
  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    const { data } = await supabase.from('competition_teams').select('*');
    // Regroupe par compétition
    const grouped = {};
    (data || []).forEach(team => {
      if (!grouped[team.competition]) grouped[team.competition] = [];
      grouped[team.competition].push({ name: team.name, link: team.link, id: team.id });
    });
    setCompetitionTeams(grouped);
  }

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim() || !teamLink.trim()) return;
    await supabase.from('competition_teams').insert([{ competition: selectedComp, name: teamName.trim(), link: teamLink.trim() }]);
    setTeamName('');
    setTeamLink('');
    fetchTeams();
  };

  // Suppression d'une équipe
  const handleRemoveTeam = async (idx) => {
    const team = competitionTeams[selectedComp][idx];
    await supabase.from('competition_teams').delete().eq('id', team.id);
    fetchTeams();
  };
  // Competitions menu state
  const competitionsList = [
    'Euro Open 2025',
    'Euro Senior 2025',
    'World cup 2024',
    'Euro 2023',
    'Euro 2022',
    'Archives',
  ];
  const [selectedComp, setSelectedComp] = useState(competitionsList[0]);
  // Font size options for Swiss Team block (doit être défini avant toute utilisation)
  const sizeOptions = [11, 13, 15, 18, 22, 28];
  const [activeTab, setActiveTab] = useState('swiss');
  const isAdmin = useContext(AdminContext);
  const fontOptions = [
    { label: 'Oswald', value: 'Oswald, Arial Black, Arial, sans-serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times', value: 'Times New Roman, Times, serif' },
    { label: 'Roboto', value: 'Roboto, Arial, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Comic Sans', value: 'Comic Sans MS, cursive, sans-serif' },
  ];
  // Font and size for Swiss Team block
  const [swissFontFamily, setSwissFontFamily] = useState(() => localStorage.getItem('swissFontFamily') || fontOptions[0].value);
  const [swissFontSize, setSwissFontSize] = useState(() => Number(localStorage.getItem('swissFontSize')) || 11);
  const handleSwissFontChange = (e) => {
    setSwissFontFamily(e.target.value);
    localStorage.setItem('swissFontFamily', e.target.value);
  };
  const handleSwissSizeChange = (e) => {
    setSwissFontSize(Number(e.target.value));
    localStorage.setItem('swissFontSize', e.target.value);
  };
  const [text, setText] = useState(() => {
    try {
      return localStorage.getItem('swissTeamText') || `<h3 style='color:#c00;margin-bottom:12px;'>Swiss National Team</h3><p style='font-size:18px;'>Write here about the Swiss National Team, its values, history, and achievements.</p>`;
    } catch {
      return `<h3 style='color:#c00;margin-bottom:12px;'>Swiss National Team</h3><p style='font-size:18px;'>Write here about the Swiss National Team, its values, history, and achievements.</p>`;
    }
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => text);
  const [image, setImage] = useState(() => {
    try {
      return localStorage.getItem('swissTeamImage') || null;
    } catch {
      return null;
    }
  });
  const fileInputRef = useRef();

  const handleSave = () => {
    setText(draft);
    localStorage.setItem('swissTeamText', draft);
    setEditing(false);
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
      reader.onload = (ev) => {
        setImage(ev.target.result);
        localStorage.setItem('swissTeamImage', ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabBtnStyle = (active) => ({
    background: active ? 'linear-gradient(90deg, #c00 60%, #ff4d4d 100%)' : '#fff',
    color: active ? '#fff' : '#c00',
    border: 'none',
    borderBottom: active ? '3px solid #c00' : '3px solid #eee',
    borderRadius: active ? '16px 16px 0 0' : '16px 16px 0 0',
    padding: '10px 22px 8px 22px',
    fontWeight: 700,
    fontSize: '1.02rem',
    cursor: 'pointer',
    boxShadow: active ? '0 2px 12px #c003' : '0 1px 4px #c0032',
    transition: 'all 0.16s',
    outline: 'none',
    minWidth: 90,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    letterSpacing: '0.04em',
    textShadow: active ? '0 2px 8px #a00a' : 'none',
    textTransform: 'uppercase',
    fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
  });

  return (
    <div style={{ padding: 48, fontFamily: 'Oswald, Arial Black, Arial, sans-serif', color: '#c00', fontSize: 32 }}>
  <h1 style={{ marginBottom: 24 }}>National Team</h1>
      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        background: 'none',
        border: 'none',
        boxShadow: 'none',
        fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        minHeight: 54,
        gap: 0,
        borderRadius: '16px 16px 0 0',
        borderBottom: '2px solid #f8d7da',
        marginBottom: 24,
        backgroundColor: '#fff',
        boxShadow: '0 2px 12px #c0032',
        overflowX: 'auto',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={tabBtnStyle(activeTab === tab.key)}
            aria-selected={activeTab === tab.key}
            title={tab.label}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div style={{ flex: 1, padding: '18px 0', minHeight: 120, width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        {activeTab === 'swiss' ? (
          <>
            {/* Bloc 1 : The Swiss Team (photo à droite) */}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 32, marginBottom: 38 }}>
              <div style={{ flex: 2 }}>
                <h2 style={{ color: '#c00', fontSize: 28, marginBottom: 18 }}>The Swiss Team</h2>
                {/* Font/size selectors for Swiss Team block, admin only */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                    <div>
                      <label htmlFor="swiss-font-select" style={{ fontWeight: 700, color: '#c00', fontSize: 15, marginRight: 8 }}>Font :</label>
                      <select id="swiss-font-select" value={swissFontFamily} onChange={handleSwissFontChange} style={{ fontSize: 15, padding: '6px 18px', borderRadius: 8, border: '1.5px solid #c00', fontFamily: swissFontFamily }}>
                        {fontOptions.map(opt => (
                          <option key={opt.value} value={opt.value} style={{ fontFamily: opt.value }}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="swiss-size-select" style={{ fontWeight: 700, color: '#c00', fontSize: 15, marginRight: 8 }}>Size :</label>
                      <select id="swiss-size-select" value={swissFontSize} onChange={handleSwissSizeChange} style={{ fontSize: 15, padding: '6px 18px', borderRadius: 8, border: '1.5px solid #c00' }}>
                        {sizeOptions.map(size => (
                          <option key={size} value={size}>{size}px</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {isAdmin && !editing && (
                  <button onClick={handleEdit} style={{ marginBottom: 18, fontFamily: swissFontFamily, background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Edit</button>
                )}
                {isAdmin && editing ? (
                  <div style={{ marginTop: 12 }}>
                    <RichTextEditor value={draft} onChange={setDraft} />
                    <div style={{ marginTop: 10 }}>
                      <button onClick={handleSave} style={{ marginRight: 10, fontFamily: swissFontFamily, background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Save</button>
                      <button onClick={handleCancel} style={{ fontFamily: swissFontFamily, background: '#888', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 24, fontFamily: swissFontFamily, fontSize: swissFontSize }} dangerouslySetInnerHTML={{ __html: text }} />
                )}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minWidth: 180 }}>
                <div style={{ marginBottom: 12 }}>
                  {image ? (
                    <img src={image} alt="Swiss Team" style={{ width: 260, height: 180, objectFit: 'cover', borderRadius: 16, border: '3px solid #c00' }} />
                  ) : (
                    <div style={{ width: 180, height: 180, background: '#eee', borderRadius: 16, border: '3px solid #c00', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c00', fontSize: 18 }}>No image</div>
                  )}
                </div>
                {isAdmin && (
                  <>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ marginBottom: 8 }} />
                {image && <button onClick={() => { setImage(null); localStorage.removeItem('swissTeamImage'); }} style={{ fontFamily: swissFontFamily, background: '#888', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Remove</button>}
                  </>
                )}
              </div>
            </div>

            {/* Bloc 2 : The Seniors Swiss Team (photo à gauche) */}
            <SeniorsSwissTeam isAdmin={isAdmin} fontFamily={swissFontFamily} />
          </>
        ) : activeTab === 'competitions' ? (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', minHeight: 320, width: '100%' }}>
            <nav style={{ minWidth: 180, background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px #c0032', border: '1.5px solid #c00', padding: '18px 0', marginRight: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {competitionsList.map(comp => (
                <button
                  key={comp}
                  onClick={() => setSelectedComp(comp)}
                  style={{
                    background: selectedComp === comp ? 'linear-gradient(90deg, #c00 60%, #ff4d4d 100%)' : 'transparent',
                    color: selectedComp === comp ? '#fff' : '#c00',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 18px',
                    fontWeight: 700,
                    fontSize: 17,
                    cursor: 'pointer',
                    fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
                    boxShadow: selectedComp === comp ? '0 2px 8px #c0032' : 'none',
                    transition: 'all 0.16s',
                    outline: 'none',
                    textAlign: 'left',
                  }}
                >
                  {comp}
                </button>
              ))}
            </nav>
            <div style={{ flex: 1, padding: '12px 0 12px 0' }}>
              <h2 style={{ color: '#c00', fontSize: 28, marginBottom: 18 }}>{selectedComp}</h2>
              {/* List of teams for the selected competition */}
              {competitionTeams[selectedComp] && competitionTeams[selectedComp].length > 0 && (
                <ul style={{ marginBottom: 18 }}>
                  {competitionTeams[selectedComp].map((team, idx) => (
                    <li key={idx} style={{ fontSize: 18, marginBottom: 6, color: '#222', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <a href={team.link} target="_blank" rel="noopener noreferrer" style={{ color: '#c00', fontWeight: 700, textDecoration: 'underline', fontSize: 18 }}>{team.name}</a>
                      {isAdmin && (
                        <button onClick={() => handleRemoveTeam(idx)} style={{ background: '#eee', color: '#c00', border: 'none', borderRadius: 6, padding: '2px 10px', fontSize: 14, cursor: 'pointer' }}>✕</button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {/* Admin form to add a team */}
              {isAdmin && (
                <form onSubmit={handleAddTeam} style={{ display: 'flex', gap: 12, marginBottom: 18, alignItems: 'center' }}>
                  <input
                    type="text"
                    value={teamName}
                    onChange={e => setTeamName(e.target.value)}
                    placeholder="Team name"
                    style={{ fontSize: 16, padding: '6px 12px', borderRadius: 8, border: '1.5px solid #c00', minWidth: 120 }}
                  />
                  <input
                    type="url"
                    value={teamLink}
                    onChange={e => setTeamLink(e.target.value)}
                    placeholder="Results link"
                    style={{ fontSize: 16, padding: '6px 12px', borderRadius: 8, border: '1.5px solid #c00', minWidth: 180 }}
                  />
                  <button type="submit" style={{ background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Add</button>
                </form>
              )}
              <p style={{ fontSize: 18, color: '#222' }}>Details and results for {selectedComp} will appear here.</p>
            </div>
          </div>
        ) : (
          tabContents[activeTab]
        )}
      </div>
    </div>
  );
}
