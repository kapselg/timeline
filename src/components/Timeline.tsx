import React, { MutableRefObject, Suspense, useEffect, useRef, useState } from "react";
import { MdHistory } from "react-icons/md";
import { Await } from "react-router-dom";
import { clearCache, getNextPage, getRepo, initRepo } from "../api/GithubApi";
import { GitRepo } from "../api/types";
import { TimelineParams } from "../types";
import CommitButton from "./CommitButton";

export default function Timeline(props: TimelineParams & { setCount: React.Dispatch<React.SetStateAction<number>>; refresh: MutableRefObject<number>}) {
  const timeline = useRef<HTMLDivElement>(null);

  const [repoData, setRepoData] = useState(getRepo(props));
  const [mouseOver, setMouseOver] = useState(false);
  function nextPage() {
    setRepoData(getNextPage({ ...props, $repo: repoData }));
  }

  function setupCommitList(data: GitRepo) {
    const commits = data.commits.map((v) => <CommitButton key={`${v.shortSha}_commit`} setMouse={setMouseOver} i={v}></CommitButton>);

    const grouped: JSX.Element[] = [];
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

      return [
        ...grouped,
        <>
          <div className="flex border-t-2 mx-8 py-2 border-white relative">
            <div className="absolute top-12 font-mono text-white text-lg cursor-default">{commitDate.toLocaleDateString()}</div>
            {sameDate}
          </div>
        </>,
        ...checkGroups(i),
      ];
    };
    props.setCount(commits.length);
    return checkGroups(0);
  }

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

  function scroll(e: React.WheelEvent<HTMLDivElement>) {
    if (target.current + e.deltaY >= 0 && target.current + e.deltaY < timeline.current!.scrollWidth - window.innerWidth / 2) {
      target.current = target.current + e.deltaY;
    }
  }

  function refresh() {
    console.log('fresz');
    
    clearCache(props);
    setRepoData(initRepo(props));
  }

  useEffect(() => {
    refresh()
  }, [props.refresh.current])

  animate();
  return (
    <>
      <div className="w-screen h-12"></div>
      <div ref={timeline} id="timeline" className="flex overflow-x-scroll w-screen" onWheel={scroll}>
        <div className="p-24"></div>
        <Suspense fallback={<p className="mx-auto font-mono text-white text-xl">Loading information about repository...</p>}>
          <Await resolve={repoData} errorElement={<p>Error loading repo data!</p>}>
            {(data: GitRepo) => setupCommitList(data)}
          </Await>
        </Suspense>
        <div className="button whitespace-nowrap mx-20 mt-2 text-lg" onClick={nextPage}>
          Fetch Older Commits <MdHistory size={25} className="inline-block -mt-1" />
        </div>
      </div>
    </>
  );
}
