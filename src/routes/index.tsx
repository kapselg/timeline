import { createBrowserRouter, Link } from 'react-router-dom'
import { Home } from '../components/Home'
import App from '../components/App'

export const routes = createBrowserRouter([
  {
    path: '*',
    element: <Home/>,
    children: [
      {
        path: ':repoOwner/:repoName',
        element: <App/>,
      },
      {
        path: '*',
        element: <Link to="/haskell/random" className='button absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/4'>Go to example repo</Link>
      }
    ]
  }
])