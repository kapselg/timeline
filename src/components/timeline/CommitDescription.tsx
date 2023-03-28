import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MdClose, MdCopyAll } from 'react-icons/md';
import { GitCommit } from '../../api/types';

export default function CommitDescription({ i, setFocus }: { i: GitCommit | null, setFocus: Dispatch<SetStateAction<GitCommit | null>> }) {
  console.log('rendering');

  if (!i) return <button className='button md:mt-32 absolute left-1/2 transform -translate-x-1/2'>
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
    <div className="text-white md:mt-16 transition-opacity opacity-100 cursor-default duration-200 delay-75 w-full h-full md:max-w-xl relative md:h-auto bg-gh-bg  border-gh-border rounded-t-xl md:rounded-xl flex flex-col gap-4 mx-auto p-4">
      <button className='button !absolute right-0 aspect-square top-0 p-5 m-1' onClick={() => setFocus(null)} >
        <MdClose className='text-red-600' size={25}></MdClose>
      </button>
      <div><span className="text-[#58a6ff]">Date:</span><br />{commitDate.toLocaleDateString()} at {commitDate.toLocaleTimeString()}</div>
      <div><span className="text-[#58a6ff]">SHA:</span><br />{i!.sha}</div>
      <div className='grow overflow-y-scroll'>
        <span className="text-[#58a6ff]">Message:</span><br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates impedit corporis sunt quaerat hic, sequi rerum odio libero totam est cupiditate, cum fugit tempora soluta consequuntur. Quod minima sunt quas.
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eligendi cupiditate expedita saepe provident ea omnis error pariatur dolores soluta numquam accusamus, tempora quibusdam placeat delectus distinctio, cumque temporibus incidunt necessitatibus.
      </div>
      <div>
        <span className="text-[#58a6ff]">URL:</span> <br />
        <div className="button my-2" onClick={copy}>
          <span className="pointer-events-none m-1 text-sm break-all">{clipboard ? <MdCopyAll className="mx-auto -my-3" size={25}></MdCopyAll> : i!.html_url}</span>
        </div>
      </div>
    </div>
  )
}
