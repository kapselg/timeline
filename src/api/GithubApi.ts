import axios from "axios";
import { GitCommit, GitRepo, TimelineParams } from "./types.js";

const expirationTime = 7200000;
const makeCacheName = ({ repoOwner, repoName }: TimelineParams) =>
  `cached-${repoOwner}-${repoName}`;

/**
 *
 * @param owner Repo owner
 * @param repoName Repo name
 * @returns Commits to a GitHub repo
 */
export async function fetchCommits({
  repoOwner,
  repoName,
  page,
}: TimelineParams & { page: number }) {
  console.log('fetching commits');
  const response = await axios<GitCommit[]>(
    `https://api.github.com/repos/${repoOwner}/${repoName}/commits`,
    {
      params: {
        per_page: 50,
        page,
      },
    }
  );
  
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
export async function getCachedRepo({ repoOwner, repoName }: TimelineParams) {
  const cached = localStorage.getItem(makeCacheName({ repoOwner, repoName }));

  if (cached) {
    const cachedRepoData = JSON.parse(cached) as GitRepo;

    if (new Date().getTime() - cachedRepoData.cacheDate < expirationTime) {      
      return cachedRepoData;
    }
    
  }
  console.log('new');
  
  return initRepo({ repoOwner, repoName });
}

/**
 * @param owner Repo owner
 * @param repoName Repo name
 * @returns Information about GitHub repo from API
 */
export async function initRepo({ repoOwner, repoName }: TimelineParams) {
  console.log('fetching repo');
  const response = await axios<GitRepo>(
    `https://api.github.com/repos/${repoOwner}/${repoName}`
  );
  
  const data = response.data;
  data.commits = await fetchCommits({ repoOwner, repoName, page: 1 });
  data.cacheDate = new Date().getTime();
  data.onPage = 1;

  cacheRepo({ repo: data, repoName, repoOwner });

  return data;
}

export async function getNextPage({
  repoOwner,
  repoName,
  repo,
}: TimelineParams & { repo: GitRepo }) {
    const response = await fetchCommits({
    repoOwner,
    repoName,
    page: repo.onPage + 1,
  });
  repo.commits = [...repo.commits, ...response];
  repo.onPage++;

  cacheRepo({ repo, repoName, repoOwner });

  return repo;
}

export function cacheRepo({
  repoOwner,
  repoName,
  repo,
}: TimelineParams & { repo: GitRepo }) {
  //TODO: reduce cache size by picking only used props

  localStorage.setItem(
    makeCacheName({ repoOwner, repoName }),
    JSON.stringify(repo)
  );
}

export function clearCache({ repoOwner, repoName }: TimelineParams) {
  localStorage.removeItem(makeCacheName({ repoOwner, repoName }));
}

// export async function fetchGitRepo(author: string, name: string) {
//   const res = await axios<GitRepo>(`https://api.github.com/repos/${author}/${name}`);
//   const res_1 = res.data;
//   return ({ ...res_1, commits: axios<GitCommit[]>(`https://api.github.com/repos/${author}/${name}`).then((res_2) => res_2.data) });
// }
