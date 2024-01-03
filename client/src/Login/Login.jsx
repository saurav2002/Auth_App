import { useState } from "react";
import image from "../assets/signin.jpg";

import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import Google from "../google/Google";
import { signin } from "../store/store";
import { useDispatch } from "react-redux";

function Login() {
  const dummy = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(dummy);
  const [visible1, setVisible1] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const formDataHandler = (e) => {
    setFormData((data) => ({
      ...data,
      [e.target.id]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    for (let prop in formData) {
      if (formData[prop] === "") {
        setError(prop.toUpperCase() + " Is Required");
        return;
      }
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      dispatch(signin(data.sendData));
      if (data.status === true) {
        navigate("/home");
        setError(null);
      }
      setLoading(false);
      setError(data.message);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="bg-white flex flex-col-reverse px-10  max-w-4xl m-auto justify-evenly mt-14 rounded-xl py-10 sm:flex-row-reverse sm:px-0 ">
      <div className=" flex  flex-col justify-center md:w-60">
        <h1 className="text-4xl text-slate-600 font-bold my-4 text-center">
          LOG IN
        </h1>
        <form className="flex flex-col gap-6 mt-4">
          <div className="flex items-center ">
            <span>
              <MdOutlineEmail />
            </span>
            <input
              type="email"
              placeholder="Email Address"
              id="email"
              className="m-1 p-1 border-b-2 bg-white border-slate-400 flex-auto focus:outline-0 "
              onChange={formDataHandler}
            />
          </div>
          <div>
            <div className="flex items-center relative">
              <span>
                <RiLockPasswordLine />
              </span>

              <input
                type={visible1 ? "text" : "password"}
                placeholder="Password"
                id="password"
                className="m-1 p-1 border-b-2 bg-white border-slate-400 flex-auto focus:outline-0"
                onChange={formDataHandler}
              />

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setVisible1((data) => !data);
                }}
                className="absolute right-1"
              >
                {visible1 ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <div className="text-right">
              <Link to="/forget" className="text-blue-600">
                Forget Password
              </Link>
            </div>
          </div>

          <button
            className="bg-slate-700 text-white font-bold p-3 rounded-lg hover:opacity-95 m-0"
            onClick={submitHandler}
          >
            {loading ? "LOADING" : "SIGN IN"}
          </button>
        </form>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <Google />
      </div>
      <div className="flex flex-col justify-center gap-6">
        <img src={image} />
        <div className="flex gap-2 justify-center">
          <p>Create an account?</p>
          <Link to="/signup" className="text-blue-600">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
