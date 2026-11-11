import React, { useState, useEffect } from 'react';

const LEVELS = [
  {
    id: 1,
    title: "Level 1: Blends & Silent E",
    color: "bg-blue-500",
    words: ["stop", "plan", "frog", "crab", "skip", "bell", "hill", "puff", "mess", "buzz", "cake", "bake", "game", "name", "wave", "bone", "hole", "note", "hope", "rope"]
  },
  {
    id: 2,
    title: "Level 2: Vowel Teams & R-Control",
    color: "bg-green-500",
    words: ["rain", "paid", "wait", "play", "stay", "boat", "road", "soap", "snow", "grow", "car", "star", "farm", "dark", "for", "her", "fern", "bird", "girl", "shirt"]
  },
  {
    id: 3,
    title: "Level 3: Diphthongs & Complex",
    color: "bg-purple-500",
    words: ["loud", "cloud", "house", "mouse", "cow", "boil", "coin", "join", "boy", "toy", "face", "nice", "city", "space", "page", "catch", "match", "witch", "fetch", "patch"]
  },
  {
    id: 4,
    title: "Level 4: Multisyllabic & Morphology",
    color: "bg-orange-500",
    words: ["apple", "table", "little", "middle", "bottle", "untie", "unfair", "redo", "rewrite", "preview", "helpful", "playful", "homeless", "fearless", "quickly", "write", "wrong", "knee", "knock", "gnat"]
  },
  {
    id: 5,
    title: "Level 5: Advanced Word Study",
    color: "bg-red-500",
    words: ["above", "agree", "banana", "animal", "family", "action", "station", "motion", "decision", "vision", "photo", "graph", "phonics", "phone", "audio", "hopping", "skipped", "making", "baking", "pennies"]
  },
  {
    id: 6,
    title: "Level 6: Academic Mixed Bag",
    color: "bg-teal-500",
    words: ["ecosystem", "sedimentary", "renewable", "photosynthesis", "erosion", "geography", "democracy", "citizen", "equator", "longitude", "narrative", "metaphor", "character", "setting", "plot", "hypothesis", "variable", "friction", "gravity", "energy"]
  }
];

export default function SpellingApp() {
  const [currentLevelId, setCurrentLevelId] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [voices, setVoices] = useState([]);

  const activeLevel = LEVELS.find(l => l.id === currentLevelId);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      // Look specifically for an Indian English voice
      const indianVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('India'));
      if (indianVoice) {
        utterance.voice = indianVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (activeLevel) {
      speakWord(activeLevel.words[currentWordIndex]);
      setShowAnswer(false); // Reset answer visibility on new word
    }
  }, [currentWordIndex, activeLevel]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeLevel) return;

    const currentWord = activeLevel.words[currentWordIndex];
    
    if (userInput.toLowerCase().trim() === currentWord.toLowerCase()) {
      setFeedback('Correct! 🎉');
      if (!showAnswer) {
        setScore(s => s + 1); // Only score a point if they didn't peek
      }
      
      setTimeout(() => {
        setFeedback('');
        setUserInput('');
        setShowAnswer(false);
        if (currentWordIndex + 1 < activeLevel.words.length) {
          setCurrentWordIndex(prev => prev + 1);
        } else {
          handleLevelComplete();
        }
      }, 1500);
    } else {
      setFeedback('Try again! 🤔');
    }
  };

  const handleLevelComplete = () => {
    alert(`Level Finished! You scored ${score}/${activeLevel.words.length}. Great job!`);
    setCurrentLevelId(null);
    setCurrentWordIndex(0);
    setScore(0);
    setShowAnswer(false);
  };

  if (!currentLevelId) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Spelling Master 🏆</h1>
          <p className="text-center text-gray-600 mb-8 text-lg">Select any level to begin practicing!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => {
                  setCurrentLevelId(level.id);
                  setCurrentWordIndex(0);
                  setScore(0);
                }}
                className={`h-40 rounded-xl shadow-lg flex flex-col items-center justify-center text-white text-xl font-bold transition-transform transform hover:scale-105 cursor-pointer ${level.color}`}
              >
                <span>{level.title}</span>
                <span className="mt-2 text-sm font-normal text-white/90">{level.words.length} words</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${activeLevel.color} p-8 flex items-center justify-center transition-colors duration-500`}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setCurrentLevelId(null)}
            className="text-gray-500 hover:text-gray-800 font-semibold"
          >
            ← Back to Levels
          </button>
          <span className="font-bold text-gray-700">Word: {currentWordIndex + 1} / {activeLevel.words.length}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{activeLevel.title}</h2>
        
        <button 
          onClick={() => speakWord(activeLevel.words[currentWordIndex])}
          className="mb-6 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full p-4 text-3xl transition-colors"
          title="Listen to word"
        >
          🔊
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full text-center text-2xl p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            placeholder="Type the word here..."
            autoFocus
            autoComplete="off"
          />
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-xl transition-colors"
          >
            Check Word
          </button>
        </form>

        <button 
          onClick={() => setShowAnswer(true)}
          className="mt-4 text-sm font-semibold text-amber-600 hover:text-amber-700 underline"
        >
          Help! Show me the answer
        </button>

        {showAnswer && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="text-gray-600 text-sm block mb-1">The word is:</span>
            <span className="text-2xl font-mono font-bold tracking-wider text-gray-800">
              {activeLevel.words[currentWordIndex]}
            </span>
          </div>
        )}

        {feedback && (
          <div className={`mt-6 text-2xl font-bold ${feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'}`}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}
