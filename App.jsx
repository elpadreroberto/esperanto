import React, { useState, useEffect, useCallback } from 'react';
import { 
  RotateCcw, BookOpen, Volume2, Trophy, 
  Shuffle, GraduationCap, ArrowLeft, CheckCircle2, XCircle, RefreshCw, Lock, Play
} from 'lucide-react';

// --- BASE DE DATOS EXTENDIDA ---
const wordDatabase = [
  // NIVEL 1: Saludos
  { word: "Saluton", translation: "Hola", pron: "sa-LU-ton", category: "Saludos" },
  { word: "Dankon", translation: "Gracias", pron: "DAN-kon", category: "Saludos" },
  { word: "Jes", translation: "Sí", pron: "yes", category: "Básicos" },
  { word: "Ne", translation: "No", pron: "ne", category: "Básicos" },
  { word: "Bonan matenon", translation: "Buenos días", pron: "BO-nan ma-TE-non", category: "Saludos" },
  { word: "Bonan nokton", translation: "Buenas noches", pron: "BO-nan NOK-ton", category: "Saludos" },
  { word: "Kiel vi fartas?", translation: "¿Cómo estás?", pron: "Ki-el vi FAR-tas", category: "Saludos" },
  { word: "Mi fartas bone", translation: "Estoy bien", pron: "Mi FAR-tas BO-ne", category: "Saludos" },
  { word: "Bonvolu", translation: "Por favor", pron: "bon-VO-lu", category: "Básicos" },
  { word: "Pardonu", translation: "Perdón / Disculpa", pron: "par-DO-nu", category: "Básicos" },

  // NIVEL 2: Pronombres
  { word: "Mi", translation: "Yo", pron: "mi", category: "Personas" },
  { word: "Vi", translation: "Tú / Vosotros", pron: "vi", category: "Personas" },
  { word: "Li", translation: "Él", pron: "li", category: "Personas" },
  { word: "Ŝi", translation: "Ella", pron: "shi", category: "Personas" },
  { word: "Ĝi", translation: "Ello (cosa)", pron: "dyi", category: "Personas" },
  { word: "Ni", translation: "Nosotros", pron: "ni", category: "Personas" },
  { word: "Ili", translation: "Ellos", pron: "I-li", category: "Personas" },
  { word: "Homo", translation: "Ser humano", pron: "HO-mo", category: "Personas" },
  { word: "Viro", translation: "Hombre", pron: "VI-ro", category: "Personas" },
  { word: "Virino", translation: "Mujer", pron: "vi-RI-no", category: "Personas" },

  // NIVEL 3: Familia
  { word: "Amiko", translation: "Amigo", pron: "a-MI-ko", category: "Familia" },
  { word: "Patro", translation: "Padre", pron: "PA-tro", category: "Familia" },
  { word: "Patrino", translation: "Madre", pron: "pa-TRI-no", category: "Familia" },
  { word: "Frato", translation: "Hermano", pron: "FRA-to", category: "Familia" },
  { word: "Fratino", translation: "Hermana", pron: "fra-TI-no", category: "Familia" },
  { word: "Familio", translation: "Familia", pron: "fa-mi-LI-o", category: "Familia" },
  { word: "Knabo", translation: "Niño", pron: "KNA-bo", category: "Familia" },
  { word: "Knabino", translation: "Niña", pron: "kna-BI-no", category: "Familia" },
  { word: "Edzo", translation: "Esposo", pron: "ED-zo", category: "Familia" },
  { word: "Edzino", translation: "Esposa", pron: "ed-ZI-no", category: "Familia" },

  // NIVEL 4: Verbos
  { word: "Estas", translation: "Ser / Estar", pron: "ES-tas", category: "Verbos" },
  { word: "Havas", translation: "Tener", pron: "HA-vas", category: "Verbos" },
  { word: "Faras", translation: "Hacer", pron: "FA-ras", category: "Verbos" },
  { word: "Iras", translation: "Ir", pron: "I-ras", category: "Verbos" },
  { word: "Venas", translation: "Venir", pron: "VE-nas", category: "Verbos" },
  { word: "Parolas", translation: "Hablar", pron: "pa-RO-las", category: "Verbos" },
  { word: "Vidas", translation: "Ver", pron: "VI-das", category: "Verbos" },
  { word: "Aŭdas", translation: "Oír", pron: "AŬ-das", category: "Verbos" },
  { word: "Manĝas", translation: "Comer", pron: "MAN-dyas", category: "Verbos" },
  { word: "Trinkas", translation: "Beber", pron: "TRIN-kas", category: "Verbos" },

  // NIVEL 5: Hogar
  { word: "Domo", translation: "Casa", pron: "DO-mo", category: "Hogar" },
  { word: "Ĉambro", translation: "Habitación", pron: "CHAM-bro", category: "Hogar" },
  { word: "Tablo", translation: "Mesa", pron: "TA-blo", category: "Hogar" },
  { word: "Seĝo", translation: "Silla", pron: "SE-dyo", category: "Hogar" },
  { word: "Libro", translation: "Libro", pron: "LI-bro", category: "Hogar" },
  { word: "Papero", translation: "Papel", pron: "pa-PE-ro", category: "Hogar" },
  { word: "Plumo", translation: "Bolígrafo", pron: "PLU-mo", category: "Hogar" },
  { word: "Telefono", translation: "Teléfono", pron: "te-le-FO-no", category: "Hogar" },
  { word: "Komputilo", translation: "Computadora", pron: "kom-pu-TI-lo", category: "Hogar" },
  { word: "Lito", translation: "Cama", pron: "LI-to", category: "Hogar" },
];

export default function App() {
  const [view, setView] = useState('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [cards, setCards] = useState([]);
  const [completedLevels, setCompletedLevels] = useState([]);
  
  // Estados Test
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSuperReview, setIsSuperReview] = useState(false);

  // --- PERSISTENCIA ---
  useEffect(() => {
    const saved = localStorage.getItem('esperanto_1000_progress');
    if (saved) setCompletedLevels(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('esperanto_1000_progress', JSON.stringify(completedLevels));
  }, [completedLevels]);

  // --- AUDIO ---
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT'; // El Esperanto fonéticamente se parece al italiano/español
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const loadLevel = (level) => {
    const start = (level - 1) * 10;
    const slice = wordDatabase.slice(start, start + 10);
    const preparedCards = slice.map((item, idx) => ({ ...item, id: idx, flipped: false }));
    setCards(preparedCards);
    setCurrentLevel(level);
    setView('flashcards');
    window.scrollTo(0, 0);
  };

  const generateTest = (poolOfWords, isReview = false) => {
    const questions = poolOfWords.map(target => {
      const distractors = wordDatabase
        .filter(w => w.word !== target.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      const options = [target, ...distractors]
        .map(o => o.translation)
        .sort(() => Math.random() - 0.5);

      return {
        question: target.word,
        correct: target.translation,
        options: options
      };
    }).sort(() => Math.random() - 0.5);

    setTestQuestions(questions);
    setCurrentQuestionIdx(0);
    setScore(0);
    setTestFinished(false);
    setSelectedAnswer(null);
    setIsSuperReview(isReview);
    setView('test');
  };

  const handleAnswer = (option) => {
    if (selectedAnswer) return;
    setSelectedAnswer(option);
    if (option === testQuestions[currentQuestionIdx].correct) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQuestionIdx < testQuestions.length - 1) {
        setCurrentQuestionIdx(i => i + 1);
        setSelectedAnswer(null);
      } else {
        setTestFinished(true);
      }
    }, 800);
  };

  const toggleAll = (flipTo) => {
    setCards(prev => prev.map(c => ({ ...c, flipped: flipTo })));
  };

  const shuffleAll = () => {
    setCards(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  // --- VISTA MENU ---
  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
        <header className="max-w-5xl mx-auto mb-12 text-center pt-8">
          <div className="inline-block p-3 bg-emerald-500/10 rounded-3xl mb-4">
            <BookOpen className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
            ESPERANTO <span className="text-emerald-500">1000</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            Domina el idioma universal paso a paso. Desbloquea niveles completando exámenes con +70%.
          </p>
        </header>

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, i) => {
            const levelNum = i + 1;
            const isDone = completedLevels.includes(levelNum);
            const isUnlocked = levelNum === 1 || completedLevels.includes(levelNum - 1);
            const hasContent = levelNum <= 5;

            return (
              <button
                key={levelNum}
                disabled={!isUnlocked || !hasContent}
                onClick={() => loadLevel(levelNum)}
                className={`group relative h-40 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                  ${isDone 
                    ? 'bg-emerald-600 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                    : isUnlocked && hasContent
                      ? 'bg-slate-900 border-slate-800 hover:border-emerald-500 hover:scale-105' 
                      : 'bg-slate-950 border-slate-900 opacity-40 grayscale cursor-not-allowed'
                  }`}
              >
                {isDone && <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-emerald-200" />}
                {!isUnlocked && <Lock className="absolute top-3 right-3 w-4 h-4 text-slate-600" />}
                
                <span className="text-4xl font-black mb-1">{levelNum}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 group-hover:text-white transition-colors">
                  {isDone ? 'Dominado' : !hasContent ? 'Próximamente' : isUnlocked ? 'Estudiar' : 'Bloqueado'}
                </span>
                
                {isUnlocked && hasContent && !isDone && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
                    <div className="h-full bg-emerald-500 w-0 group-hover:w-full transition-all duration-500"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- VISTA TEST ---
  if (view === 'test') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {!testFinished ? (
            <>
              <div className="flex justify-between items-center mb-10">
                <div className="flex flex-col">
                  <span className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">
                    {isSuperReview ? 'Super Repaso Mixto' : `Examen Nivel ${currentLevel}`}
                  </span>
                  <div className="h-1.5 w-32 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-300" 
                      style={{ width: `${((currentQuestionIdx + 1) / testQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-slate-500 font-mono text-sm">{currentQuestionIdx + 1} / {testQuestions.length}</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black text-center mb-12 text-white leading-tight">
                ¿Qué significa <br/>
                <span className="text-emerald-400 block mt-2">"{testQuestions[currentQuestionIdx].question}"?</span>
              </h3>

              <div className="grid grid-cols-1 gap-3">
                {testQuestions[currentQuestionIdx].options.map((opt, i) => {
                  const isCorrect = opt === testQuestions[currentQuestionIdx].correct;
                  const isSelected = selectedAnswer === opt;
                  
                  let btnStyle = "w-full p-5 rounded-2xl border-2 text-left transition-all font-bold flex justify-between items-center ";
                  if (selectedAnswer) {
                    if (isCorrect) btnStyle += "bg-emerald-600/20 border-emerald-500 text-emerald-400";
                    else if (isSelected) btnStyle += "bg-red-600/20 border-red-500 text-red-400";
                    else btnStyle += "bg-slate-800/50 border-slate-800 opacity-50";
                  } else {
                    btnStyle += "bg-slate-800 border-slate-700 hover:border-emerald-500 hover:bg-slate-750 text-slate-200";
                  }

                  return (
                    <button key={i} onClick={() => handleAnswer(opt)} className={btnStyle}>
                      <span>{opt}</span>
                      {selectedAnswer && isCorrect && <CheckCircle2 className="w-6 h-6" />}
                      {selectedAnswer && isSelected && !isCorrect && <XCircle className="w-6 h-6" />}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="relative inline-block mb-6">
                <Trophy className={`w-24 h-24 mx-auto ${score >= (testQuestions.length * 0.7) ? 'text-yellow-500' : 'text-slate-600'}`} />
                {score >= (testQuestions.length * 0.7) && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              
              <h2 className="text-4xl font-black mb-2 text-white">
                {score >= (testQuestions.length * 0.7) ? '¡Excelente!' : 'Sigue practicando'}
              </h2>
              <p className="text-slate-400 mb-10 text-xl font-medium">
                Puntuación: <span className="text-emerald-400 font-bold">{score}</span> de {testQuestions.length}
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setView('flashcards')}
                  className="w-full bg-emerald-600 text-white font-bold py-5 rounded-2xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" /> REPASAR CARTAS
                </button>
                <button 
                  onClick={() => {
                    if (!isSuperReview && score >= 7) {
                        if (!completedLevels.includes(currentLevel)) {
                          setCompletedLevels(prev => [...prev, currentLevel]);
                        }
                    }
                    setView('menu');
                  }}
                  className="w-full bg-slate-800 text-slate-300 font-bold py-5 rounded-2xl hover:bg-slate-700 transition-all border border-slate-700"
                >
                  VOLVER AL INICIO
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- VISTA FLASHCARDS ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Barra de Herramientas Premium */}
      <div className="max-w-7xl mx-auto mb-10 bg-slate-900/80 backdrop-blur-md p-5 rounded-[2rem] border border-white/5 flex flex-wrap items-center justify-between gap-6 sticky top-4 z-50 shadow-2xl">
        <div className="flex items-center gap-5">
          <button onClick={() => setView('menu')} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-300 hover:text-white transition-all shadow-inner">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white leading-none">NIVEL {currentLevel}</h2>
              {completedLevels.includes(currentLevel) && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            </div>
            <span className="text-[10px] text-emerald-500/70 uppercase font-black tracking-[0.2em]">Sesión de estudio activo</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => toggleAll(false)} className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2">
            <Play className="w-3.5 h-3.5" /> ESPERANTO
          </button>
          <button onClick={() => toggleAll(true)} className="bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5" /> TRADUCCIÓN
          </button>
          <button onClick={shuffleAll} className="bg-amber-500/10 text-amber-500 px-4 py-2.5 rounded-xl text-xs font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-all flex items-center gap-2">
            <Shuffle className="w-3.5 h-3.5" /> MEZCLAR
          </button>
        </div>

        <div className="flex gap-3">
          {currentLevel > 1 && (
            <button 
              onClick={() => {
                const prevWords = wordDatabase.slice(0, (currentLevel - 1) * 10);
                generateTest(prevWords.sort(() => Math.random() - 0.5).slice(0, 15), true);
              }}
              className="bg-purple-600/20 text-purple-400 border border-purple-500/30 px-5 py-3 rounded-2xl text-sm font-bold hover:bg-purple-600/30 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> SUPER REPASO
            </button>
          )}

          <button 
            onClick={() => generateTest(cards, false)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-2"
          >
            <GraduationCap className="w-5 h-5" /> EXAMEN
          </button>
        </div>
      </div>

      {/* Grid de Flashcards con Animaciones y Voz */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className="perspective-1000 h-72 cursor-pointer group"
            onClick={() => {
              setCards(prev => prev.map(c => c.id === card.id ? {...c, flipped: !c.flipped} : c));
              if (!card.flipped) speak(card.word); // Habla al mostrar la traducción (o al tocarla)
            }}
          >
            <div className={`relative w-full h-full duration-500 transform-style-3d ${card.flipped ? 'rotate-y-180' : ''}`}>
              {/* Cara Frontal (Esperanto) */}
              <div className="absolute w-full h-full backface-hidden bg-slate-900 border border-slate-800 rounded-[2rem] flex flex-col items-center justify-center p-8 shadow-xl group-hover:border-emerald-500/50 transition-all">
                <div className="absolute top-6 left-6 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase mb-4">ESPERANTO</span>
                <h3 className="text-3xl font-black text-center text-white leading-tight break-words">{card.word}</h3>
                <button 
                  onClick={(e) => { e.stopPropagation(); speak(card.word); }}
                  className="mt-6 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-all"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Cara Trasera (Español) */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-emerald-950/40 border border-emerald-800/50 backdrop-blur-sm rounded-[2rem] flex flex-col items-center justify-center p-8 shadow-2xl">
                <span className="text-[10px] text-emerald-400 font-bold tracking-[0.3em] uppercase mb-4">ESPAÑOL</span>
                <p className="text-2xl font-bold text-white mb-6 text-center leading-tight">{card.translation}</p>
                
                <div className="bg-black/40 px-4 py-2 rounded-xl flex items-center gap-3 border border-white/5">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono text-emerald-300 font-medium italic">{card.pron}</span>
                </div>
                
                <div className="mt-4 text-[9px] font-black text-emerald-600 tracking-widest uppercase">
                  {card.category}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Stats */}
      <footer className="max-w-7xl mx-auto border-t border-slate-900 pt-8 pb-12 flex flex-col md:flex-row justify-between items-center opacity-50 gap-4">
        <p className="text-xs font-medium">Desarrollado para la comunidad de Esperanto 1000</p>
        <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold uppercase tracking-tighter">Progreso Guardado</span>
            </div>
        </div>
      </footer>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
