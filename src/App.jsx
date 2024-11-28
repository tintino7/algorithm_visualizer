import Grid from './Components/Path_Finding/Grid.jsx'
import SortingPallet from './Components/Sorting/SortingPallet.jsx'
import Home from './Components/Home.jsx'

import {createBrowserRouter, RouterProvider, BrowserRouter} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path : '/',
    element : <Home/>
  },
  {
    path : 'sorting',
    element : <SortingPallet/>
  },
  {
    path : 'pathfinding',
    element : <Grid/>
  }

],

)

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
