import { useState, useEffect } from 'react'
import { decode } from 'html-entities'
import clsx from 'clsx'

export function App() {
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [myAnswers, setMyAnswers] = useState([])

  const isGameOver = myAnswers.length === 5

  useEffect(() => {
    if (isGameStarted) {
      setIsLoading(true)
      fetch('https://opentdb.com/api.php?amount=5&difficulty=easy')
        .then(res => res.json())
        .then(data => {
          const withShuffledAnswers = data.results.map(q => ({
            ...q,
            answers: shuffle([...q.incorrect_answers, q.correct_answer])
          }))
          setShuffledQuestions(withShuffledAnswers)
          setIsLoading(false)
        })
    }
  }, [isGameStarted])

  function shuffle(arr) {
    const copy = [...arr]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }

  function selectAnswer(questionIndex, answer) {
    const alreadyAnswered = myAnswers.some(
      ans => ans.questionIndex === questionIndex
    )
    if (!alreadyAnswered) {
      setMyAnswers(prev => [...prev, { questionIndex, answer }])
    }
  }

  const questionEl = shuffledQuestions.length > 0
    ? shuffledQuestions.map((obj, index) => {
        const allAnswers = obj.answers
        const decodedQuestion = decode(obj.question)


        // Sprawdzamy, czy użytkownik odpowiedział na to pytanie
        const selectedAnswer = myAnswers.find(a => a.questionIndex === index)

        return (
          <section className="single-question" key={index}>
            <h2>{decodedQuestion}</h2>
            <div className="answer-container">
              {allAnswers.map((ans, i) => (
                <button 
                  key={ans} 
                  onClick={() => selectAnswer(index, ans)}
                  disabled={!!selectedAnswer}
                  className={clsx(selectedAnswer?.answer === ans && 'selected')}
                >
                  {decode(ans)}
                </button>
              ))}
            </div>
          </section>
        )
      })
    : null

  function renderQuestions() {
    setIsGameStarted(true)
  }

  return (
    <main>
      {!isGameStarted ? (
        <header>
          <h1>Quizzical</h1>
          <p>Do you wanna some questions???</p>
          <button onClick={renderQuestions}>Start game</button>
        </header>
      ) : isLoading ? (
        <p>Pytania się ładują...</p>
      ) : (
        questionEl
      )}

      {isGameOver &&  <button className="check-Button">Check my answers</button>}
    </main>
  )
}

/*Co na jutro? 

  sprawdzenie odpowiedzi:
  podanie komunikatu "ile odpowiedzi jest prawidłowych"
  oznaczenie osobnym kolorem poprawnych odpowiedzi

  Przycisk nowej gry:
  przycisk pojawia się na zakończenie gry po podaniu przycisku
  nowa gra powoduje losowanie nowych pytań bez wyjścia do ekranu głównego
*/
