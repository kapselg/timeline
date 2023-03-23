import React, { useEffect, useState } from 'react';
import { MdCopyAll } from 'react-icons/md';
import { GitCommit } from '../../api/types';

export default function CommitDescription(props: {i: GitCommit, setMouse: (v: boolean) => any, elRef: any }) {

  const [clipboard, setClipboard] = useState(false);
  const commitDate = new Date(props.i.commit.author.date);

  function copy(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    setClipboard(true);
    navigator.clipboard.writeText(props.i.html_url);
    setTimeout(() => {
      setClipboard(false);
    }, 1500);
  }


  return (
    <div className="hidden absolute text-black h-20 transform pt-16 -translate-x-1/2 py-2 left-1/2 top-1/2 opacity-0 group-hover:block group-hover:opacity-100 transition-all hover:block z-50 cursor-default duration-200 delay-75 max-w-xl" ref={props.elRef}>
            <ul className="bg-gh-bg text-white border-gh-border rounded-xl p-3 [&>li]:mb-2" onMouseEnter={() => props.setMouse(true)} onMouseLeave={() => props.setMouse(false)}>
              <li><span className="text-[#58a6ff]">Date:</span> <br /> {commitDate.toLocaleDateString()} at {commitDate.toLocaleTimeString()}</li>
              <li><span className="text-[#58a6ff]">SHA:</span> <br /> {props.i.sha}</li>
              <li><span className="text-[#58a6ff]">Message:</span> <br /><p onWheel={(e)=>e.stopPropagation()} className="max-h-[30vh] !overflow-y-scroll">{props.i.commit.message}</p> </li>

              <li>
                <span className="text-[#58a6ff]">URL:</span> <br />
                <div className="button my-2" onClick={copy}>
                  <span className="pointer-events-none m-1 text-sm break-all">{clipboard ? <MdCopyAll className="mx-auto h-auto -my-3" size={25}></MdCopyAll>: props.i.html_url}</span>
                </div>
              </li>
            </ul>
          </div>
  )
}
