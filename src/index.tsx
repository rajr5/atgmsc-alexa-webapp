import React from 'react'
import ReactDOM from 'react-dom'
import { Atgism } from './components/Atgism';

const App = () => {
  return (
    <div>
      <Atgism></Atgism>
    </div>
  )
}


ReactDOM.render(<App />, document.getElementById('app'));