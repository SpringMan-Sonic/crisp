import { useState } from 'react'
import { Button } from './components/ui/button'
import Header from './components/dashboard/header'
import MainContent from './components/dashboard/maincontent'
import { Toaster } from 'sonner'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className='w-full h-full '>
        <Header/>


         <MainContent/>

         <Toaster richColors={true}/> 
     </div>
    </>
  )
}

export default App
