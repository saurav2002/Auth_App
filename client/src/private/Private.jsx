import { Outlet } from "react-router";
import { Navigate } from "react-router";
// navigate is a component used to navigate inside our jsx (koi condition dena) but
// usenavigate used to navigate within function(button click pe)
import { useSelector } from "react-redux";

function Private() {
  const data = useSelector((data) => data.user.currentUser);
  // console.log("hehe", data);

  return data ? <Outlet /> : <Navigate to="/login" />;
}

export default Private;
