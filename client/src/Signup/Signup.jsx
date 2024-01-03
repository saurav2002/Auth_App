import { useState } from "react";
import image from "../assets/signup.jpg";
import { CgProfile } from "react-icons/cg";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdPhonePortrait } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { RiLockPasswordFill } from "react-icons/ri";

import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";
import Google from "../google/Google";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const dummy = {
    username: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState(dummy);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        setError(prop + " Is Required");
        return;
      }
    }

    if (formData.phone.toString().length !== 10) {
      setError("Phone Number 10 digit");
      return;
    }
    if (formData.password !== formData.cpassword) {
      setError("Password should be same");
      return;
    }
    try {
      let { cpassword, ...obj } = formData;
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      const data = await res.json();
      if (data.status === true) {
        navigate("/login");
        setError(null);
      }
      setLoading(false);
      setError(data.message);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(null);
    }
  };

  return (
    <div className="bg-white flex flex-col px-8  max-w-4xl m-auto justify-evenly mt-14 rounded-xl py-10 sm:flex-row sm:px-0 ">
      <div className="min-w">
        <h1 className="text-4xl text-slate-600 font-bold my-4  text-center">
          Sign Up
        </h1>
        <form className="flex flex-col gap-4 mt-5">
          <div className="flex items-center ">
            <span>
              <CgProfile className="flex " />
            </span>
            <input
              type="text"
              placeholder="Your Name"
              id="username"
              className="m-1 bg-white p-1 border-b-2 border-slate-400 flex-auto focus:outline-0 "
              onChange={formDataHandler}
            />
          </div>
          <div className="flex items-center ">
            <span>
              <MdOutlineEmail />
            </span>
            <input
              type="email"
              placeholder="Email Address"
              id="email"
              className="m-1 p-1 bg-white border-b-2 border-slate-400 flex-auto focus:outline-0 "
              onChange={formDataHandler}
            />
          </div>
          <div className="flex items-center ">
            <span>
              <IoMdPhonePortrait />
            </span>

            <input
              type="number"
              placeholder="Phone Number"
              className="m-1 p-1 border-b-2 bg-white border-slate-400 flex-auto focus:outline-0 "
              onChange={formDataHandler}
              id="phone"
            />
          </div>
          <div className="flex items-center relative">
            <span>
              <RiLockPasswordLine />
            </span>

            <input
              type={visible1 ? "text" : "password"}
              placeholder="Password"
              //   value={pass}
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
          <div className="flex items-center relative">
            <span>
              <RiLockPasswordFill />
            </span>
            <input
              type={visible2 ? "text" : "password"}
              placeholder="Confirm Password"
              id="cpassword"
              className="m-1 p-1 border-b-2 bg-white border-slate-400 flex-auto focus:outline-0 "
              onChange={formDataHandler}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setVisible2((data) => !data);
              }}
              className="absolute right-1"
            >
              {visible2 ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          <button
            className="bg-slate-700 text-white font-bold p-3 rounded-lg hover:opacity-95 m-0"
            onClick={submitHandler}
          >
            {loading ? "LOADING" : "SIGN UP"}
          </button>
        </form>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <Google />
      </div>
      <div className="flex flex-col justify-center gap-6">
        <img src={image} />
        <div className="flex gap-2 justify-center">
          <p>Have an account?</p>
          <Link to="/login" className="text-blue-600">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
