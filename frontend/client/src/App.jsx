import React from 'react'
import Hiro from './components/Hiro.jsx'
import About from './components/About.jsx'
import NavBar from './components/NavBar.jsx'



const App = () => {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-zinc-700">
      <NavBar />
      <Hiro />
      <About />

    </main>
  )
}

export default App