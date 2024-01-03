import { Outlet } from "react-router";
import Nav from "./Nav";

function Parent() {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
}

export default Parent;
