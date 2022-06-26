import './LetterButton.scss';
import {useState, useEffect} from 'react'

export default function LetterButton({index,letter, letterCallback, resetCallback}) {
    const [isEnabled, setIsEnabled] = useState(true);
    const className = isEnabled ? 'letter-button': 'letter-button disabled';

    useEffect(()=>{
        resetCallback({index,reset});
        reset()
    },[]);

    const reset = ()=>{
        setIsEnabled(true);
    }

    const letterClicked=()=>{
        if(!isEnabled){
            return;
        }
        setIsEnabled(false)
        letterCallback(letter)
    };
    return (
        <div className='letter-button' disabled={!isEnabled} onClick={letterClicked}>
            {letter}
        </div>
    )
}
