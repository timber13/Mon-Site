import React, { useState } from 'react';

const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export default function Calendar({ isAdmin = true }) {
  const today = new Date();
  // Exemple d'événements (clé: yyyy-mm-dd, valeur: tableau d'événements)
  // Chargement des événements depuis localStorage ou valeur initiale
  const getInitialEvents = () => {
    try {
      const stored = localStorage.getItem('calendarEvents');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // Si données corrompues, on ignore
    }
    return {};
  };
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null); // { day, month, year }
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    date: '',
    title: '',
    color: '#c00',
    tag: '',
  });
  const [eventList, setEventList] = useState(getInitialEvents); // events est l'objet initial (modifiable)
  const [editEventIdx, setEditEventIdx] = useState(null); // index de l'event en édition
  const [editEventForm, setEditEventForm] = useState({ title: '', color: '#c00', tag: '' });

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  // JS: 0=dimanche, 1=lundi... On veut 0=lundi
  const startDay = (firstDay === 0 ? 6 : firstDay - 1);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
    setSelectedDay(null);
  };

  // Persistance des événements dans localStorage à chaque modification
  React.useEffect(() => {
    try {
      localStorage.setItem('calendarEvents', JSON.stringify(eventList));
    } catch (e) {
      // ignore quota ou erreur
    }
  }, [eventList]);

  // Ajout d'un événement
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!eventForm.date || !eventForm.title) return;
    setEventList(prev => {
      const prevEvents = { ...prev };
      if (!prevEvents[eventForm.date]) prevEvents[eventForm.date] = [];
      prevEvents[eventForm.date].push({
        title: eventForm.title,
        color: eventForm.color,
        tag: eventForm.tag
      });
      return prevEvents;
    });
    setShowAddEvent(false);
    setEventForm({ date: '', title: '', color: '#c00', tag: '' });
  };

  // Suppression d'un événement
  const handleDeleteEvent = (dateKey, idx) => {
    setEventList(prev => {
      const prevEvents = { ...prev };
      if (!prevEvents[dateKey]) return prevEvents;
      prevEvents[dateKey] = prevEvents[dateKey].filter((_, i) => i !== idx);
      if (prevEvents[dateKey].length === 0) delete prevEvents[dateKey];
      return prevEvents;
    });
    setEditEventIdx(null);
  };

  // Début édition
  const handleStartEdit = (ev, idx) => {
    setEditEventIdx(idx);
    setEditEventForm({ title: ev.title, color: ev.color, tag: ev.tag });
  };
  // Sauvegarde édition
  const handleSaveEdit = (dateKey, idx) => {
    setEventList(prev => {
      const prevEvents = { ...prev };
      if (!prevEvents[dateKey]) return prevEvents;
      prevEvents[dateKey][idx] = { ...prevEvents[dateKey][idx], ...editEventForm };
      return prevEvents;
    });
    setEditEventIdx(null);
  };
  // Annule édition
  const handleCancelEdit = () => {
    setEditEventIdx(null);
  };

  // Génère les cases du calendrier
  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(
      <td key={'empty-' + i} style={{ width: 150, height: 60, border: '1.5px solid #eee', background: '#fafafa', borderRadius: 16 }}></td>
    );
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hasEvent = eventList[dateKey] && eventList[dateKey].length > 0;
    days.push(
      <td
        key={d}
        style={{
          width: 150,
          height: 60,
          minWidth: 150,
          minHeight: 60,
          maxWidth: 150,
          maxHeight: 60,
          padding: 0,
          border: '1.5px solid #eee',
          borderRadius: 16,
          background: d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? '#ffe6e6' : '#fff',
          color: '#222',
          boxShadow: d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? '0 0 0 2px #c00' : undefined,
          position: 'relative',
          verticalAlign: 'top',
          cursor: 'pointer',
        }}
        onClick={() => setSelectedDay({ day: d, month: currentMonth, year: currentYear, dateKey })}
      >
        <span style={{
          position: 'absolute',
          top: 6,
          right: 10,
          fontSize: 15,
          color: d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear() ? '#c00' : '#888',
          fontWeight: 700,
          zIndex: 2,
        }}>{d}</span>
        {hasEvent && <span style={{ position: 'absolute', left: 8, top: 8, width: 12, height: 12, borderRadius: 6, background: eventList[dateKey][0].color, display: 'inline-block', border: '1.5px solid #fff' }}></span>}
      </td>
    );
  }
  while (days.length % 7 !== 0) {
    days.push(
      <td key={'empty-end-' + days.length} style={{ width: 150, height: 60, border: '1.5px solid #eee', background: '#fafafa', borderRadius: 16 }}></td>
    );
  }

  const rows = [];
  for (let i = 0; i < days.length; i += 7) {
    rows.push(<tr key={i}>{days.slice(i, i + 7)}</tr>);
  }

  // Overlay d'événements du jour
  const showOverlay = selectedDay !== null;
  let eventsForDay = [];
  if (showOverlay && selectedDay) {
    eventsForDay = eventList[selectedDay.dateKey] || [];
  }

  return (
    <>
      <div style={{
        width: '66vw',
        minWidth: 480,
        maxWidth: '100vw',
        height: 'auto',
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 4px 24px #c0020a22',
        padding: 32,
        marginLeft: 0,
        marginRight: 'auto',
        display: 'block',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <button onClick={prevMonth} style={{ fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#c00', fontWeight: 700, padding: 0, width: 40, height: 40, borderRadius: 20, transition: 'background 0.2s' }}>‹</button>
          <h2 style={{ margin: 0, color: '#c00', fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>{monthNames[currentMonth]} {currentYear}</h2>
          {isAdmin && (
            <button onClick={() => setShowAddEvent(true)} style={{ marginLeft: 16, background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>+ event</button>
          )}
          <button onClick={nextMonth} style={{ fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#c00', fontWeight: 700, padding: 0, width: 40, height: 40, borderRadius: 20, transition: 'background 0.2s' }}>›</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 6, fontSize: 18, tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ color: '#c00', fontWeight: 700, fontSize: 18 }}>
              <th>Lun</th><th>Mar</th><th>Mer</th><th>Jeu</th><th>Ven</th><th>Sam</th><th>Dim</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
      {showAddEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          zIndex: 4000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
          onClick={() => setShowAddEvent(false)}
        >
          <form
            style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 8px 32px #c0020a55',
              padding: 36,
              minWidth: 320,
              maxWidth: 420,
              width: '90vw',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={e => e.stopPropagation()}
            onSubmit={handleAddEvent}
          >
            <button
              type="button"
              onClick={() => setShowAddEvent(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: '#c00',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                fontWeight: 900,
                fontSize: 20,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #c0020a22',
                zIndex: 10,
                lineHeight: 1,
              }}
              title="Fermer"
            >×</button>
            <h3 style={{ color: '#c00', fontWeight: 700, marginBottom: 18 }}>Ajouter un événement</h3>
            <label style={{ width: '100%', marginBottom: 10 }}>
              Date :
              <input type="date" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} required />
            </label>
            <label style={{ width: '100%', marginBottom: 10 }}>
              Titre :
              <input type="text" value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} required />
            </label>
            <label style={{ width: '100%', marginBottom: 10 }}>
              Couleur :
              <input type="color" value={eventForm.color} onChange={e => setEventForm(f => ({ ...f, color: e.target.value }))} style={{ width: 40, height: 32, marginLeft: 8, verticalAlign: 'middle', border: 'none', background: 'none' }} />
            </label>
            <label style={{ width: '100%', marginBottom: 18 }}>
              Tag :
              <input type="text" value={eventForm.tag} onChange={e => setEventForm(f => ({ ...f, tag: e.target.value }))} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
            </label>
            <button type="submit" style={{ background: '#c00', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 24px', fontWeight: 700, fontSize: 18, cursor: 'pointer', marginTop: 8 }}>Ajouter</button>
          </form>
        </div>
      )}
      {showOverlay && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
          onClick={() => setSelectedDay(null)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 8px 32px #c0020a55',
              padding: 36,
              minWidth: 320,
              maxWidth: 420,
              width: '90vw',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDay(null)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: '#c00',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                fontWeight: 900,
                fontSize: 20,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #c0020a22',
                zIndex: 10,
                lineHeight: 1,
              }}
              title="Fermer"
            >×</button>
            <div style={{ fontWeight: 700, color: '#c00', fontSize: 22, marginBottom: 10, textAlign: 'center' }}>
              {selectedDay && `${selectedDay.day} ${monthNames[selectedDay.month]} ${selectedDay.year}`}
            </div>
            {eventsForDay.length === 0 ? (
              <div style={{ color: '#888', fontSize: 18, textAlign: 'center', marginTop: 12 }}>
                Aucun événement aujourd'hui
              </div>
            ) : (
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', width: '100%' }}>
                {eventsForDay.map((ev, idx) => (
                  <li key={idx} style={{ color: ev.color || '#222', fontSize: 18, marginBottom: 8, borderLeft: `4px solid ${ev.color || '#c00'}`, paddingLeft: 10, position: 'relative', background: editEventIdx === idx ? '#f8f8f8' : undefined }}>
                    {isAdmin && editEventIdx === idx ? (
                      <form onSubmit={e => { e.preventDefault(); handleSaveEdit(selectedDay.dateKey, idx); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="text" value={editEventForm.title} onChange={e => setEditEventForm(f => ({ ...f, title: e.target.value }))} style={{ fontSize: 16, padding: 4, borderRadius: 4, border: '1px solid #ccc', width: 120 }} required />
                        <input type="color" value={editEventForm.color} onChange={e => setEditEventForm(f => ({ ...f, color: e.target.value }))} style={{ width: 32, height: 24, border: 'none', background: 'none' }} />
                        <input type="text" value={editEventForm.tag} onChange={e => setEditEventForm(f => ({ ...f, tag: e.target.value }))} style={{ fontSize: 14, padding: 4, borderRadius: 4, border: '1px solid #ccc', width: 60 }} placeholder="Tag" />
                        <button type="submit" style={{ background: '#c00', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>OK</button>
                        <button type="button" onClick={handleCancelEdit} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Annuler</button>
                      </form>
                    ) : (
                      <>
                        <span>{ev.title}</span>
                        {ev.tag && <span style={{ background: '#eee', color: '#c00', borderRadius: 6, padding: '2px 8px', fontSize: 13, marginLeft: 8 }}>{ev.tag}</span>}
                        {isAdmin && (
                          <>
                            <button onClick={() => handleStartEdit(ev, idx)} style={{ marginLeft: 10, background: '#ffb300', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 8px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Éditer</button>
                            <button onClick={() => handleDeleteEvent(selectedDay.dateKey, idx)} style={{ marginLeft: 6, background: '#c00', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 8px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Supprimer</button>
                          </>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
