import React, { Fragment, useEffect, useRef, useState } from "react";
import { IoMdFastforward, IoMdRewind } from "react-icons/io";
import { GitCommit, GitRepo, TimeClosure } from "../../api/types";
import CommitButton from "./CommitButton";
import CommitDescription from "./CommitDescription";

export default function CommitButtonList(props: { repo: GitRepo; bounds: TimeClosure; setCount: React.Dispatch<React.SetStateAction<number>>; forwardInTime: (s: Date, u: Date) => void; backInTime: () => void }) {
  const timeline = useRef<HTMLDivElement>(null);
  const [focusedCommit, setFocusedCommit] = useState<GitCommit | null>(null);
  const [commitList, setCommitList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    props.repo.commits.sort((prev, next) => new Date(prev.commit.author.date).valueOf() - new Date(next.commit.author.date).valueOf());
    setCommitList(setupCommitList(props.repo));
  }, [props.repo]);

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
        </div>,
        ...checkGroups(i),
      ];
    };

    return checkGroups(0);
  }

  function scroll(e: React.WheelEvent<HTMLDivElement>) {
    e.currentTarget.scrollBy({
      left: e.deltaY * (e.altKey || e.shiftKey ? e.currentTarget.scrollWidth / window.innerWidth / 2 : 1),
    });
  }

  function forwardWeeks(weeks: number) {
    const firstCommitDate = new Date(props.repo.commits[0].commit.author.date);
    props.forwardInTime(new Date(new Date(firstCommitDate).valueOf() + 86400000), new Date(firstCommitDate.valueOf() + 60480000 * weeks));
  }

  function backwardsPage() {
    props.backInTime()
  }

  function empty() {}
  return (
    <div className="grow flex flex-col h-[85vh]">
      <div className="md:p-2"></div>
      <div ref={timeline} id="timeline" className={`flex overflow-x-hidden md:overflow-x-scroll md:overflow-y-hidden w-full ${focusedCommit ? "hidden md:flex" : ""}`} onWheel={(e) => (window.innerWidth > 768 ? scroll(e) : empty())}>
        <div className="flex flex-col md:flex md:flex-row w-8/12 mx-auto md:mx-0">
          <div className="flex-col mt-2 gap-1"  style={{ display: props.bounds.new ? "flex" : "none" }} >
            <div className="button whitespace-nowrap text-lg flex items-center justify-between" onClick={() => forwardWeeks(1)}>
              Forward one week <IoMdRewind size={25} className="inline-block -mt-1 ml-2" />
            </div>
            <div className="button whitespace-nowrap text-lg flex items-center justify-between" onClick={() => forwardWeeks(2)}>
              Forward one month <IoMdRewind size={25} className="inline-block -mt-1 ml-2" />
            </div>
          </div>
          {commitList}
          <div className="button whitespace-nowrap text-lg mt-10" onClick={backwardsPage} style={{ visibility: props.bounds.old ? "visible" : "hidden" }}>
            Fetch Older Commits <IoMdFastforward size={25} className="inline-block -mt-1" />
          </div>
        </div>
      </div>
      <div className="p-4"></div>
      <CommitDescription i={focusedCommit} setFocus={setFocusedCommit}></CommitDescription>
      <div className="p-4"></div>
    </div>
  );
}
