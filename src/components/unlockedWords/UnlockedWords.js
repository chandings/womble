import {useEffect, useState} from 'react'
import * as faIcons from "react-icons/fa";
import './UnlockedWords.scss'
import axios from 'axios';
import Loader from '../loader/Loader'
import { getWombleDataValue } from '../../utils/LocalData';
import DefinitionModal from '../definitionModal/DefinitionModal';

export default function UnlockedWords({setCurrentView}) {
  const [allPlayerWords, setAllPlayerWords] = useState([]);
  const [definition, setDefinition] = useState([]);
  const [definitionOf, setDefinitionOf] = useState('');
  const [gotDefinition, setGotDefinition] = useState(false);
  const [openDefinition, setOpenDefinition] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(()=>{
    setAllPlayerWords(getWombleDataValue("allPlayerWords"));
  },[]);

  const getPageTitle = ()=>{
    if(allPlayerWords.length===0) return "No words unlocked for the current level!"
    return "Unlocked Words"
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
if(isLoading){
  return (<Loader />);
}else{
  return (
      <div className='unlockedWords-container'>
          <div className="unlockedWords">
          <div className="unlockedWords-close-btn-container">
            <button className="close-btn" onClick={()=>{setCurrentView("")}}>
              <faIcons.FaTimes/>
            </button>
          </div>
          <h3>{getPageTitle()}</h3>
          {openDefinition && <DefinitionModal close={setOpenDefinition} word={definitionOf} data={definition} gotDefinition={gotDefinition}/>}
          {allPlayerWords.map((playerWord,index)=>(
            <div 
              key={'playerWord' + index} 
              className='unlockedWord-player-word'>
              <button className='unlockedWord-player-word-btn' onClick={()=>{openDefinitionModal(playerWord)}}>{playerWord}</button>
              {/* <button className='player-word-btn' >Defintion</button> */}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
