import {useState, useEffect, useRef} from 'react'
//import { CSSTransition } from "react-transition-group";
import {nextWord, loadLevelsFile, setLevelsData} from '../../utils/Words'
import "./Game.scss"
import DefinitionModal from '../definitionModal/DefinitionModal';
import axios from 'axios';
import DialPad from '../dialPad/DialPad';
import KeyPad from '../keyPad/KeyPad';
import correct from '../../audio/correct.mp3'
import wrong from '../../audio/wrong.mp3'
import type from '../../audio/type.mp3'
import {setLocalConfigDataParam, getLocalCofigData} from '../../utils/LocalConfig'
import {getWombleData, setWombleDataParam} from '../../utils/LocalData'
import Loader from '../loader/Loader';


export default function Game() {
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
  const [wordTransitions,setWordTransitions] = useState("")
  const isReady = useRef(false);
  const audio = useRef(true);
  const [useDragInput, setUseDragInput] = useState(true);

  const correctAudio = useRef(new Audio(correct));
  const wrongAudio = useRef(new Audio(wrong));
  //Adding redundancy as typeaudio may be played multiple time quickly
  const typeAudio = useRef([new Audio(type),new Audio(type),new Audio(type)]);
  const typeAudioIndex = useRef(0);

  const setLetter = (letter)=>{
    setPlayerWord([...playerWord,letter]);
    typeAudioIndex.current++;
    if(typeAudioIndex.current >= typeAudio.current.length){
      typeAudioIndex.current = 0;
    }
    
    playAudio(typeAudio.current[typeAudioIndex.current]);
  }

  const playAudio = (audioToBePlayed)=>{
    console.log("asdfsdfsaf")
    if(audio.current){
      audioToBePlayed.play();
    }
  }

  const inputStart = (letter)=>{
    //setShowPlayerWord(true);
    setWordTransitions("")
    setPlayerWord([letter]);
    typeAudioIndex.current = 0;
    playAudio(typeAudio.current[typeAudioIndex.current]);
  }

  const inputDone = (finalWord)=>{
    console.log(finalWord);
    const isPlayerWordValid = checkIfPlayerWordIsValid(finalWord.join(""));
    if(isPlayerWordValid){
      setWordTransitions("correct-transition")
      playAudio(correctAudio.current)
    }else if(finalWord.length>0){
      setWordTransitions("incorrect-transition")
      playAudio(wrongAudio.current)
    }
    //setShowPlayerWord(false);
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
        //setPlayerWord("");
        if(!unlockNextLevel){
          checkIfNextLevelReady(wordToCheck)
        }
      }
      return continueChecking;
    }
    return false;
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
    if(useDragInput){
      return <DialPad word={word} level={level} inputDone={inputDone} inputStart={inputStart} setLetter={setLetter}/>
    }else{
      return <KeyPad word={word} level={level} inputDone={inputDone} inputStart={inputStart} setLetter={setLetter}/>
    }
  }

  useEffect(()=>{
    const fetchLevel = async ()=>{
      try {
        const wombleConfigData = getLocalCofigData();
        setUseDragInput(wombleConfigData.useDragInput)
        audio.current = wombleConfigData.audio;
        let response = await loadLevelsFile();
        
        const wombleData = getWombleData();
        let currentLevel = wombleData.level;
        setScore(wombleData.score);
        setUnlockNextLevel(wombleData.unlockNextLevel);
        setAllPlayerWords(wombleData.allPlayerWords);
        setLevel(wombleData.level);

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
    isReady.current&&setWombleDataParam(score, 'score');
  },[score]);
  useEffect(()=>{
    isReady.current&&setWombleDataParam(level, 'level');
  },[level]);
  useEffect(()=>{
    isReady.current&&setWombleDataParam(unlockNextLevel, 'unlockNextLevel');
  },[unlockNextLevel]);
  useEffect(()=>{
    isReady.current&&setWombleDataParam(allPlayerWords, 'allPlayerWords');
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
    }else if(allValidWords.length === allPlayerWords.length){
      setScore((prevScore)=>{
        return prevScore+100;
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

  if(isLoading)
    return (<Loader/>)
  else if(isError)
    return (<div>Something went wrong</div>)
  else
    return (
      <div className="game-container" onTouchStart={()=>{console.log("Registering touch event to enable sound play!")}}>
        <div className="game">
          <div className="word-container">
            <div className="score-container">
              <label className="score">Words: {allPlayerWords.length}/{allValidWords.length}</label>
              <label className="score">Level: {level+1}</label>
              <label className="score">Score: {score}</label>
            </div>
            <div className={'word'}>
                <div className={wordTransitions}>{playerWord}</div>
            </div>
          </div>
          <div className="game-btn-container">
          {/* <button className="game-btn" onClick={resetAllLetters} disabled={playerWord.length==0}>Clear</button> */}
          <button className="game-btn" onClick={openNextLevel} disabled={!unlockNextLevel}>Next</button>
          </div>
          {getInputMode()}
          {/* <div className='player-word-container'>
            {allPlayerWords.map((playerWord,index)=>(
                <div 
                  key={'playerWord' + index} 
                  className='player-word'>
                  {playerWord}
                  <button className='player-word-btn' onClick={()=>{openDefinitionModal(playerWord)}}>Defintion</button>
                </div>
              ))}
          </div> */}
        </div>
      </div>
    )
}
