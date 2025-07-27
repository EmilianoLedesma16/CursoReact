import { useState } from 'react'
import confetti from 'canvas-confetti'
import './App.css'
import {Square} from "./components/Square.jsx"
import {TURNS} from './constants.js'
import { checkWinner, checkEndGame} from './logic/board.js'
import { WinnerModal } from './components/WinnerModal.jsx'


function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStroage = window.localStorage.getItem('board')
    return boardFromStroage ? JSON.parse(boardFromStroage) : Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() =>{
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.X
  })

  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index) => {
    //no actualizamos esta posición si ya tiene algo
    if(board[index]) return
    // actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // guardar aquí la partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    // revisar si no hay ganador
    const newWinner = checkWinner(newBoard)
    if(newWinner){
      confetti()
      setWinner(newWinner)
    } else if(checkEndGame(newBoard)){
      setWinner(false) // empate
    }

  }


  return (
    <main className='board'>
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reiniciar el juego</button>
      <section className='game'>
        {
          board.map((_, index) => {
            return (
                <Square
                  key={index}
                  index={index}
                  updateBoard={updateBoard}
                >
                  {board[index]}
                </Square>
            )
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>
      <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>

  )
}

export default App
