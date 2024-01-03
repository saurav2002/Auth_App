import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signin } from "../store/store";
import { useNavigate } from "react-router";

function Google() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const googlHandler = async () => {
    try {
      const Provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, Provider);
      const obj = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };
      //   console.log(obj);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      const data = await res.json();
      if (data && data.status) {
        dispatch(signin(data.sendData));
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <button
      className="bg-red-700 text-white w-full font-bold p-3 rounded-lg hover:opacity-95 mt-2"
      onClick={googlHandler}
    >
      GOOGLE
    </button>
  );
}

export default Google;
