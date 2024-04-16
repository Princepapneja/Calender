import { useState } from 'react'

import './App.css'
import MyCalendar from './calender'
import ContextProvider from './components/contexts/ContextProvider'

function App() {

  return (
    <>
      <ContextProvider>
        <MyCalendar />
      </ContextProvider>
    </>
  )
}

export default App
