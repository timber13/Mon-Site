
export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const selectionRef = useRef(null);

  // Save selection on input
  const handleInput = (e) => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      selectionRef.current = sel.getRangeAt(0).cloneRange();
    }
    onChange(editorRef.current.innerHTML);
  };

  // Save selection on command
  const format = (command, value = null) => {
    document.execCommand(command, false, value);
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      selectionRef.current = sel.getRangeAt(0).cloneRange();
    }
    onChange(editorRef.current.innerHTML);
    editorRef.current.focus();
  };

  // Restore selection after value changes
  useEffect(() => {
    if (editorRef.current && document.activeElement === editorRef.current) {
      const sel = window.getSelection();
      if (selectionRef.current && sel) {
        sel.removeAllRanges();
        sel.addRange(selectionRef.current);
      }
    }
  }, [value]);

  // Prevent re-render if value is unchanged
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <button type="button" title="Gras" onClick={() => format('bold')} style={{ fontWeight: 700, fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #c00', background: '#fff', color: '#c00', cursor: 'pointer' }}>B</button>
        <button type="button" title="Italique" onClick={() => format('italic')} style={{ fontStyle: 'italic', fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #c00', background: '#fff', color: '#c00', cursor: 'pointer' }}>I</button>
        <button type="button" title="Souligné" onClick={() => format('underline')} style={{ textDecoration: 'underline', fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #c00', background: '#fff', color: '#c00', cursor: 'pointer' }}>U</button>
        <button type="button" title="Liste à puces" onClick={() => format('insertUnorderedList')} style={{ fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #c00', background: '#fff', color: '#c00', cursor: 'pointer' }}>• List</button>
        <button type="button" title="Liste numérotée" onClick={() => format('insertOrderedList')} style={{ fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #c00', background: '#fff', color: '#c00', cursor: 'pointer' }}>1. List</button>
        <button type="button" title="Titre" onClick={() => format('formatBlock', 'H2')} style={{ fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #c00', background: '#fff', color: '#c00', cursor: 'pointer' }}>H2</button>
        <button type="button" title="Paragraphe" onClick={() => format('formatBlock', 'P')} style={{ fontSize: 18, padding: '4px 12px', borderRadius: 6, border: '1px solid #c00', background: '#fff', color: '#c00', cursor: 'pointer' }}>P</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          minHeight: 180,
          border: '1.5px solid #c00',
          borderRadius: 8,
          padding: 12,
          fontSize: 18,
          fontFamily: 'Oswald, Arial Black, Arial, sans-serif',
          background: '#fff',
          outline: 'none',
        }}
        onInput={handleInput}
        onBlur={() => { selectionRef.current = null; }}
      />
    </div>
  );
}
import React, { useRef, useEffect } from 'react';
