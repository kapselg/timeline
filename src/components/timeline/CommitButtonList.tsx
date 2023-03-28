import { data } from "autoprefixer";
import React, { Fragment, MutableRefObject, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { MdHistory } from "react-icons/md";
import { Await, useFetcher } from "react-router-dom";
import { clearCache, getNextPage, initRepo } from "../../api/GithubApi";
import { GitCommit, GitRepo } from "../../api/types";
import CommitButton from "./CommitButton";
import CommitDescription from "./CommitDescription";

export default function CommitButtonList(props: { repo: GitRepo, setCount: React.Dispatch<React.SetStateAction<number>> }) {
  const timeline = useRef<HTMLDivElement>(null);
  const [focusedCommit, setFocusedCommit] = useState<GitCommit | null>(null);
  const [commitList, setCommitList] = useState<JSX.Element[]>([])


  async function nextPage() {
    const result = await getNextPage({ ...props, repoName: props.repo.name, repoOwner: props.repo.owner.login })
    setCommitList(setupCommitList(result))
    setTimeout(() => {
      props.setCount(result.commits.length)
    }, 100);
  }

  useEffect(() => {
    setCommitList(setupCommitList(props.repo))
  }, [])

  function setupCommitList(data: GitRepo) {
    const commits = data.commits.map((v) => <CommitButton key={`${v.shortSha}_commit`} setFocus={setFocusedCommit} i={v}></CommitButton>);

    const grouped: JSX.Element[] = [];
    const checkGroups = (i: number): JSX.Element[] => {

      if (!commits[i]) return grouped;
      const commitDate = new Date(commits[i].props.i.commit.author.date);
      const sameDate = [];
      for (let commit of commits.slice(i)) {
        if (new Date(commit.props.i.commit.author.date).toDateString() !== commitDate.toDateString()) {
          break;
        }
        sameDate.push(<Fragment key={commitDate.toString() + "_" + i}>{commit}</Fragment>);
        i++;
      } 

      return [
        ...grouped,
        <div className="relative md:mx-8 w-full md:w-auto" key={commitDate.toLocaleDateString()}>
          <span className="text-white font-mono">{commitDate.toLocaleDateString()}</span>
          <div className="flex md:flex md:flex-row flex-col border-l-2 border-t-2 py-2 border-white" key={commitDate.toString()}>
            {sameDate}
          </div>
        </div>
        ,
        ...checkGroups(i),
      ];
    };

    return checkGroups(0);
  }

  function scroll(e: React.WheelEvent<HTMLDivElement>) {
    e.currentTarget.scrollBy({
      left: e.deltaY * (e.altKey ? e.currentTarget.scrollWidth / window.innerWidth / 2 : 1),
    })
  }

  function empty() { }
  return (
    <div className="grow flex flex-col h-[85vh]">
      <div className="md:p-2"></div>
      <div ref={timeline} id="timeline" className={`flex overflow-x-hidden md:overflow-x-scroll md:overflow-y-hidden w-full ${focusedCommit ? 'hidden md:flex' : ''}`} onWheel={(e) => window.innerWidth > 768 ? scroll(e) : empty()}>

        <div className="flex flex-col md:flex md:flex-row w-8/12 mx-auto">
          {commitList}
          <div className="button whitespace-nowrap text-lg mt-10" onClick={nextPage}>
            Fetch Older Commits <MdHistory size={25} className="inline-block -mt-1" />
          </div>
        </div>
      </div>
      <div className="p-4"></div>
      <CommitDescription i={focusedCommit} setFocus={setFocusedCommit} ></CommitDescription>
      <div className="p-4"></div>
    </div>
  );
}
