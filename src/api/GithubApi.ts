import axios, { AxiosResponse } from "axios";
import { MdRateReview } from "react-icons/md";
import { GitCommit, GitRepo, TimelineParams } from "./types.js";
import * as WarningModal from "../components/WarningModal.js";

const pageSize = 50;
const expirationTime = 7200000;
let resetAt = new Date();
const makeCacheName = ({ repoOwner, repoName }: TimelineParams) => `cached-${repoOwner}-${repoName}`;

export async function apiQuotaAvailable(){
  const {used, limit, reset} = (await axios.get<{rate: {used: number, limit: number, reset: number}}>('https://api.github.com/rate_limit')).data.rate  
  if (used === limit){
    const date = new Date(0);
    date.setUTCSeconds(reset);
    WarningModal.setModal(WarningModal.PremadeModals.RATE_LIMIT(date))
    resetAt = date;
    throw new Error('API_QUOTA_EXCEEDED');
  }
}

export function sortAndCheck(data: GitCommit[]){
  const uniqueSha = new Set(data.map(c => c.sha))
  data = data.filter(c=> {
    if(uniqueSha.has(c.sha)){
      uniqueSha.delete(c.sha)
      return c
    }
  })
  data.sort((prev, next) => new Date(prev.commit.author.date).valueOf() - new Date(next.commit.author.date).valueOf())
  return data
}

/**
 *
 * @param owner Repo owner
 * @param repoName Repo name
 * @returns Commits from a GitHub repo
 */
export async function fetchCommits({ repoOwner, repoName, page, until, since }: TimelineParams & { until?: Date, since?: Date, page?: number }) {
  await apiQuotaAvailable();
  console.log('fetching');
  
  const response = await axios<GitCommit[]>(`https://api.github.com/repos/${repoOwner}/${repoName}/commits`, {
    params: {
      per_page: pageSize,
      page,
      since,
      until,
    },
  });

  const commits = response.data.map((val) => {
    val.shortSha = val.sha.substring(0, 7);
    return val;
  });

  return commits;
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

  return initRepo({ repoOwner, repoName });
}

/**
 * @param owner Repo owner
 * @param repoName Repo name
 * @returns Information about GitHub repo from API
 */
export async function initRepo({ repoOwner, repoName }: TimelineParams) {
  await apiQuotaAvailable();
  const response = await axios<GitRepo>(`https://api.github.com/repos/${repoOwner}/${repoName}`);
  console.log('fetching');
  const data = response.data;
  data.commits = await fetchCommits({ repoOwner, repoName, page: 1 });
  data.cacheDate = new Date().getTime();

  cacheRepo({ repo: data, repoName, repoOwner });


  return data;
}

export function cacheRepo({ repoOwner, repoName, repo }: TimelineParams & { repo: GitRepo }) {
  //TODO: reduce cache size by picking only used props

  const converted = {
    owner: { login: repo.owner.login },
    cacheDate: repo.cacheDate,
    commits: repo.commits.map((commit) => ({
      commit: {
        author: {
          date: commit.commit.author.date,
          name: commit.commit.author.date,
        },
        message: commit.commit.message,
      },
      html_url: commit.html_url,
      sha: commit.sha,
      shortSha: commit.shortSha
    } as GitCommit)),
    name: repo.name,
  } as GitRepo;


  localStorage.setItem(makeCacheName({ repoOwner, repoName }), JSON.stringify(converted));
}

export function clearCache({ repoOwner, repoName }: TimelineParams) {
  localStorage.removeItem(makeCacheName({ repoOwner, repoName }));
}

export function handleApiRateLimitError(e: any){
  if(e && e.message && e.message === 'API_QUOTA_EXCEEDED'){
    WarningModal.setModal(WarningModal.PremadeModals.RATE_LIMIT(resetAt));
  }
}
// export async function fetchGitRepo(author: string, name: string) {
//   const res = await axios<GitRepo>(`https://api.github.com/repos/${author}/${name}`);
//   const res_1 = res.data;
//   return ({ ...res_1, commits: axios<GitCommit[]>(`https://api.github.com/repos/${author}/${name}`).then((res_2) => res_2.data) });
// }

