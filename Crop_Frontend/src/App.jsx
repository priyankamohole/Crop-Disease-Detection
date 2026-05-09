import React from 'react'
import Hero from './Components/Hero/Hero'
import DetectScreen from './Components/DetectScreen/DetectScreen'
import MainScreen from './Components/DetectScreen/MainScreen/MainScreen'
import { Routes,Route } from 'react-router-dom'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Hero/>}/>
        <Route path="/detect" element={<DetectScreen/>}/>
      </Routes>
    </div>
  )
}

export default App