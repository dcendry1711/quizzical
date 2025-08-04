import { useState, useEffect } from 'react'
import { decode } from 'html-entities'

export function App() {

  const [dataForQuiz, setDataForQuiz] = useState([])

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=5&difficulty=easy')
      .then(res => res.json())
      .then(data => setDataForQuiz(data.results))
  }, [])

  const questionEl = dataForQuiz.length>0 ?
    dataForQuiz.map(obj =>{

      const decodedQuestion = decode(obj.question)

      function shuffle(arr){
        const copy = [...arr]
        for (let i = copy.length - 1 ; i > 0 ; i--){
          const j = Math.floor(Math.random()*(i+1))
          ;[copy[i],copy[j]] = [copy[j],copy[i]]
        }
        return copy
      }

      const shuffledAns = shuffle([
        ...obj.incorrect_answers, 
        obj.correct_answer
      ])

      return(
        <section className="single-question">
          <h2>{decodedQuestion}</h2>
          <div className="answer-container"> 
            {shuffledAns.map(ans => <button>{ans}</button>)}
          </div>
        </section>
      )

    }) : null

  return (
    <main>
      {questionEl}
    </main>
  )
}
