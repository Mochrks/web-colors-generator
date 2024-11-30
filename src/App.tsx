
import './App.css'
import ColorGenerator from './components/demo/ColorGeneration'
import { Footer } from './components/demo/Footer'
import { Navbar } from './components/demo/Navbar'


function App() {


  return (
    <div className='w-full h-full'>
      <Navbar />
      <main className='py-20'>
        <ColorGenerator />
      </main>
      <Footer />
    </div>
  )
}

export default App
