import { createBrowserRouter } from 'react-router-dom'
import { App } from '../App'
import Home from '../components/Home'
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
        element: <Home/>
      }
    ]
  }
], {
  basename: '/timeline'
})