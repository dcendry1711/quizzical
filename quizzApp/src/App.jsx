import { useState } from 'react'
import { useEffect} from 'react'
import {decode} from 'html-entities'

export function App() {

  /*Request do API w celu pobrania pytań do quizu */

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=5&difficulty=easy')
      .then(res => res.json())
      .then(data => setDataForQuiz(data.results))
  },[])

  /* Tworzenie state do przetrzymywania danych pobranych z API */

  const [dataForQuiz, setDataForQuiz] = useState([])
  
  const questionEl = dataForQuiz.length > 0 ? 

  //co jeśli warunek jest spełniony

    dataForQuiz.map( object => {
      
      if (!object.correct_answer || !object.incorrect_answers) return null;

      const decodedQuestion = decode(object.question);

      function shuffle(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      }

      const shuffledAnswers = shuffle([...object.incorrect_answers, object.correct_answer]);

      return (
        <section key={object.question} className="question-container">
          <h2>{decodedQuestion}</h2>
          {shuffledAnswers.map(answer => (
            <button key={object.question + answer}>{decode(answer)}</button>
          ))}
        </section>
      );
    })
  : (<p>Ładowanie pytań...</p>)

  return(
    <main>
      {questionEl}
    </main>
  )}
