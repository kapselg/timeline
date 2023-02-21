import { createBrowserRouter, Link } from 'react-router-dom'
import { App } from '../components/App'
import Timeline from '../components/timeline/Timeline'

export const routes = createBrowserRouter([
  {
    path: '*',
    element: <App/>,
    children: [
      {
        path: ':repoOwner/:repoName',
        element: <Timeline/>,
      },
      {
        path: '*',
        element: <Link to="/haskell/random" className='button absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/4'>Go to example repo</Link>
      }
    ]
  }
])