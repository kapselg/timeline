import { createBrowserRouter, defer } from 'react-router-dom'
import { Home } from '../components/Home'
import { getRepo } from '../api/GithubApi'

async function repoLoader(){
  const repo = await getRepo('kapselg', 'dzialki')
  return defer({repo})
}

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  }
])