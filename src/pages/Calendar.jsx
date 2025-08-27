import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import NextEventsColumn from '../components/NextEventsColumn';
import { AddEventModal, EditEventForm } from '../components/EventModals';

const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export default function Calendar({ isAdmin = true }) {
  const [filterTag, setFilterTag] = useState('');
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null); // { day, month, year }
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    date: '',
    title: '',
    color: '#c00',
    tags: '', // string input, comma-separated
  });
    const [eventList, setEventList] = useState({}); // Utilisation de Supabase pour la persistance des événements
  const [editEventIdx, setEditEventIdx] = useState(null); // index de l'event en édition
  const [editEventForm, setEditEventForm] = useState({ title: '', color: '#c00', tags: '' });

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
  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase.from('calendar_events').select('*');
    // Transform Supabase flat array to {dateKey: [events]}
    const eventsByDate = {};
    (data || []).forEach(ev => {
      if (!eventsByDate[ev.date]) eventsByDate[ev.date] = [];
      eventsByDate[ev.date].push(ev);
    });
    setEventList(eventsByDate);
  }

  // Ajout d'un événement
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.date || !eventForm.title) return;
    const tagsArr = eventForm.tags
      ? eventForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    await supabase.from('calendar_events').insert([{ date: eventForm.date, title: eventForm.title, color: eventForm.color, tags: tagsArr }]);
    setShowAddEvent(false);
    setEventForm({ date: '', title: '', color: '#c00', tags: '' });
    fetchEvents();
  };

  // Suppression d'un événement
  const handleDeleteEvent = async (dateKey, idx) => {
    const event = eventList[dateKey][idx];
    await supabase.from('calendar_events').delete().eq('id', event.id);
    setEditEventIdx(null);
    fetchEvents();
  };

  // Début édition
  const handleStartEdit = (ev, idx) => {
    setEditEventIdx(idx);
    setEditEventForm({
      title: ev.title,
      color: ev.color,
      tags: Array.isArray(ev.tags)
        ? ev.tags.join(', ')
        : (typeof ev.tag === 'string' ? ev.tag : '')
    });
  };
  // Sauvegarde édition
  const handleSaveEdit = async (dateKey, idx) => {
    const event = eventList[dateKey][idx];
    const tagsArr = editEventForm.tags
      ? editEventForm.tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];
    await supabase.from('calendar_events').update({ title: editEventForm.title, color: editEventForm.color, tags: tagsArr }).eq('id', event.id);
    setEditEventIdx(null);
    fetchEvents();
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

  const tableStyle = {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '6px',
    fontSize: 18,
    tableLayout: 'fixed',
  };
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f5f6fa' }}>
      <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'stretch' }}>
        {/* Colonne calendrier */}
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
        {/* Bouton + Event pour admin */}
        {isAdmin && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <button
              onClick={() => setShowAddEvent(true)}
              style={{
                background: '#c00',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '6px 18px',
                fontWeight: 700,
                fontSize: 17,
                cursor: 'pointer',
                boxShadow: '0 2px 8px #c0020a22',
                marginBottom: 4
              }}
            >+ Event</button>
          </div>
        )}
        {/* En-tête calendrier avec navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
          gap: 24
        }}>
          <button
            onClick={prevMonth}
            style={{
              background: 'none',
              border: 'none',
              color: '#c00',
              borderRadius: 8,
              fontSize: 38,
              fontWeight: 900,
              width: 48,
              height: 48,
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
            }}
            title="Mois précédent"
          >
            <span style={{fontSize: 38, fontWeight: 900, lineHeight: 1}}>&#x2B05;</span>
          </button>
          <span style={{ fontWeight: 700, fontSize: 26, color: '#c00', letterSpacing: 1, minWidth: 180, textAlign: 'center' }}>
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={nextMonth}
            style={{
              background: 'none',
              border: 'none',
              color: '#c00',
              borderRadius: 8,
              fontSize: 38,
              fontWeight: 900,
              width: 48,
              height: 48,
              cursor: 'pointer',
              boxShadow: 'none',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
            }}
            title="Mois suivant"
          >
            <span style={{fontSize: 38, fontWeight: 900, lineHeight: 1}}>&#x27A1;</span>
          </button>
        </div>
          <table style={tableStyle}>
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
        {/* Colonne next events */}
        <NextEventsColumn eventList={eventList} filterTag={filterTag} setFilterTag={setFilterTag} />
      </div>
      <AddEventModal
        isOpen={isAdmin && showAddEvent}
        onClose={() => setShowAddEvent(false)}
        onSubmit={handleAddEvent}
        eventForm={eventForm}
        setEventForm={setEventForm}
      />
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
              <EditEventForm
                isAdmin={isAdmin}
                show={true}
                eventsForDay={eventsForDay}
                editEventIdx={editEventIdx}
                editEventForm={editEventForm}
                setEditEventForm={setEditEventForm}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
                handleStartEdit={handleStartEdit}
                handleDeleteEvent={handleDeleteEvent}
                selectedDay={selectedDay}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}