import {useState, useEffect} from 'react'
import LetterButton from '../letterButton/LetterButton'
import {nextWord, loadLevelsFile, setLevelsData} from '../../utils/Words'
import "./Game.css"
import DefinitionModal from '../definitionModal/DefinitionModal';
import axios from 'axios';


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

  const letterClicked = (letter)=>{
    setPlayerWord([...playerWord,letter]);
    checkIfPlayerWordIsValid([...playerWord, letter].join(''));
  }

  const checkIfPlayerWordIsValid = (wordToCheck)=>{
    if(allPlayerWords.indexOf(wordToCheck) === -1 && allValidWords.indexOf(wordToCheck) !== -1){
      setAllPlayerWords(previousWord=>{
        return [...previousWord, wordToCheck]
      });
      setScore((prevScore)=>{
        if(wordToCheck.length === word.length){
          return prevScore+10;
        }
        return prevScore+1;
      })
      resetAllLetters();
      if(!unlockNextLevel){
        checkIfNextLevelReady(wordToCheck)
      }

      save();
    }
  }

  const save= async ()=>{
    
    let unlockNextLevelLatest, allPlayerWordsLatest, scoreLatest, levelLatest;

    await setUnlockNextLevel((prevValue)=>{
      unlockNextLevelLatest = prevValue;
      return prevValue;
    })

    await setAllPlayerWords((prevValue)=>{
      allPlayerWordsLatest = prevValue;
      return prevValue;
    })
    
    await setScore((prevValue)=>{
      scoreLatest = prevValue;
      return prevValue;
    })

    await setLevel((prevValue)=>{
      levelLatest = prevValue;
      return prevValue;
    })

    
    const saveData = JSON.stringify({score:scoreLatest, level:levelLatest, unlockNextLevel:unlockNextLevelLatest,allPlayerWords:allPlayerWordsLatest});

    localStorage.setItem('wombleData',saveData);
  }

  const saveNewLevel= async (newLevel)=>{
    
    let scoreLatest;
    
    await setScore((prevValue)=>{
      scoreLatest = prevValue;
      return prevValue;
    })

    
    const saveData =JSON.stringify({score:scoreLatest, level:newLevel, unlockNextLevel:false,allPlayerWords:[]});

    localStorage.setItem('wombleData',saveData);
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

  useEffect(()=>{
    const fetchLevel = async ()=>{
      try {
        let response = await loadLevelsFile();
        const wombleDataStr = localStorage.getItem('wombleData');
        let currentLevel = 0;
        if(wombleDataStr && wombleDataStr !== ""){
          let wombleData = JSON.parse(wombleDataStr);
          currentLevel = wombleData.level;
          setScore(wombleData.score);
          setUnlockNextLevel(wombleData.unlockNextLevel);
          setAllPlayerWords(wombleData.allPlayerWords);
          setLevel(wombleData.level);
        }
        setLevelsData(response.data);
        startLevel(currentLevel);
      }catch (e) {
        console.log(e);
        setIsError(true);
      }
    }
    fetchLevel();

  },[]);

  const openNextLevel = ()=>{
    updateScore();
    addResetFunctions([]);
    setAllPlayerWords([]);
    setLevel((prevLevel)=>prevLevel+1);
    startLevel(level+1);
    saveNewLevel(level+1);
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
    return (<div><ul class="loader">
    <li class="item item-1"></li>
    <li class="item item-2"></li>
    <li class="item item-3"></li>
    <li class="item item-4"></li>
    <li class="item item-5"></li>
    <li class="item item-6"></li>
    <li class="item item-7"></li>
    <li class="item item-8"></li>
    <li class="center"></li>
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
            <div className='word'>{playerWord}</div>
          </div>
          <div className="game-btn-container">
          <button className="game-btn" onClick={resetAllLetters} disabled={playerWord.length==0}>Clear</button>
          <button className="game-btn" onClick={openNextLevel} disabled={!unlockNextLevel}>Next</button>
          </div>
          <div className="letter-container">
            {word.map((letter,index)=>(<LetterButton index={index} key={index+level} letter={letter} level={level} letterCallback={letterClicked} resetCallback={getResetFunction}></LetterButton>))}
          </div>
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
