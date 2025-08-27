
import React, { useState, useRef, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminContext } from '../contexts/AdminContext';
import { supabase } from '../../supabase/client';

export default function Club() {
  const { t } = useTranslation();
  const isAdmin = useContext(AdminContext);
  const [showModal, setShowModal] = useState(false);
  const [clubs, setClubs] = useState([]);

  const [clubName, setClubName] = useState('');
  const [clubCity, setClubCity] = useState('');
  const [clubImage, setClubImage] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubDescription, setClubDescription] = useState('');
  const [clubLink, setClubLink] = useState('');
  const [clubColor1, setClubColor1] = useState('#c00');
  const [clubColor2, setClubColor2] = useState('#fff');
  const [clubTitles, setClubTitles] = useState(''); // Swisscup winner years, comma separated
  const fileInputRef = useRef();

  // Effet pour changer la couleur de la barre du menu selon le club sélectionné
  useEffect(() => {
    fetchClubs();
  }, []);

  async function fetchClubs() {
    const { data } = await supabase.from('clubs').select('*').order('created_at', { ascending: false });
    setClubs(data || []);
  }
  useEffect(() => {
    const menuBar = document.querySelector('.menu-bar');
    if (selectedClub && selectedClub.color1 && menuBar) {
      menuBar.style.background = selectedClub.color1;
    } else if (menuBar) {
      // Remet le fond rouge par défaut
      menuBar.style.background = 'linear-gradient(90deg, #e30613 0%, #b8000a 100%)';
    }
    return () => {
      if (menuBar) menuBar.style.background = 'linear-gradient(90deg, #e30613 0%, #b8000a 100%)';
    };
  }, [selectedClub]);

  const handleAddClub = async () => {
    if (!clubName.trim() || !clubCity.trim()) return;
    await supabase.from('clubs').insert([
      {
        name: clubName,
        city: clubCity,
        image: clubImage,
        description: clubDescription,
        link: clubLink,
        color1: clubColor1,
        color2: clubColor2,
        titles: clubTitles.split(',').map(y => y.trim()).filter(y => y),
      },
    ]);
    setClubName('');
    setClubCity('');
    setClubImage(null);
    setClubDescription('');
    setClubLink('');
    setClubColor1('#c00');
    setClubColor2('#fff');
    setClubTitles('');
    setShowModal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    fetchClubs();
  };
  // Sauvegarde automatique si clubs changent (pour modifications futures)
  // Synchronisation automatique retirée (Supabase gère la persistance)
  // Effet pour changer le fond selon les couleurs du club sélectionné
  useEffect(() => {
    if (selectedClub && selectedClub.color1 && selectedClub.color2) {
      document.body.style.background = `linear-gradient(135deg, ${selectedClub.color1} 0%, ${selectedClub.color2} 100%)`;
    } else {
      document.body.style.background = '';
    }
    return () => {
      document.body.style.background = '';
    };
  }, [selectedClub]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setClubImage(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setClubImage(null);
    }
  };

  // Affichage page dédiée club
  const [editModal, setEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editLink, setEditLink] = useState('');
  const [editColor1, setEditColor1] = useState('#c00');
  const [editColor2, setEditColor2] = useState('#fff');
  const [editTitles, setEditTitles] = useState('');

  const openEditModal = () => {
    setEditName(selectedClub.name);
    setEditCity(selectedClub.city);
    setEditImage(selectedClub.image);
    setEditDescription(selectedClub.description || '');
    setEditLink(selectedClub.link || '');
    setEditColor1(selectedClub.color1 || '#c00');
    setEditColor2(selectedClub.color2 || '#fff');
    setEditTitles(selectedClub.titles ? selectedClub.titles.join(', ') : '');
    setEditModal(true);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setEditImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = () => {
    const updatedClubs = clubs.map(club =>
      club === selectedClub
        ? { ...club, name: editName, city: editCity, image: editImage, description: editDescription, link: editLink, color1: editColor1, color2: editColor2, titles: editTitles.split(',').map(y => y.trim()).filter(y => y) }
        : club
    );
    setClubs(updatedClubs);
    localStorage.setItem('clubs', JSON.stringify(updatedClubs));
    setSelectedClub({ ...selectedClub, name: editName, city: editCity, image: editImage, description: editDescription, link: editLink, color1: editColor1, color2: editColor2, titles: editTitles.split(',').map(y => y.trim()).filter(y => y) });
    setEditModal(false);
  };

  // Récupère tous les matchs du club sélectionné dans toutes les catégories
  const clubMatchs = useMemo(() => {
    if (!selectedClub) return [];
    const allResults = [];
    const nationals = JSON.parse(localStorage.getItem('resultatsData_nationals') || '[]');
    const west = JSON.parse(localStorage.getItem('resultatsData_regionalWest') || '[]');
    const east = JSON.parse(localStorage.getItem('resultatsData_regionalEast') || '[]');
    [
      { label: 'Nationals', data: nationals },
      { label: 'Regional West', data: west },
      { label: 'Regional East', data: east },
    ].forEach(({ label, data }) => {
      data.forEach(({ title, data: matches }) => {
        matches.forEach((match) => {
          if (
            match.team_1 === selectedClub.name ||
            match.team_2 === selectedClub.name
          ) {
            allResults.push({
              ...match,
              division: label,
              group: title || '',
            });
          }
        });
      });
    });
    return allResults;
  }, [selectedClub]);

  if (selectedClub) {
    return (
      <div style={{
        width: '100%',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
        background: 'rgba(255,255,255,0.98)',
        borderRadius: 16,
        boxShadow: '0 2px 16px #c0020a',
        margin: '40px auto',
        maxWidth: 800,
        padding: 60,
        position: 'relative'
      }}>
        <button
          style={{
            background: '#eee',
            color: '#c00',
            border: 'none',
            borderRadius: 8,
            padding: '8px 22px',
            fontWeight: 700,
            fontSize: 18,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #c0020a11',
            marginBottom: 32,
            alignSelf: 'flex-start'
          }}
          onClick={() => setSelectedClub(null)}
        >← Back</button>
        {isAdmin && (
          <button
            style={{
              position: 'absolute',
              top: 24,
              right: 36,
              background: '#c00',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 22px',
              fontWeight: 700,
              fontSize: 18,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #c0020a22',
              zIndex: 10
            }}
            onClick={openEditModal}
          >Modify</button>
        )}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 6 }}>{selectedClub.name}</div>
            <div style={{ color: '#555', fontSize: 22 }}>{selectedClub.city}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {selectedClub.image && (
              <img src={selectedClub.image} alt="club" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 16, border: '3px solid #c00', marginLeft: 24 }} />
            )}
            {/* Club titles below logo */}
            {selectedClub.titles && selectedClub.titles.length > 0 && (
              <div style={{ color: '#c00', fontSize: 18, fontWeight: 700, marginTop: 12, textAlign: 'center' }}>
                {t('Swiss Champion')}: {selectedClub.titles.join(', ')}
              </div>
            )}
          </div>
        </div>
        {selectedClub.description && (
          <div style={{ color: '#222', fontSize: 18, margin: '18px 0 8px 0', textAlign: 'center', maxWidth: 600 }}>{selectedClub.description}</div>
        )}

        {selectedClub.link && (
          <a href={selectedClub.link} target="_blank" rel="noopener noreferrer" style={{ color: '#c00', fontSize: 18, textDecoration: 'underline', marginBottom: 8, display: 'block' }}>
            {selectedClub.link}
          </a>
        )}

        {/* Résultats du club */}
        <div style={{ marginTop: 32, width: '100%' }}>
          <h3 style={{ color: '#c00', fontSize: 24, marginBottom: 12 }}>Club's Results</h3>
          {clubMatchs.length === 0 ? (
            <div style={{ color: '#888', fontSize: 18 }}>No matches found for this club.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #c0020a22', marginBottom: 24 }}>
              <thead>
                <tr style={{ background: '#eee' }}>
                  <th style={{ padding: '8px' }}>Competition</th>
                  <th style={{ padding: '8px' }}>Group</th>
                  <th style={{ padding: '8px' }}>Time</th>
                  <th style={{ padding: '8px' }}>Team 1</th>
                  <th style={{ padding: '8px' }}>Score</th>
                  <th style={{ padding: '8px' }}>Team 2</th>
                  <th style={{ padding: '8px' }}>Location</th>
                </tr>
              </thead>
              <tbody>
                {clubMatchs.map((m, i) => {
                  const score1 = Number(m.score_1);
                  const score2 = Number(m.score_2);
                  const team1Win = !isNaN(score1) && !isNaN(score2) && score1 > score2;
                  const team2Win = !isNaN(score1) && !isNaN(score2) && score2 > score1;
                  return (
                    <tr key={i} style={{ background: i % 2 === 1 ? '#fff0f0' : 'white' }}>
                      <td style={{ padding: '8px', textAlign: 'center' }}>{m.division}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>{m.group}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>{m.time || ''}</td>
                      <td style={{ padding: '8px', textAlign: 'left', fontWeight: team1Win ? 'bold' : (team2Win ? 'normal' : 'normal') }}>{m.team_1}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        <span style={{ fontWeight: team1Win ? 'bold' : 'normal' }}>{m.score_1}</span>
                        -
                        <span style={{ fontWeight: team2Win ? 'bold' : 'normal' }}>{m.score_2}</span>
                      </td>
                      <td style={{ padding: '8px', textAlign: 'left', fontWeight: team2Win ? 'bold' : (team1Win ? 'normal' : 'normal') }}>{m.team_2}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>{m.lieu || ''}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modale d'édition */}
        {editModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.32)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 8px 24px #c0020a55',
              padding: '36px 32px 28px 32px',
              minWidth: 320,
              maxWidth: '94vw',
              minHeight: 220,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.2s',
            }}>
              <button onClick={() => setEditModal(false)} style={{
                position: 'absolute',
                top: 14,
                right: 18,
                background: 'none',
                border: 'none',
                fontSize: 28,
                color: '#c00',
                cursor: 'pointer',
                fontWeight: 700,
                zIndex: 2,
              }}>×</button>
              <h2 style={{ fontFamily: 'Oswald, Arial Black, Arial, sans-serif', color: '#c00', marginBottom: 18, fontSize: 26 }}>Modify club</h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                style={{ marginBottom: 18 }}
              />
              <input
                type="text"
                placeholder="Club Name"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                style={{
                  marginBottom: 14,
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #ccc',
                  fontSize: 18,
                  width: 220
                }}
              />
              <input
                type="text"
                placeholder="Swisscup victory (ex: 2021, 2023)"
                value={editTitles}
                onChange={e => setEditTitles(e.target.value)}
                style={{
                  marginBottom: 14,
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #ccc',
                  fontSize: 16,
                  width: 220
                }}
              />
              <input
                type="text"
                placeholder="City"
                value={editCity}
                onChange={e => setEditCity(e.target.value)}
                style={{
                  marginBottom: 22,
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #ccc',
                  fontSize: 18,
                  width: 220
                }}
              />
              <textarea
                placeholder="Description"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                style={{
                  marginBottom: 14,
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #ccc',
                  fontSize: 16,
                  width: 220,
                  minHeight: 54,
                  resize: 'vertical'
                }}
              />
              <input
                type="url"
                placeholder="Club website link (https://...)"
                value={editLink}
                onChange={e => setEditLink(e.target.value)}
                style={{
                  marginBottom: 18,
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid #ccc',
                  fontSize: 16,
                  width: 220
                }}
              />
              <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label htmlFor="editColor1" style={{ fontSize: 14, marginBottom: 4 }}>Main Color</label>
                  <input
                    id="editColor1"
                    type="color"
                    value={editColor1}
                    onChange={e => setEditColor1(e.target.value)}
                    style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <label htmlFor="editColor2" style={{ fontSize: 14, marginBottom: 4 }}>Secondary Color</label>
                  <input
                    id="editColor2"
                    type="color"
                    value={editColor2}
                    onChange={e => setEditColor2(e.target.value)}
                    style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer' }}
                  />
                </div>
              </div>
              <button
                style={{
                  background: '#c00',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 28px',
                  fontWeight: 700,
                  fontSize: 20,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px #c0020a22',
                  marginTop: 8
                }}
                onClick={handleEditSave}
                disabled={!editName.trim() || !editCity.trim()}
              >Add</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
      background: 'rgba(255,255,255,0.98)',
      borderRadius: 16,
      boxShadow: '0 2px 16px #c0020a',
      margin: '40px auto',
      maxWidth: 800,
      padding: 60,
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 24,
        left: 36,
        background: '#c00',
        color: '#fff',
        fontWeight: 700,
        fontSize: 22,
        borderRadius: 8,
        padding: '7px 22px 6px 22px',
        letterSpacing: 1,
        boxShadow: '0 2px 8px #c0020a22',
        zIndex: 10,
        fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
      }}>
         {t('Clubs')}
      </div>
      {isAdmin && (
        <button
          style={{
            background: '#c00',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 28px',
            fontWeight: 700,
            fontSize: 20,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #c0020a22',
            marginBottom: 32,
            alignSelf: 'flex-end'
          }}
          onClick={() => setShowModal(true)}
  >{t('Add Club')}</button>
      )}

      {/* List of added clubs */}
      {clubs.length > 0 && (
        <div style={{
          width: '100%',
          marginBottom: 32,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          justifyItems: 'center',
        }}>
          {[...clubs]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((club, idx) => (
              <div
                key={idx}
                style={{
                  width: 220,
                  height: 140,
                  background: '#f7f7f7',
                  borderRadius: 14,
                  boxShadow: '0 1px 6px #c0020a11',
                  padding: '16px 18px 12px 18px',
                  marginBottom: 0,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  position: 'relative',
                }}
                onClick={() => setSelectedClub(club)}
                title="Voir le club"
              >
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {club.image && (
                    <img src={club.image} alt="club" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, marginRight: 12 }} />
                  )}
                  <div style={{ fontWeight: 700, fontSize: 20, flex: 1 }}>{club.name}</div>
                </div>
                <div style={{ color: '#555', fontSize: 16, marginTop: 18, marginLeft: club.image ? 60 : 0 }}>{club.city}</div>
              </div>
            ))}
        </div>
      )}

  {/* Floating modal */}
  {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.32)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 18,
            boxShadow: '0 8px 24px #c0020a55',
            padding: '36px 32px 28px 32px',
            minWidth: 320,
            maxWidth: '94vw',
            minHeight: 220,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'all 0.2s',
          }}>
            <button onClick={() => setShowModal(false)} style={{
              position: 'absolute',
              top: 14,
              right: 18,
              background: 'none',
              border: 'none',
              fontSize: 28,
              color: '#c00',
              cursor: 'pointer',
              fontWeight: 700,
              zIndex: 2,
            }}>×</button>
            <h2 style={{ fontFamily: 'Oswald, Arial Black, Arial, sans-serif', color: '#c00', marginBottom: 18, fontSize: 26 }}>{t('club.addClubTitle')}</h2>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ marginBottom: 18 }}
            />
            <input
              type="text"
              placeholder={t('Club name')}
              value={clubName}
              onChange={e => setClubName(e.target.value)}
              style={{
                marginBottom: 14,
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
                fontSize: 18,
                width: 220
              }}
            />
            <input
              type="text"
              placeholder="Années de victoire Swisscup (ex: 2021, 2023)"
              value={clubTitles}
              onChange={e => setClubTitles(e.target.value)}
              style={{
                marginBottom: 14,
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
                fontSize: 16,
                width: 220
              }}
            />
            <input
              type="text"
              placeholder={t('City/Place')}
              value={clubCity}
              onChange={e => setClubCity(e.target.value)}
              style={{
                marginBottom: 14,
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
                fontSize: 18,
                width: 220
              }}
            />
            <textarea
              placeholder={t(' Description')}
              value={clubDescription}
              onChange={e => setClubDescription(e.target.value)}
              style={{
                marginBottom: 14,
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
                fontSize: 16,
                width: 220,
                minHeight: 54,
                resize: 'vertical'
              }}
            />
            <input
              type="url"
              placeholder={t('Club link')}
              value={clubLink}
              onChange={e => setClubLink(e.target.value)}
              style={{
                marginBottom: 18,
                padding: '8px 12px',
                borderRadius: 6,
                border: '1px solid #ccc',
                fontSize: 16,
                width: 220
              }}
            />
            <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label htmlFor="color1" style={{ fontSize: 14, marginBottom: 4 }}>{t('Main Color')}</label>
                <input
                  id="color1"
                  type="color"
                  value={clubColor1}
                  onChange={e => setClubColor1(e.target.value)}
                  style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label htmlFor="color2" style={{ fontSize: 14, marginBottom: 4 }}>{t('Secondary Color')}</label>
                <input
                  id="color2"
                  type="color"
                  value={clubColor2}
                  onChange={e => setClubColor2(e.target.value)}
                  style={{ width: 36, height: 36, border: 'none', background: 'none', cursor: 'pointer' }}
                />
              </div>
            </div>
            <button
              style={{
                background: '#c00',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px 28px',
                fontWeight: 700,
                fontSize: 20,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #c0020a22',
                marginTop: 8
              }}
              onClick={handleAddClub}
              disabled={!clubName.trim() || !clubCity.trim()}
            >{t('Add')}</button>
          </div>
        </div>
      )}

      {/* Message if no club */}
      {clubs.length === 0 && (
        <div style={{
          width: '100%',
          minHeight: '40vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          color: '#c00',
          fontWeight: 700,
          letterSpacing: 1
        }}>
          {t('club.underConstruction')}
        </div>
      )}
    </div>
  );
}

