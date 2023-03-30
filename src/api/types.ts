export interface GitRepo {
  name: string;
  owner: {
    login: string
  };
  commits: GitCommit[];
  cacheDate: number;
}

export interface GitCommit {
  html_url: string;
  shortSha: string;
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    }
  }
}

export interface TimeClosure {
  new: boolean;
  old: boolean;
  page: number;
}

export type TimelineParams = {repoOwner: string, repoName: string}