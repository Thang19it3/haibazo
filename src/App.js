import React, { useState, useEffect, useRef  } from 'react';
import './App.css';

function App() {
  const [points, setPoints] = useState('3');
  const [numbers, setNumbers] = useState([]);
  const [btnGame, setBtnGame] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);
  const [message, setMessage] = useState('');

  const handlePlay = () => {
    let newNumbers = Array.from({ length: points }, (_, i) => ({
      num: i + 1,
      position: randomPositionBtn(),
      hidden: false,
    }));
    newNumbers = newNumbers.sort(() => Math.random() - 0.5);
    setNumbers(newNumbers);
    setBtnGame(true);
    setTime(0);
    setMessage('');

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTime(prevTime => (Number(prevTime) + 0.1).toFixed(1));
    }, 100);
    
  };

  useEffect(() => {
    if (numbers.every(numObj => numObj.hidden)) {
      setMessage('ALL CLEARED');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [numbers]);

  useEffect(() => {
    setMessage('');
  },[]);

  const handleInputPoints = (e) => {
    setPoints(e.target.value);
  };

  const randomPositionBtn = () => {
    const divSize = 500;
    const btnSize = 20;
    const maxX = divSize - btnSize;
    const maxY = divSize - btnSize;
    const top = Math.random() * maxY;
    const left = Math.random() * maxX;
    return { top, left };
  };

  const numberNotHidden = () => {
    const visibleNumbers = numbers.filter(numObj => !numObj.hidden);
    return Math.min(...visibleNumbers.map(numObj => numObj.num));
  };

  const handleClickBtn = (index) => {

    const numberClick = numbers[index].num
    const minNumber = numberNotHidden();

    if (numberClick === minNumber) {
      setTimeout(() => {
        setNumbers(prevNumbers =>
          prevNumbers.map((numObj, i) =>
            i === index ? { ...numObj, hidden: true } : numObj
          )
        );
      }, 100);
    } else 
    {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); 
      }
      setTimeout(() => {
        setNumbers(prevNumbers =>
          prevNumbers.map((numObj, i) =>
            i === index ? { ...numObj, hidden: true } : numObj
          )
        );
      }, 100);
      setTime(prevTime => prevTime);
      setMessage('GAME OVER');
    }
  };

  const messStyle = {
    color: message === 'ALL CLEARED' ? '#00FF00' : message === 'GAME OVER' ? 'red' : 'black',
  };

  return (
    <div className="App">
      <h3 style={messStyle}>{message ? message : "LET'S PLAY"}</h3>
      <div className='app-header'>
        <h5>Points:</h5>
        <input 
          value={points}
          onChange={handleInputPoints}
        />
        <h5>Time:</h5>
        <span>{time} s</span>
      </div>
      <button onClick={handlePlay}>{btnGame ? 'Reset' : 'Play'}</button>
      <div className='center-game'>
        {numbers.length > 0 && (
          <div className="btn-container">
            {numbers.map(({ num, position, hidden }, index) => (
              !hidden && (
                <button
                  key={index}
                  className="number-btn"
                  style={{
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    zIndex: numbers.length - num + 1,
                  }}
                  onClick={() => handleClickBtn(index)}
                >
                  {num}
                </button>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
