import React from "react";
import "./Help.css";

import * as faIcons from "react-icons/fa";

export default function Help({ setCurrentView}) {
  return (
    <div className="help-container">
      <div className="help">
        <div className="help-close-btn-container">
          <button className="close-btn" onClick={()=>{setCurrentView("")}}>
            <faIcons.FaTimes/>
          </button>
        </div>
        <h3>How to play Womble?</h3>
        <p>
          Womble is a word jumble game. Aim is to make as many 3 or more letter
          words as possible using the letters provided. To be able to move to
          the next level you need to make at least one word using all the
          letters.
        </p>
        <h3>How are you scored?</h3>
        <ul>
          <li>Every word you make gets you 1 pont.</li>
          <li>If the word uses all the available letters you get 10 points.</li>
          <li>
            If you are able to make half of the words or more in our list you
            get a 30 points bonus.
          </li>
          <li>
            If you are able to make all of the words in our list you get a 100
            points bonus.
          </li>
        </ul>
      </div>
    </div>
  );
}
