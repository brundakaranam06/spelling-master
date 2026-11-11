
import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const LEVELS = [
  { id: 1, title: 'Level 1: Blends & Silent E', color: 'blue', words: ['stop','plan','frog','crab','skip','bell','hill','puff','mess','buzz','cake','bake','game','name','wave','bone','hole','note','hope','rope'] },
  { id: 2, title: 'Level 2: Vowel Teams & R-Control', color: 'green', words: ['rain','paid','wait','play','stay','boat','road','soap','snow','grow','car','star','farm','dark','for','her','fern','bird','girl','shirt'] },
  { id: 3, title: 'Level 3: Diphthongs & Complex', color: 'purple', words: ['loud','cloud','house','mouse','cow','boil','coin','join','boy','toy','face','nice','city','space','page','catch','match','witch','fetch','patch'] },
  { id: 4, title: 'Level 4: Multisyllabic & Morphology', color: 'orange', words: ['apple','table','little','middle','bottle','untie','unfair','redo','rewrite','preview','helpful','playful','homeless','fearless','quickly','write','wrong','knee','knock','gnat'] },
  { id: 5, title: 'Level 5: Advanced Word Study', color: 'red', words: ['above','agree','banana','animal','family','action','station','motion','decision','vision','photo','graph','phonics','phone','audio','hopping','skipped','making','baking','pennies'] },
  { id: 6, title: 'Level 6: Academic Mixed Bag', color: 'teal', words: ['ecosystem','sedimentary','renewable','photosynthesis','erosion','geography','democracy','citizen','equator','longitude','narrative','metaphor','character','setting','plot','hypothesis','variable','friction','gravity','energy'] }
];

const STORAGE_KEY = 'spelling-master-progress-v1';
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { unlocked: Array.isArray(saved.unlocked) ? saved.unlocked : [1], best: saved.best || {} };
  } catch { return { unlocked: [1], best: {} }; }
}

function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [levelId, setLevelId] = useState(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const level = useMemo(() => LEVELS.find(item => item.id === levelId), [levelId]);
  const word = level?.words[wordIndex];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const speak = (text) => {
    if (!('speechSynthesis' in window)) {
      setFeedback('Audio pronunciation is not available in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (word) speak(word);
    return () => window.speechSynthesis?.cancel();
  }, [levelId, wordIndex]);

  const startLevel = (id) => {
    setLevelId(id); setWordIndex(0); setAnswer(''); setFeedback(''); setCorrect(0); setFinished(false); setShowHint(false);
  };

  const submit = (event) => {
    event.preventDefault();
    if (!word || finished) return;
    if (answer.trim().toLocaleLowerCase() !== word.toLocaleLowerCase()) {
      setFeedback('Not quite — listen again and try once more.');
      return;
    }
    const nextCorrect = correct + 1;
    setCorrect(nextCorrect);
    setFeedback('Correct! Great work! ⭐');
    if (wordIndex + 1 < level.words.length) {
      window.setTimeout(() => { setWordIndex(i => i + 1); setAnswer(''); setFeedback(''); setShowHint(false); }, 850);
    } else {
      const passed = nextCorrect >= Math.ceil(level.words.length * 0.8);
      setFinished(true);
      setProgress(previous => {
        const best = { ...previous.best, [level.id]: Math.max(previous.best[level.id] || 0, nextCorrect) };
        const unlocked = passed && level.id < LEVELS.length && !previous.unlocked.includes(level.id + 1)
          ? [...previous.unlocked, level.id + 1] : previous.unlocked;
        return { ...previous, best, unlocked };
      });
      setFeedback(passed ? 'Level complete! You unlocked your next challenge! 🏆' : `Good effort! You got ${nextCorrect}/${level.words.length}. You need 80% to unlock the next level.`);
    }
  };

  const resetProgress = () => {
    if (!window.confirm('Reset all level progress? This cannot be undone.')) return;
    const fresh = { unlocked: [1], best: {} };
    setProgress(fresh); localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  };

  if (!levelId) return <main className="page home">
    <header className="hero"><div className="trophy">🏆</div><p className="eyebrow">LISTEN · THINK · SPELL</p><h1>Spelling Master</h1><p className="subtitle">A little practice makes a big difference.</p></header>
    <section className="level-grid" aria-label="Spelling levels">
      {LEVELS.map(item => {
        const unlocked = progress.unlocked.includes(item.id);
        return <button key={item.id} disabled={!unlocked} onClick={() => startLevel(item.id)} className={`level-card ${item.color} ${!unlocked ? 'locked' : ''}`}>
          <span className="level-number">LEVEL {item.id}</span><strong>{item.title.replace(`Level ${item.id}: `, '')}</strong>
          <span className="level-meta">{unlocked ? `${item.words.length} words · Best: ${progress.best[item.id] ?? '—'}/${item.words.length}` : '🔒 Complete the previous level'}</span>
        </button>;
      })}
    </section>
    <footer className="home-footer"><span>Progress is saved on this device.</span><button className="text-button" onClick={resetProgress}>Reset progress</button></footer>
  </main>;

  return <main className={`page practice ${level.color}`}>
    <section className="practice-card">
      <div className="topline"><button className="back-button" onClick={() => { setLevelId(null); setFeedback(''); }}>← All levels</button><span>WORD {wordIndex + 1} OF {level.words.length}</span></div>
      <div className="progress-track"><div className="progress-fill" style={{ width: `${((wordIndex + (finished ? 1 : 0)) / level.words.length) * 100}%` }} /></div>
      <p className="eyebrow">SPELLING CHALLENGE</p><h2>{level.title}</h2>
      <p className="instruction">Listen carefully, then type the word you hear.</p>
      <button className="listen-button" onClick={() => speak(word || '')} aria-label="Hear the word again"><span>🔊</span><small>Hear the word</small></button>
      <form onSubmit={submit}>
        <label className="sr-only" htmlFor="spelling-answer">Type the word you heard</label>
        <input id="spelling-answer" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type the word here…" autoComplete="off" autoCapitalize="none" disabled={finished} autoFocus />
        <button className="submit-button" type="submit" disabled={!answer.trim() || finished}>{finished ? 'Level finished' : 'Check spelling'}</button>
      </form>
      <button className="hint-button" onClick={() => setShowHint(value => !value)}>{showHint ? 'Hide hint' : 'Need a hint?'}</button>
      {showHint && word && <p className="hint">The word has {word.length} letters. It starts with “{word[0].toUpperCase()}”.</p>}
      {feedback && <p className={`feedback ${feedback.startsWith('Correct') || feedback.startsWith('Level complete') ? 'success' : 'retry'}`} role="status">{feedback}</p>}
      <div className="score-line"><span>Correct so far: <strong>{correct}</strong></span><span>Pass mark: <strong>80%</strong></span></div>
      {finished && <div className="finish-actions"><button className="submit-button" onClick={() => startLevel(level.id)}>Practise this level again</button><button className="secondary-button" onClick={() => setLevelId(null)}>Back to levels</button></div>}
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
