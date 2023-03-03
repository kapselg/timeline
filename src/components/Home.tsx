import React, { useRef } from "react";
import { Link } from "react-router-dom";


export default function Home() {
  const repoOwner = useRef(document.createElement('input'));
  const repoName = useRef(document.createElement('input'));


  return (
    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gh-bg p-6 rounded-lg scale-[.85] sm:scale-100 text-white font-mono shadow-lg">
      <h1 className="text-center text-2xl text-gh-blue">
        Enter repo's owner and name
      </h1>
      <div className="flex mt-6">
        github.com/<input type="text" className="w-32 text-black mx-1" ref={repoOwner} />/
        <input type="text" className="w-32 text-black mx-1" ref={repoName} />
      </div>
      <div className="text-center w-full mt-6">
        <Link to={`${repoOwner.current.value}/${repoName.current.value}`} className='button'>
          Go to timeline
        </Link>
      </div>
      <div className="button !text-white mt-6">
        You can also put the repo's owner and name in the url, for example: <Link to='facebook/react' className="text-gh-blue">{`${location.origin}/facebook/react`}</Link>
      </div>
    </div>
  );
}
