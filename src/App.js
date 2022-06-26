import './App.scss';
import Header from './components/header/Header';
import Game from './components/game/Game';
import {useState} from 'react'
import Help from './components/help/Help';
import Config from './components/config/Config';
import UnlockedWords from './components/unlockedWords/UnlockedWords';

function App() {
  const [currentView, setCurrentView] = useState("game");
  const [isPrestine, setIsPrestine] = useState(true)

  const getCurrentView = ()=>{
    switch(currentView){
      case "help":
        return <Help setCurrentView={setCurrentView}/>
      case "config":
        return <Config setCurrentView={setCurrentView}/>
      case "unlockedWords":
        return <UnlockedWords setCurrentView={setCurrentView}/>
      default:
        return <Game/>
    }
  }

  if(isPrestine){
    return(<div className='app-message-container' onClick={()=>{setIsPrestine(false)}}> <h3 className='app-message-title'>Please touch anywhere to continue.</h3><p className='app-message'>This is needed to ensure audio plays properly. As per the latest browser policy audio is not allowed to play unless the user has intereacted with the web page. If you want to disable the audio please go to config in menu and turn off audio.</p></div>)
  }

  return (
    <div className="App">
      <Header setCurrentView={setCurrentView}></Header>
      {getCurrentView()}
    </div>
  );
}

export default App;
