import { GitCommit } from "./api/types";

export type TimelineParams = {repoOwner: string, repoName: string}

export type CommitButtonProps = { i: GitCommit; setMouse: (v: boolean) => any };