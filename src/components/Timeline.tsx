import React, { Suspense, useRef, useState } from "react";
import { Await, Link, useParams } from "react-router-dom";
import { clearCache, getRepo } from "../api/GithubApi";
import { GitCommit, GitRepo } from "../api/types";
import { CommitButtonProps, TimelineParams } from "../types";
import CommitButton from "./CommitButton";
import { MdCoffee, MdHistory } from "react-icons/md";
export default function Timeline() {
  const repoInfo = useParams() as TimelineParams;
  const [count, setCount] = useState(0);
  const timeline = useRef<HTMLDivElement>(null);
  const [repoData, setRepoData] = useState(getRepo(repoInfo));
  const [mouseOver, setMouseOver] = useState(false);

  function lerp(start: number, end: number, t: number) {
    return start * (1 - t) + end * t;
  }
  const frame = useRef(0);
  const target = useRef(0);
  const ease = 0.5;

  function animate() {
    frame.current = +lerp(frame.current, target.current, ease).toFixed(2);
    document.getElementById("timeline")?.scrollTo({ left: frame.current });
    requestAnimationFrame(animate);
  }

  /**
   * @deprecated
   */
  function toggleZoom(i: string) {
    if (!mouseOver) {
      setTimeout(() => {
        const timeline = document.getElementById("timeline");
        const el = document.getElementById(`${i}_commit`);
        if (el && timeline) {
          target.current = el.offsetLeft - window.innerWidth / 2 + el.getBoundingClientRect().width / 2;
        }
      }, 150);
    }
  }

  function scroll(e: React.WheelEvent<HTMLDivElement>) {
    if (target.current + e.deltaY >= 0 && target.current + e.deltaY < timeline.current!.scrollWidth - window.innerWidth / 2) {
      target.current = target.current + e.deltaY;
    }
  }

  function refreshRepo() {
    console.log("call");

    clearCache(repoInfo);
    setRepoData(getRepo(repoInfo));
  }

  function setupCommitList(data: GitRepo) {
    const commits = data.commits.map((v) => <CommitButton key={`${v.shortSha}_commit`} setMouse={setMouseOver} i={v}></CommitButton>);
    
    const grouped:  JSX.Element[]= [];
    const checkGroups = (i: number): JSX.Element[] => {
      if (!commits[i]) return grouped;
      const commitDate = new Date(commits[i].props.i.commit.author.date);
      const sameDate = [];
      for (let commit of commits.slice(i)) {
        if (new Date(commit.props.i.commit.author.date).toDateString() == commitDate.toDateString()) {
          sameDate.push(<div>{commit}</div>);
          i++;
        } else {
        i++;
        break;
        }
      }

      return [...grouped, <><div className="flex border-t-2 mx-5 py-2 border-white relative"><div className="absolute top-12 font-mono text-white text-lg">{commitDate.toLocaleDateString()}</div>{sameDate}</div></>, ...checkGroups(i)];
    }

    return checkGroups(0);
  }
  animate();
  return (
    <>
      <div className="flex w-screen items-center h-14">
        <button className="button m-3 !text-white" onClick={refreshRepo}>
          Refetch repo
        </button>
        <div className="grow text-center text-white font-mono text-2xl">
          Showing <span className="text-[#58a6ff]">{count}</span> commits
        </div>
        <Link to="/support">
          <button className="button m-3 !text-red-400">
            Support <MdCoffee className="inline"></MdCoffee>
          </button>
        </Link>
      </div>

      <div className="w-screen overflow-y-hidden mt-2" onWheel={scroll}>
        <div ref={timeline} id="timeline" className="flex overflow-x-scroll w-screen">
          <div className="p-20"></div>
          <Suspense fallback={<p className="mx-auto font-mono text-white text-xl">Loading information about repository...</p>}>
            <Await resolve={repoData} errorElement={<p>Error loading repo data!</p>}>
              {(data: GitRepo) => setupCommitList(data)}
            </Await>
          </Suspense>
          <div className="button whitespace-nowrap mx-20">
            Fetch Older Commits <MdHistory size={25} className="inline" />
          </div>
        </div>
        {/* <div className="absolute h-screen w-1 bg-black transform -translate-x-1/2"></div> */}
      </div>
    </>
  );
}
