export interface GitRepo {
  name: string;
  author: string;
  commits: GitCommit[];
  cacheDate: number;
}

export interface GitCommit {
  url: string;
  shortSha: string;
  sha: string;
}