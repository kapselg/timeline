import axios from "axios";
import { TimelineParams } from "../types.js";
import { GitCommit, GitRepo } from "./types.js";

const expirationTime = 7200000;
const makeCacheName = ({ repoOwner, repoName }: TimelineParams) => `cached-${repoOwner}-${repoName}`;

/**
 * 
 * @param owner Repo owner
 * @param repoName Repo name
 * @returns Commits to a GitHub repo
 */
export async function fetchCommits({ repoOwner, repoName, page }: TimelineParams & {page: number}) {
  
  const response = await axios<GitCommit[]>(`https://api.github.com/repos/${repoOwner}/${repoName}/commits`, {
params: {
per_page: 50, page}});
  return response.data.map((val) => {
    val.shortSha = val.sha.substring(0, 7);
    return val;
  });
}

/**
 * @param owner Repo owner  
 * @param repoName Repo name 
 * @returns Cached or renewed repo data
 */
export async function getRepo({ repoOwner, repoName }: TimelineParams) {
  const cached = localStorage.getItem(makeCacheName({ repoOwner, repoName }));

  if (cached) {
    const cachedRepoData = JSON.parse(cached) as GitRepo;
   
    if (new Date().getTime() - cachedRepoData.cacheDate < expirationTime) {
      console.log('get cached');
      
      return cachedRepoData;
    }
    
  }
  return initRepo({ repoOwner, repoName });
}

/**
 * @param owner Repo owner
 * @param repoName Repo name
 * @returns Information about GitHub repo from API
 */
export async function initRepo({ repoOwner, repoName }: TimelineParams) {
  const response = await axios<GitRepo>(`https://api.github.com/repos/${repoOwner}/${repoName}`);
  const data = response.data;
  data.commits = await fetchCommits({ repoOwner, repoName });
  data.cacheDate = new Date().getTime();
  data.onPage = 0;

  localStorage.setItem(makeCacheName({ repoOwner, repoName }), JSON.stringify(data));

  return data;
}

export function clearCache({ repoOwner, repoName }: TimelineParams){
  localStorage.removeItem(makeCacheName({ repoOwner, repoName }));
}

// export async function fetchGitRepo(author: string, name: string) {
//   const res = await axios<GitRepo>(`https://api.github.com/repos/${author}/${name}`);
//   const res_1 = res.data;
//   return ({ ...res_1, commits: axios<GitCommit[]>(`https://api.github.com/repos/${author}/${name}`).then((res_2) => res_2.data) });
// }
