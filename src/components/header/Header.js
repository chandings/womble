import {useState} from 'react'
import './Header.scss'
import * as faIcons from "react-icons/fa";
import { getWombleDataValue } from '../../utils/LocalData';
export default function Header({setCurrentView}) {
  const [isMenuopen, setIsMenuOpen] = useState(false)

  const handleClick = (view) => {
    setIsMenuOpen(false)
    setCurrentView(view);
  }
  return (
      <>{isMenuopen&&<div  onClick={()=>{setIsMenuOpen(false)}} className='blur-modal'></div>}
        <div className='header'>
          <faIcons.FaBars className='menu-icon' onClick={()=>{setIsMenuOpen(true)}}/>
          <label>Womble</label>
        </div>
        <nav className={isMenuopen?"nav-outer active":"nav-outer"}>
          
          <div className='nav-close'><faIcons.FaTimes onClick={()=>{setIsMenuOpen(false)}}/></div>
          <button className='nav-btn' onClick={()=>{handleClick("help")}}>How to Play</button>
          <button className='nav-btn' onClick={()=>{handleClick("config")}}>Config</button>
          <button className='nav-btn' onClick={()=>{handleClick("unlockedWords")}}><span>Unlocked Words</span> <span className='badge'>{getWombleDataValue('allPlayerWords').length}</span></button>
          <button className='nav-btn' onClick={()=>{console.log("debug clear local storage");localStorage.setItem('wombleData','')}}>Clear Progress</button>
          <button className='nav-btn' onClick={()=>{console.log("debug clear local storage");localStorage.setItem('wombleConfigData','')}}>Clear Congig</button>
        </nav>
      </>
  )
}
