import React from 'react'
import './Header.css'

export default function Header({showHelp}) {
  return (
    <div className='header'>
      <label>Womble</label>
      <div className='header-btn-container'>
        <button className='header-btn' onClick={()=>{console.log("debug clear local storage");localStorage.setItem('wombleData','')}}>Clear</button>
        <button className='header-btn' onClick={()=>{console.log("how to play");showHelp()}}>How to Play</button>
      </div>
    </div>
  )
}
