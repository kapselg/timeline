import { Outlet } from "react-router-dom";
import "./Home.sass";

export const Home = () => {

  return (
    <div className="bg-[url('/public/bg_logo.png')] h-screen">
      <Outlet></Outlet>
    </div>
  );
};
