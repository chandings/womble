import {useState, useEffect, useRef} from 'react'
import { CSSTransition } from "react-transition-group";
import LetterButton from '../letterButton/LetterButton'
import {nextWord, loadLevelsFile, setLevelsData} from '../../utils/Words'
import "./Game.scss"
import DefinitionModal from '../definitionModal/DefinitionModal';
import axios from 'axios';
import DialPad from '../dialPad/DialPad';


export default function Game() {
  const [openDefinition, setOpenDefinition] = useState(false);
  const [defintionOf, setDefinitionOf] = useState("");
  const [gotDefinition, setGotDefinition] = useState(false);
  const [defintion, setDefinition] = useState([]);
  const [playerWord, setPlayerWord] = useState([]);
  const [unlockNextLevel,setUnlockNextLevel] = useState(false);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [word, setWord] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false);
  const [allValidWords, setAllValidWords] = useState([]);
  const [allPlayerWords, setAllPlayerWords] = useState([]);
  const [resetFunctions, addResetFunctions] = useState([]);
  const [showPlayerWord, setShowPlayerWord] = useState(false);
  const [wordTransitions,setWordTransitions] = useState("incorrect-transition")
  const isReady = useRef(false);

  const setLetter = (letter)=>{
    setPlayerWord([...playerWord,letter]);
  }

  const inputStart = (letter)=>{
    setShowPlayerWord(true);
    setPlayerWord([letter]);
  }

  const inputDone = (finalWord)=>{
    console.log(finalWord);
    checkIfPlayerWordIsValid(finalWord.join(""));
    setShowPlayerWord(false);
  }

  const checkIfPlayerWordIsValid = (wordToCheck)=>{
    let continueChecking = true;
    if(allPlayerWords.indexOf(wordToCheck) === -1 && allValidWords.indexOf(wordToCheck) !== -1){
      setAllPlayerWords(previousWord=>{
        if(previousWord.indexOf(wordToCheck)===-1){
          return [...previousWord, wordToCheck]
        }
        continueChecking = false;
        return previousWord;
      });
      if(continueChecking){
        setScore((prevScore)=>{
          if(wordToCheck.length === word.length){
            return prevScore+10;
          }
          return prevScore+1;
        })
        setPlayerWord("");
        if(!unlockNextLevel){
          checkIfNextLevelReady(wordToCheck)
        }
      }
    }
  }

  const checkIfNextLevelReady = (wordToCheck)=>{
    
      if(wordToCheck.length===word.length){
        setUnlockNextLevel(true);
      }
  }

  const getResetFunction = (resetFunc)=>{
    addResetFunctions(prevFunctions=>{
      const contains = prevFunctions.find((item)=>{
        if(item.index === resetFunc.index){
        return item;
        }
      });
      if(!contains){
        return [...prevFunctions, resetFunc]
      }
      return prevFunctions;
    })
  }

  const resetAllLetters = ()=>{
    setPlayerWord("");
    resetFunctions.forEach(item=>item.reset())
  }

  const getInputMode = ()=>{
    return <DialPad word={word} level={level} inputDone={inputDone} inputStart={inputStart} setLetter={setLetter}></DialPad>
  }

  useEffect(()=>{
    const fetchLevel = async ()=>{
      try {
        let response = await loadLevelsFile();
        const wombleDataStr = localStorage.getItem('wombleData');
        let currentLevel = 0;
        console.log(wombleDataStr);
        if(wombleDataStr && wombleDataStr !== ""){
          let wombleData = JSON.parse(wombleDataStr);
          currentLevel = wombleData.level;
          setScore(wombleData.score);
          setUnlockNextLevel(wombleData.unlockNextLevel);
          setAllPlayerWords(wombleData.allPlayerWords);
          setLevel(wombleData.level);
        }else{
          localStorage.setItem('wombleData',JSON.stringify({
            score:0, 
            level:0, 
            unlockNextLevel:false,
            allPlayerWords:[]
          }));
        }
        setLevelsData(response.data);
        startLevel(currentLevel);
        isReady.current = true;
      }catch (e) {
        console.log(e);
        setIsError(true);
      }
    }
    fetchLevel();

  },[]);
  
  useEffect(()=>{
    isReady.current&&localStorage.setItem('wombleData',JSON.stringify({...JSON.parse(localStorage.getItem('wombleData')),score}))
  },[score]);
  useEffect(()=>{
    isReady.current&&localStorage.setItem('wombleData',JSON.stringify({...JSON.parse(localStorage.getItem('wombleData')),level}))
  },[level]);
  useEffect(()=>{
    isReady.current&&localStorage.setItem('wombleData',JSON.stringify({...JSON.parse(localStorage.getItem('wombleData')),unlockNextLevel}))
  },[unlockNextLevel]);
  useEffect(()=>{
    isReady.current&&localStorage.setItem('wombleData',JSON.stringify({...JSON.parse(localStorage.getItem('wombleData')),allPlayerWords}))
  },[allPlayerWords]);

  const openNextLevel = ()=>{
    updateScore();
    addResetFunctions([]);
    setAllPlayerWords([]);
    setLevel((prevLevel)=>prevLevel+1);
    startLevel(level+1);
    //saveNewLevel(level+1);
    setUnlockNextLevel(false);
  }

  /*
  30 bonus points if half or more words are found
  */ 
  const updateScore = ()=>{
   
    if(allValidWords.length/2 <= allPlayerWords.length){
      setScore((prevScore)=>{
        return prevScore+30;
      })
    }
  }

  const startLevel = async (newLevel)=>{
    try{
      setIsLoading(true)
      const response = await nextWord(newLevel);
      //setLevel(newLevel);
      setWord(response.data.word.split(''));
      //setWord("abcdefghi".split(''));
      setAllValidWords(response.data.allValidWords);
      //setUnlockNextLevel(false);
      setIsLoading(false);
    }catch (e) {
      console.log(e);
      setIsError(true);
    }
  }

  const openDefinitionModal = async (word)=>{
    setIsLoading(true)
    try{
    const response = await axios.get("https://api.dictionaryapi.dev/api/v2/entries/en/"+word)
    setDefinition(response.data);
    setDefinitionOf(word);
    setGotDefinition(true);
    setOpenDefinition(true);
    setIsLoading(false)
    }catch(error){
      console.log(error);
      setDefinition([]);
      setDefinitionOf(word);
      setGotDefinition(false);
      setOpenDefinition(true);
      setIsLoading(false)
    }
  }

  if(isLoading)
    return (<div><ul className="loader">
    <li className="item item-1"></li>
    <li className="item item-2"></li>
    <li className="item item-3"></li>
    <li className="item item-4"></li>
    <li className="item item-5"></li>
    <li className="item item-6"></li>
    <li className="item item-7"></li>
    <li className="item item-8"></li>
    <li className="center"></li>
  </ul></div>)
  else if(isError)
    return (<div>Something went wrong</div>)
  else
    return (
      <div className="game-container">
        <div className="game">
          <div className="word-container">
            <div className="score-container">
              <label className="score">Words: {allPlayerWords.length}/{allValidWords.length}</label>
              <label className="score">Level: {level+1}</label>
              <label className="score">Score: {score}</label>
            </div>
            <div className='word'>
              <CSSTransition
                in={showPlayerWord}
                timeout={500}
                classNames={wordTransitions}
                appear
                >
                <span>{playerWord}</span>
              </CSSTransition>
            </div>
          </div>
          <div className="game-btn-container">
          <button className="game-btn" onClick={resetAllLetters} disabled={playerWord.length==0}>Clear</button>
          <button className="game-btn" onClick={openNextLevel} disabled={!unlockNextLevel}>Next</button>
          </div>
          {getInputMode()}
          {openDefinition && <DefinitionModal close={setOpenDefinition} word={defintionOf} data={defintion} gotDefinition={gotDefinition}/>}
          <div className='player-word-container'>
            {allPlayerWords.map((playerWord,index)=>(
                <div 
                  key={'playerWord' + index} 
                  className='player-word'>
                  {playerWord}
                  <button className='player-word-btn' onClick={()=>{openDefinitionModal(playerWord)}}>Defintion</button>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
}
