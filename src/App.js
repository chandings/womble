import './App.scss';
import Header from './components/header/Header';
import Game from './components/game/Game';
import {useState} from 'react'
import Help from './components/help/Help';
import Config from './components/config/Config';

function App() {
  const [currentView, setCurrentView] = useState("game");

  const getCurrentView = ()=>{
    switch(currentView){
      case "help":
        return <Help setCurrentView={setCurrentView}/>
        break;
      case "config":
        return <Config setCurrentView={setCurrentView}/>
      default:
        return <Game/>
    }
  }

  return (
    <div className="App">
      <Header setCurrentView={setCurrentView}></Header>
      {getCurrentView()}
    </div>
  );
}

export default App;
