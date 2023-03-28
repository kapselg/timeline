import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import './Home.css'

export default function Home() {
  const [formValues, setFormValues] = useState<{[key: string]: string}>({repoOwner: '', repoName: ''});

  function handleInput(e: ChangeEvent<HTMLInputElement>){
    const newFormValues = {...formValues};
    newFormValues[e.currentTarget.name] = e.currentTarget.value
    setFormValues(newFormValues);
  }

  return (
    <div className="absolute sm:top-1/2 sm:left-1/2 transform sm:-translate-x-1/2 sm:-translate-y-1/2 bg-gh-bg sm:rounded-lg w-full h-full sm:h-auto sm:w-11/12 text-white font-mono shadow-lg grid place-items-center sm:block">
      {/* <h1 className="text-center text-2xl text-gh-blue">
        Enter repo's owner and name
      </h1> */}
      <img src="/bg_logo_text.png" alt="Site's logo" className="h-28 mx-auto mt-6" />
      <form className="mt-6 grid place-items-center">
        <label htmlFor="repoName">
          Repository name:
        </label>
        <input name="repoName" type="text" onChange={handleInput}/><br />
        <label htmlFor="repoOwner">
          Repository owner:
        </label>
        <input name="repoOwner" type="text" onChange={handleInput}/>
      </form>
      <div className="text-center w-full mt-10">
        <Link  to={`${formValues.repoName}/${formValues.repoOwner}`} className='!py-4 !px-4 text-lg button'>
          Go to the timeline
        </Link>
      </div>
      <div className="button !text-white mt-20 mb-10 mx-auto sm:w-1/2">
        You can also put the repo's owner and name in the url, for example: <Link to='./facebook/react/' className="text-gh-blue break-words">{`${location.origin}/facebook/react`}</Link>
      </div>
    </div>
  );
}
