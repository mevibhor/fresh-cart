import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const AppLayout = () => {
  return (
    <div className="min-h-screen w-full min-w-0">
      <Navbar />

      {/* The fixed navbar is 64px tall. Reserve its space once for every route. */}
      <div className="min-h-screen pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
