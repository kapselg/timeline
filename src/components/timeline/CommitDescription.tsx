import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MdClose, MdCopyAll } from 'react-icons/md';
import { GitCommit } from '../../api/types';

export default function CommitDescription({ i, setFocus }: { i: GitCommit | null, setFocus:Dispatch<SetStateAction<GitCommit | null>>}) {
  console.log('rendering');

  if (!i) return <button className='button md:mt-32'>
    Click on a commit SHA to show it's description
  </button>;
  console.log('all good');

  const [clipboard, setClipboard] = useState(false);
  const commitDate = new Date(i!.commit.author.date);

  function copy(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    setClipboard(true);
    navigator.clipboard.writeText(i!.html_url);
    setTimeout(() => {
      setClipboard(false);
    }, 1500);
  }


  return (
    <div className="text-black md:mt-16 transition-opacity opacity-100 cursor-default duration-200 delay-75 max-w-xl relative">
      <button className='button !absolute right-0 aspect-square top-0 p-5 m-1' onClick={()=>setFocus(null)} >
        <MdClose className='text-red-600' size={25}></MdClose>
      </button>
      <ul className="bg-gh-bg text-white border-gh-border rounded-xl p-3 [&>li]:mb-2">
        <li><span className="text-[#58a6ff]">Date:</span> <br /> {commitDate.toLocaleDateString()} at {commitDate.toLocaleTimeString()}</li>
        <li><span className="text-[#58a6ff]">SHA:</span> <br /> {i!.sha}</li>
        <li><span className="text-[#58a6ff]">Message:</span> <br /><p onWheel={(e) => e.stopPropagation()} className="max-h-[20vh] md:max-h-[30vh] !overflow-y-scroll text-justify">{i!.commit.message}</p> </li>

        <li>
          <span className="text-[#58a6ff]">URL:</span> <br />
          <div className="button my-2" onClick={copy}>
            <span className="pointer-events-none m-1 text-sm break-all">{clipboard ? <MdCopyAll className="mx-auto h-auto -my-3" size={25}></MdCopyAll> : i!.html_url}</span>
          </div>
        </li>
      </ul>
    </div>
  )
}
