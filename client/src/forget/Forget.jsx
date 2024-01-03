import { useState } from "react";
import image from "../assets/signin.jpg";
import { MdOutlineEmail } from "react-icons/md";

function Forget() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const formDataHandler = (e) => {
    setEmail(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (email === "") {
      setError("Enter Email Please");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/user/forget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      console.log(data);

      if (data.success === true) {
        setError(null);
        setMsg("Check Your Mail For A Password Reset Link");
        console.log(msg);
      }
      setLoading(false);
      setError(data.message);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Error Occured");
    }
  };

  return (
    <div className="bg-white flex flex-col-reverse px-10  max-w-4xl m-auto justify-evenly mt-14 rounded-xl py-10 sm:flex-row-reverse sm:px-0 ">
      <div className=" flex  flex-col justify-center md:w-60 ">
        <h1 className="text-4xl text-slate-600 font-bold my-4  text-center">
          Forget Password
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

          <button
            className="bg-slate-700 text-white font-bold p-3 rounded-lg hover:opacity-95 m-0"
            onClick={submitHandler}
          >
            {loading ? "LOADING" : "Forget Password"}
          </button>
        </form>
        {msg && <p className=" text-blue-600  text-center">{msg}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
      </div>
      <div className="flex flex-col justify-center gap-6">
        <img src={image} />
      </div>
    </div>
  );
}

export default Forget;
