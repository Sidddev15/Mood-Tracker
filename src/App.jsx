import React, { useState, useEffect, useRef, useReducer, useContext } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ThemeContext, ThemeProvider } from './context/ThemeContext';
import './App.css';

const moodReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MOOD':
      return [...state, action.payload];
    case 'CLEAR_MOOD':
      return [];
    default:
      return state;
  }
};

const MoodTracker = () => {
  const [mood, setMood] = useState('');
  const [moods, dispatch] = useReducer(moodReducer, []);
  const [storedMoods, setStoredMoods] = useLocalStorage('moodHistory', []);
  const inputRef = useRef();
  const { dark, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    setStoredMoods(moods);
  }, [moods, setStoredMoods]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mood.trim()) {
      dispatch({ type: 'ADD_MOOD', payload: mood });
      setMood('');
    }
  };

  return (
    <div>
      <h1>Mood Tracker</h1>
      <button onClick={toggleTheme}>
        Toggle to {dark ? 'Light' : 'Dark'} Mode
      </button>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Enter your mood"
        />
        <button disabled={!mood.trim()}>Add Mood</button>
      </form>

      <h2>Past Moods</h2>
      {storedMoods.length === 0 ? (
        <p>No moods recorded yet.</p>
      ) : (
        <ul>
          {storedMoods.map((m, index) => (
            <li key={index}>{m}</li>
          ))}
        </ul>
      )}

      <button onClick={() => dispatch({ type: 'CLEAR_MOOD' })}>
        Clear All
      </button>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <MoodTracker />
    </ThemeProvider>
  );
}

export default App;
