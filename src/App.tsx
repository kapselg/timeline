import { Outlet } from "react-router-dom";
import "./Home.sass";
import TimeForm from "./components/TimeForm";

export const App = () => {

  return (
    <>
      <div className="h-screen" style={{background: 'radial-gradient(circle, rgba(32,40,50,1) 0%, rgba(22,27,34,1) 100%)'}}>
        <img src="/public/bg_logo_text.png" alt="website background logo" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-[0.6px] scale-75" />
        <Outlet></Outlet>
      </div>
    </>
  );
};
