import { useState } from "react";
import { MdCancel, MdFilterAlt } from "react-icons/md";
import "./CheckboxStyles.css";

export default function TimeForm() {
  const [show, toggleShow] = useState(true)

  return (
    <div className={show ? 'block' : 'hidden'}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-64 bg-gh-bg z-50 rounded-xl">
        <div className="relative">
          <div className="m-4">
            <label className="b-contain m-2">
              <input type="checkbox" name="before" />
              <div className="b-input"></div>
              <span>Before:</span>
            </label>
            <input type="date" name="" id="" />
            <label className="b-contain m-2">
              <input type="checkbox" name="after" />
              <div className="b-input"></div>
              <span>After:</span>
            </label>
            <input type="date" name="" id="" />
          </div>
          <button className="button !absolute bottom-8 right-2">Filter <MdFilterAlt className="inline"/></button>
          <button onClick={() => toggleShow(false)} className="button !absolute top-0 aspect-square !text-red-800 right-2">
            <MdCancel/>
          </button>
        </div>
      </div>
      <div className="absolute w-screen h-screen bg-black opacity-40"></div>
    </div>
  );
}
