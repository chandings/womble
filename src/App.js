import './App.css';
import Header from './components/header/Header';
import Game from './components/game/Game';
import {useState} from 'react'

function App() {
  const [showHelp, setShowHelp] = useState(false);
  const showHelpDiv =()=>{
    setShowHelp(true);
  }
  const hideHelpDiv =()=>{
    setShowHelp(false);
  }
  return (
    <div className="App">
      <Header showHelp={showHelpDiv}></Header>
      {(showHelp)?(<div className="app-help-container">
        <div className='app-help'>
          <div className="app-help-close-btn-container">
            <button className="app-help-close-btn" onClick={hideHelpDiv}><i className="gg-close"></i></button> 
          </div>
          <h3>How to play Womble?</h3>
          <p>Womble is a word jumble game. Aim is to make as many 3-letter words as possible using the alphabets provided. 
          To be able to move to the next level you need to make at least one word using all the alphabets.</p>
          <h3>How are you scored?</h3>
          <ul>
            <li>Every word you make gets you 1 pont.</li>
            <li>If the word uses all the available alphabets you get 10 points.</li>
            <li>If you are able to make half of the words or more in our list you get a 30 points bonus.</li>
            <li>If you are able to make all of the words in our list you get a 100 points bonus.</li>
          </ul>
        </div>
      </div>):(<Game></Game>)}
    </div>
  );
}

export default App;
