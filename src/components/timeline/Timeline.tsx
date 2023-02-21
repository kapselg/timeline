import { Suspense, useRef, useState } from "react";
import { MdCoffee } from "react-icons/md";
import { Await, Link, useParams } from "react-router-dom";
import CommitButtonList from "./CommitButtonList";
import * as GithubApi from "../../api/GithubApi";
import { GitRepo, TimelineParams } from "../../api/types";
export default function Timeline() {
  const repoInfo = useParams() as TimelineParams;

  const repoData = GithubApi.getCachedRepo(repoInfo);
  const count = useRef(0);
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

  function refreshRepo() {
    GithubApi.clearCache(repoInfo);
    GithubApi.initRepo(repoInfo);
  }

  return (
    <>
      <div className="absolute top-10">
        <Suspense fallback={<p className="mx-auto font-mono text-white text-xl">Loading information about repository...</p>}>
          <Await resolve={repoData} errorElement={<p>Error loading repo data!</p>}>
            {(data: GitRepo) => <CommitButtonList repo={data}></CommitButtonList>}
          </Await>
        </Suspense>
      </div>
      <div className="flex w-scree items-baseline h-14">
        <button className="button whitespace-nowrap m-3 mt-2 text-lg" onClick={() => refreshRepo()}>
          Refetch repo
        </button>
        <button className="button whitespace-nowrap m-3 mt-2 text-lg">Fetch from date</button>
        <div className="grow text-center text-white font-mono text-2xl">
          Showing{" "}
          <span className="text-[#58a6ff]">
            <Suspense fallback={<p className="mx-auto font-mono text-white text-xl">...</p>}>
              <Await resolve={repoData}>{(data: GitRepo) => data.commits.length}</Await>
            </Suspense>
          </span>{" "}
          commits from{" "}
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
