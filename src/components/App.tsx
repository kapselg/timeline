import React, { Suspense, useRef, useState } from "react";
import { Await, Link, useParams } from "react-router-dom";
import { clearCache, getNextPage, getRepo } from "../api/GithubApi";
import { GitCommit, GitRepo } from "../api/types";
import { CommitButtonProps, TimelineParams } from "../types";
import CommitButton from "./CommitButton";
import { MdCoffee, MdHistory } from "react-icons/md";
import Timeline from "./Timeline";
export default function App() {
  const repoInfo = useParams() as TimelineParams;
  const [count, setCount] = useState(0);
  const refresh = useRef(0);
  // /**
  //  * @deprecated
  //  */
  // function toggleZoom(i: string) {
  //   if (!mouseOver) {
  //     setTimeout(() => {
  //       const timeline = document.getElementById("timeline");
  //       const el = document.getElementById(`${i}_commit`);
  //       if (el && timeline) {
  //         target.current = el.offsetLeft - window.innerWidth / 2 + el.getBoundingClientRect().width / 2;
  //       }
  //     }, 150);
  //   }
  // }

  return (
    <>
      <div className="absolute top-10">
        <Timeline repoName={repoInfo.repoName} repoOwner={repoInfo.repoOwner} setCount={setCount} refresh={refresh} ></Timeline>
      </div>
      <div className="flex w-scree items-baseline h-14">
        <button className="button whitespace-nowrap m-3 mt-2 text-lg" onClick={() => refresh.current++}>
          Refetch repo
        </button>
        <div className="grow text-center text-white font-mono text-2xl">
          Showing <span className="text-[#58a6ff]">{count}</span> commits from{" "}
          <a className="text-[#58a6ff]" href={`https://github.com/${repoInfo.repoOwner}/${repoInfo.repoName}`} target="_blank">
            {repoInfo.repoOwner}/{repoInfo.repoName}
          </a>
        </div>
        <Link to="/support">
          <button className="button m-3 !text-red-400">
            Support <MdCoffee className="inline"></MdCoffee>
          </button>
        </Link>
      </div>

    </>
  );
}
