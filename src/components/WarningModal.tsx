import React, { createContext, useContext, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { BehaviorSubject, Subject, map } from "rxjs";

export function setModal(modalType: JSX.Element){
  modalContents.next(modalType)
}

export const PremadeModals = {
  RATE_LIMIT: (dateDue: Date) => {
    const minutesLeft = Math.ceil((new Date().valueOf() - dateDue.valueOf()) / 60000);
    let minutesLeftText;
    if (minutesLeft !== 1) minutesLeftText = <>{minutesLeft}&nbsp;minutes</>;
    else minutesLeftText = <>{minutesLeft}&nbsp;minute</>;

    return (
      <div className="text-white">
        <h2 className="text-xl pb-2">You are being rate limited by GitHub.</h2>
        <p>
          You may make another action that requires querying the GitHub API in {minutesLeftText} on {dateDue.toLocaleString()}
        </p>
      </div>
    );
  },
};

const modalContents = new Subject<JSX.Element | null>();

export default function WarningModal() {
  const [children, setChildren] = useState<JSX.Element | null>(null);

  function closeModal() {
    modalContents.next(null);
  }

  useEffect(() => {
    modalContents.subscribe((modalContents) => {
      setChildren(modalContents);
    });
  });

  return (
    <div hidden={!children}>
      <div className="w-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-1/3 bg-gh-bg z-50 rounded-xl">
        <div className="pb-10 pt-5 px-5 pr-20 flex">{children}</div>
        <button className="button !absolute right-6 aspect-square top-6" onClick={closeModal}>
          <MdClose className="text-red-600" size={25}></MdClose>
        </button>
      </div>
      <div className="absolute w-screen h-screen bg-black opacity-40"></div>
    </div>
  );
}
