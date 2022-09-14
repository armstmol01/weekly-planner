import React from 'react'
import {useRef, useEffect} from 'react'
import './Notes.css'
import axios from 'axios'

const Notes = (props) => {
  // const notesContent = <textarea id='notesbox' className='notes-input' spellCheck='false' onChange={(event) => {notes.current = event.currentTarget.textContent}}></textarea>;
  const notes = useRef("");

  useEffect(() => {
    window.onbeforeunload = saveNotes;
    let urlNotes = "/api/notes?id=" + userData.id;
    fetch(urlNotes)
     .then((res) => (res.json()))
     .then(setNotes)
     .catch(handleError);
  }, []); // [] = callback function on first render

  const saveNotes = async () => {
    await axios.post('/api/save-notes', {
      userId: userData.id,
      notes: notes.current
    })
    .catch(handleError);
  }

  const setNotes = (res) => {
    notes.current = res.notes;

  }

  return (
    <textarea id='notesbox' className='notes-input' spellCheck='false' onChange={(event) => {notes.current = event.currentTarget.textContent}}>{props.data.notes}</textarea>
  )
}

export default Notes