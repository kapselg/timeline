import { Suspense, useEffect, useMemo, useState } from "react";
import { Await, useParams } from "react-router-dom";
import * as GithubApi from "../../api/GithubApi";
import { GitRepo, TimeClosure, TimelineParams } from "../../api/types";
import CommitButtonList from "./CommitButtonList";
import TimeForm from "./TimeForm";

export default function Timeline() {
  const repoInfo = useParams() as TimelineParams;
  const [bounds, setBounds] = useState<TimeClosure>({ new: true, old: true, page: 0 });
  const [repoData, setRepoData] = useState(GithubApi.getCachedRepo(repoInfo));
  const [count, setCount] = useState<number>(0);
  const [fromDate, setFromDate] = useState(false);

  async function refreshRepo() {
    GithubApi.clearCache(repoInfo);
    setCount(0);
    setBounds({new: true, old: true, page: 0})
    setRepoData(GithubApi.initRepo(repoInfo));
  }

  async function jumpDate(toDate: Date) {}

  async function backInTime() {
    bounds.page++;
    const newCommits = await GithubApi.fetchCommits({
      ...repoInfo,
      page: bounds.page,
      until: new Date((await repoData).commits[0].commit.author.date) || new Date(),
    });

    if (newCommits.length === 0) {
      setBounds({
        ...bounds,
        old: false,
      });
      return;
    }

    setRepoData(
      new Promise(async (res, rej) => {
        const repo = await repoData;
        res({
          ...repo,
          commits: [...repo.commits, ...newCommits],
        });
      })
    );
  }

  async function forwardInTime(since: Date, until: Date) {
    const newCommits = await GithubApi.fetchCommits({
      ...repoInfo,
      since,
      until,
    });

    if (newCommits.length === 0) {
      console.log('wtf');
      
      setBounds({
        ...bounds,
        new: false,
      });
      return;
    }
  }

  useEffect(() => {
    setBounds({ ...bounds, page: Math.ceil(count / 50) });
  }, [count]);

  useMemo(async () => {
    setCount((await repoData).commits.length);
  }, [repoData]);
  
  return (
    <div className="h-screen flex flex-col">
      <TimeForm show={fromDate} setShow={setFromDate} jumpDate={jumpDate}></TimeForm>
      <div className="text-center text-white font-mono text-2xl xl:-mt-10 md:pt-16 sm:mt-0 relative flex flex-wrap w-full justify-around md:justify-between align-baseline">
        <div className="md:order-2">
          Showing&nbsp;
          <span className="text-[#58a6ff]">
            <Suspense fallback={<p className="mx-auto font-mono text-white text-xl">...</p>}>
              <Await resolve={repoData}>{(data: GitRepo) => count || data.commits.length}</Await>
            </Suspense>
          </span>
          &nbsp;commits from&nbsp;
          <a className="text-[#58a6ff]" href={`https://github.com/${repoInfo.repoOwner}/${repoInfo.repoName}`} target="_blank">
            {repoInfo.repoOwner}/{repoInfo.repoName}
          </a>
        </div>
        <button className="button mx-3 text-lg order-1 my-2 md:my-0" onClick={() => refreshRepo()}>
          Refetch repo
        </button>

        <button className="button mx-3 text-lg  md:order-3 my-2 md:my-0" onClick={() => setFromDate(true)}>
          Fetch from date
        </button>
      </div>

      <Suspense fallback={<p className="mx-auto font-mono text-white text-xl">Loading information about repository...</p>}>
        <Await resolve={repoData} errorElement={<p>Error loading repo data!</p>}>
          {(data: GitRepo) => <CommitButtonList bounds={bounds} backInTime={backInTime} forwardInTime={forwardInTime} setCount={setCount} repo={data}></CommitButtonList>}
        </Await>
      </Suspense>
    </div>
  );
}
