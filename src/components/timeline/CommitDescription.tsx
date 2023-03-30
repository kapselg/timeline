import React, { Dispatch, SetStateAction, useState } from 'react';
import { IoMdClipboard } from 'react-icons/io';
import { MdClose, MdDone } from 'react-icons/md';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { GitCommit } from '../../api/types';
import './CommitDescription.sass';

export default function CommitDescription({ i, setFocus }: { i: GitCommit | null, setFocus: Dispatch<SetStateAction<GitCommit | null>> }) {
  if (!i) return <button className='button md:mt-32 w-fit absolute left-1/2 transform -translate-x-1/2'>
    Click on a commit SHA to show it's description
  </button>;

  const [clipboard, setClipboard] = useState(false);
  const commitDate = new Date(i!.commit.author.date);

  function handleCopy(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setClipboard(true);
    navigator.clipboard.writeText(i!.html_url);
    setTimeout(() => {
      setClipboard(false);
    }, 1500);
  }


  return (
    <>
    <div className="text-white transition-opacity opacity-100 cursor-default duration-200 h-[10vh] w-screen delay-75 grow relative bg-gh-bg md:w-1/2 border-gh-border rounded-t-xl md:rounded-xl flex flex-col gap-4 mx-auto p-4 overflow-clip">
      <button className='button !absolute right-0 aspect-square top-0 p-5 m-1' onClick={() => setFocus(null)} >
        <MdClose className='text-red-600' size={25}></MdClose>
      </button>
      <div><span className="text-[#58a6ff]">Date:</span><br />{commitDate.toLocaleDateString()} at {commitDate.toLocaleTimeString()}</div>
      <div><span className="text-[#58a6ff]">SHA:</span><br />{i!.sha}</div>
      <div className='grow overflow-y-scroll'>
        <span className="text-[#58a6ff]">Message:</span><br />
        <ReactMarkdown className='styled-markdown' rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>{i.commit.message}</ReactMarkdown>
      </div>
      <div>
        <span className="text-[#58a6ff]">URL:</span> <br />
        <div className="button my-2 flex items-center">
          <a className="m-1 text-sm break-all grow !cursor-text" href={i.html_url} target='_blank'>{i.html_url}</a>
          <button className='button m-2' onClick={handleCopy}>
            <div className='p-2'>
              {clipboard ? <MdDone></MdDone> : <IoMdClipboard></IoMdClipboard>}
            </div>
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
