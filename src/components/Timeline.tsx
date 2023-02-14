import React, { Suspense, useRef, useState } from "react";
import { clearCache, getRepo } from "../api/GithubApi";
import CommitButton from "./CommitButton";
import { Await, useLoaderData, useRevalidator } from "react-router-dom";
import { GitRepo } from "../api/types";

export default function Timeline() {
  const stops = new Array(100).fill("|");
  const timeline = useRef<HTMLDivElement>(null);
  const [repoData, setRepoData] = useState(getRepo("kapselg", "dzialki"));
  //calculate default margin
  const defaultMargin = (window.innerWidth - stops.length) / stops.length / 2;
  const [margin, setMargin] = useState(defaultMargin);

  function toggleZoom(i: string) {
    setTimeout(() => {
      const timeline = document.getElementById("timeline");
      const el = document.getElementById(`${i}_commit`);
      if (el && timeline) {
        let scrollAmount = el.offsetLeft - window.innerWidth / 2 + el.getBoundingClientRect().width;

        timeline.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
        console.log("scrolled to " + scrollAmount);
      }
    }, 150);
  }

  function refreshRepo() {
    clearCache("kapselg", "dzialki");
    setRepoData(getRepo("kapselg", "dzialki"));
  }

  return (
    <>
      <button onClick={refreshRepo}>Refetch repo</button>
      <div className="grid place-items-center w-screen h-screen overflow-y-hidden">
        <div ref={timeline} id="timeline" className="flex overflow-x-scroll w-screen">
          <div className="pl-[50vw]"></div>

          <Suspense fallback={<p>Loading repo information...</p>}>
            <Await resolve={repoData} errorElement={<p>Error loading repo data!</p>}>
              {(data: GitRepo) => {
                return data.commits.map((v) => <CommitButton onClick={() => toggleZoom(v.shortSha)} margin={margin} i={v}></CommitButton>);
              }}
            </Await>
          </Suspense>

          <div className="pl-[50vw]"></div>
        </div>
        {/* <div className="absolute h-screen w-1 bg-black transform -translate-x-1/2"></div> */}
      </div>
    </>
  );
}
