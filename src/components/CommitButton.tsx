import React, { useState } from "react";
import { MdCopyAll } from "react-icons/md";
import { GitCommit } from "../api/types";

export default function CommitButton(props: { i: GitCommit; setMouse: (v: boolean) => any }) {
  const [clipboard, setClipboard] = useState(false);

  function copy(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    setClipboard(true);
    navigator.clipboard.writeText(props.i.html_url);
    setTimeout(() => {
      setClipboard(false);
    }, 1500);
  }

  return (
    <div id={`${props.i.shortSha}_commit`}>
      <div className="grid hover:h-screen place-items-start transition-all duration-200 group px-4 cursor-pointer">
        <div className="button">
        {props.i.shortSha}
          <div className="hidden absolute text-black h-20 transform top-10 -translate-x-1/2 py-2 left-1/2 opacity-0 group-hover:block group-hover:opacity-100 transition-all hover:block z-50">
            <ul className="bg-[#21262d] text-white border-[#f0f6fc1a] rounded-xl p-3 [&>li]:mb-2" onMouseEnter={() => props.setMouse(true)} onMouseLeave={() => props.setMouse(false)}>
              <li>Commit Date: {new Date(props.i.commit.author.date).toString()}</li>
              <li>Commit SHA: {props.i.sha}</li>
              <li>
                Commit URL: <br />
                <div className="button" onClick={copy}>
                  <span className="pointer-events-none m-1 text-sm">{clipboard ? <MdCopyAll className="mx-auto h-auto" size={25}></MdCopyAll>: props.i.html_url}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
