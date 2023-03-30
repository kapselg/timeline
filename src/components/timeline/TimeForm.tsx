import { ChangeEvent, useState } from "react";
import { MdClose, MdFilterAlt } from "react-icons/md";
import "./CheckboxStyles.css";

export default function TimeForm({ show, setShow, jumpDate }: { show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>>, jumpDate: (x: Date)=>void }) {
  const [date, setDate] = useState(new Date(0));

  function handleInput(e: ChangeEvent<HTMLInputElement>){
    setDate(new Date(e.target.value))
    console.log(date);
  }

  return (
    <div className={show ? 'block' : 'hidden'}>
      <div className="w-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:w-1/3 bg-gh-bg z-50 rounded-xl">
        <div className="relative py-10">
          <form className="m-4 select-none w-full" id="form">
            <span className="w-full ml-3 text-xl text-gh-blue">Jump to date:</span><br />
            <input type="date" onChange={handleInput} />
          </form>
        </div>
        <button className={`button !absolute bottom-6 right-6 ${date.valueOf() === 0 ? 'pointer-events-none opacity-10' : ''}`}onClick={() => {
            jumpDate(date)
          }}>Filter <MdFilterAlt className="inline" /></button>
        <button className='button !absolute right-6 aspect-square top-6' onClick={() => setShow(false)} >
          <MdClose className='text-red-600' size={25}></MdClose>
        </button>
      </div>
      <div className="absolute w-screen h-screen bg-black opacity-40"></div>
    </div>
  );
}
