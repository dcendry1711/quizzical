import { useState } from 'react'
import { useEffect} from 'react'
import {decode} from 'html-entities'

export function App() {

/*Pobieranie pytań z API*/ 

  useEffect(()=>{
    fetch('https://opentdb.com/api.php?amount=5')
      .then(res => res.json())
      .then(data => setQuestionArr(data.results))
  },[])


/* Umieszczanie danych z API w tablicy */
  const [questionArr, setQuestionArr] = useState([])

/*Mapowanie pytań z tablicy z danymi z API */

 const questionEl = questionArr.length > 0
  ? questionArr.map(object => {
      if (!object.correct_answer || !object.incorrect_answers) return null;

      console.log(object.correct_answer)

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
  : <p>Ładowanie pytań...</p>;


  return (
    <main>
      {questionEl}
    </main>
  )
}

