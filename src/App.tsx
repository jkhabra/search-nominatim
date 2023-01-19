import { useEffect, useState } from 'react';
import './App.css'

const url = 'https://nominatim.openstreetmap.org/search?'
const fetchLocation = async (p:{query:string}) => {
  try {
    const res = await fetch(`${url}q=${p.query}&format=json&extratags=1`)
    const data = await res.json();
    console.log('----da', data);
  }catch(err){
    console.log('--err--',err)
  }
}

function App() {
  const [searchQuery, setSearchQuery] = useState<string>('Boston MA');

  useEffect(() => {
    (async () => {
      await fetchLocation({query: searchQuery})
    })()
  },[])

  const findResult = async () => {
    await fetchLocation({query: searchQuery})
  }

  return (
    <div className="App">
      <input onChange={(e) => setSearchQuery(e.target.value)} />
      <button onClick={findResult}>Search</button>
     hello
    </div>
  )
}

export default App
