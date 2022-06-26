import {useEffect, useState, useRef} from 'react'
import LetterButton from '../letterButton/LetterButton'
import * as faIcons from "react-icons/fa";
import './KeyPad.scss'

export default function KeyPad({word, setLetter, inputDone, inputStart}) {
  const isFirstLetter = useRef(true);
  const finalWord = useRef([]);
  const resetFunctions = useRef([]);

  const letterCallback = (letter)=>{
    finalWord.current.push(letter)
    if(isFirstLetter.current){
      isFirstLetter.current = false;
      inputStart(letter);
    }else{
      setLetter(letter)
    }
  }

  const getResetFunctions = (resetFn)=>{
    const contains = resetFunctions.current.find((item)=>{
      if(item.index === resetFn.index){
        return item;
      }
    });
    if(!contains){
      resetFunctions.current.push(resetFn);
    }
  }

  const checkWord = ()=>{
    inputDone(finalWord.current)
    finalWord.current = [];
    isFirstLetter.current = true;
    resetFunctions.current.forEach((resetFn)=>{
      resetFn.reset()
    })
  }

  return (
    <div className='keypad-container'>
      <div className='letter-container'>
        {
          word.map((letter, index)=>(
            <LetterButton 
              key={'letterButton' + index} 
              letter={letter} 
              index={index} 
              letterCallback={letterCallback}
              resetCallback={getResetFunctions}
            />))
        }
      </div>
      <div className='letter-container'>
        <div className='check-button' onClick={checkWord}><faIcons.FaCheck /></div>
      </div>
    </div>
  )
}
