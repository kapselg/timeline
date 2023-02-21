import { Outlet } from "react-router-dom";
import "./Home.sass";
import TimeForm from "./TimeForm";

export const App = () => {

  return (
    <div className="bg-[url('/bg_logo.png')] h-screen bg-center" >
      <Outlet></Outlet>
      {/* <TimeForm></TimeForm> */}
    </div>
  );
};
