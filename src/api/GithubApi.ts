import axios from "axios";
import { GitCommit, GitRepo } from "./types.js";

const expirationTime = 7200000;
const makeCacheName = (owner: string, repoName: string) => `cached-${owner}-${repoName}`;

/**
 * 
 * @param owner Repo owner
 * @param repoName Repo name
 * @returns Commits to a GitHub repo
 */
export async function fetchCommits(owner: string, repoName: string) {
  const response = await axios<GitCommit[]>(`https://api.github.com/repos/${owner}/${repoName}/commits`);
  return response.data.map((val) => {
    val.shortSha = val.sha.substring(0, 6);
    return val;
  });
}

/**
 * @param owner Repo owner  
 * @param repoName Repo name 
 * @returns Cached or renewed repo data
 */
export async function getRepo(owner: string, repoName: string) {
  const cached = localStorage.getItem(makeCacheName(owner, repoName));

  if (cached) {
    const cachedRepoData = JSON.parse(cached) as GitRepo;
   
    if (new Date().getTime() - cachedRepoData.cacheDate < expirationTime) {

      console.log('date ok');
      
      return cachedRepoData;
    }
    
  }
  return fetchRepo(owner, repoName);
}

/**
 * @param owner Repo owner
 * @param repoName Repo name
 * @returns Information about GitHub repo from API
 */
export async function fetchRepo(owner: string, repoName: string) {
  const response = await axios<GitRepo>(`https://api.github.com/repos/${owner}/${repoName}`);
  const data = response.data;
  data.commits = await fetchCommits(owner, repoName);
  data.cacheDate = new Date().getTime();

  localStorage.setItem(makeCacheName(owner, repoName), JSON.stringify(data));

  return data;
}

export function clearCache(owner: string, repoName: string){
  localStorage.removeItem(makeCacheName(owner, repoName));
}

// export async function fetchGitRepo(author: string, name: string) {
//   const res = await axios<GitRepo>(`https://api.github.com/repos/${author}/${name}`);
//   const res_1 = res.data;
//   return ({ ...res_1, commits: axios<GitCommit[]>(`https://api.github.com/repos/${author}/${name}`).then((res_2) => res_2.data) });
// }
