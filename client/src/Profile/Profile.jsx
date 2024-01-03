import { useState, useRef } from "react";
import bgp from "../assets/bjp1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineEmail } from "react-icons/md";
import { IoMdPhonePortrait } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { deleteUser, signin } from "../store/store";

function Profile() {
  const data = useSelector((data) => data.user.currentUser);
  const [formDisable, setFormDisable] = useState(true);
  const [selectedImage, setSelectedImage] = useState(data.photo);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState({});
  const imageref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const staticError = {
    error1: null,
    error2: null,
    error3: null,
  };
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(staticError);

  const dispatch = useDispatch();

  const formDisableHandler = () => {
    setFormDisable((val) => !val);
  };

  // file changing
  const fileHandler = (e) => {
    const file = e.target.files[0];
    setFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // input changing
  const formHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // submit handler
  const submitHandler = async (e) => {
    e.preventDefault();
    if (formData.Phone.length !== 10) {
      const errorOccured = {
        ...error,
        error1: "The Phone Number should consist of 10 Digits ",
      };
      setError(errorOccured);

      return;
    }
    setLoading(true);
    const sendData = new FormData();
    sendData.append("file", file);
    sendData.append("formData", JSON.stringify(formData));

    try {
      const res = await fetch(`/api/user/update/${data._id}`, {
        method: "POST",
        body: sendData,
      });
      const datas = await res.json();

      if (datas && datas.status) {
        dispatch(signin(datas.payload));
        setError(staticError);
      } else {
        const errorOccured = {
          ...error,
          error1: datas.message || "Some Error Occured",
        };
        setError(errorOccured);
      }
    } catch (err) {
      console.log(err);
      const errorOccured = {
        ...error,
        error1: "Some Error Occured",
      };
      setError(errorOccured);
    }
    setLoading(false);
  };

  // signout
  const signoutHandler = async () => {
    try {
      const res = await fetch("/api/auth/signout");
      const datas = await res.json();

      if (datas && datas.status) {
        dispatch(deleteUser());
        setError(staticError);
      } else {
        const errorOccured = {
          ...error,
          error2: datas.message || "Some Error Occured",
        };
        setError(errorOccured);
      }
    } catch (err) {
      console.log(err);
      const errorOccured = { ...error, error2: "Some Problem occur" };
      setError(errorOccured);
    }
  };

  // on delete
  const deleteHandler = async () => {
    try {
      console.log("hey");
      const res = await fetch(`/api/user/delete/${data._id}`, {
        method: "DELETE",
      });
      const datas = await res.json();
      console.log(datas, datas.status);
      if (datas && datas.status) {
        console.log("arha kya");
        dispatch(deleteUser());
        setError(staticError);
      } else {
        const errorOccured = {
          ...error,
          error3: datas.message || "Some Error Occured",
        };
        setError(errorOccured);
      }
    } catch (err) {
      const errorOccured = {
        ...error,
        error3: "Some Error Occured",
      };
      setError(errorOccured);
    }
  };

  // reset password
  const passHandler = async (e) => {
    e.preventDefault();
    const { email } = data;
    setLoad(true);
    try {
      // setLoading(true);
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
        setMsg("Check Your Mail For A Password Reset Link");
        console.log(msg);
        setTimeout(() => {
          setMsg("");
        }, 60000);
      }
      // setLoading(false);
      // setError(data.message);
    } catch (err) {
      console.log(err);
      // setLoading(false);
      // setError("Error Occured");
    }
    setLoad(false);
  };

  return (
    <div className="h-fit bg-[#f8f8f8] ">
      <div className=" h-fit relative">
        <div className=" h-80 ">
          <img src={bgp} className=" object-cover h-full w-full" />
        </div>
        <div className="h-28  w-[95%] m-auto -mt-5 relative  rounded-t-3xl rounded-b-none bg-white md:w-[75%]"></div>
        <div className="h-52 w-52 border-4 border-indigo-500 absolute  bottom-0 left-1/2 transform -translate-x-1/2 rounded-full overflow-hidden md:h-60 md:w-60">
          {/* inout pe click krwana hai jab koi image  pe click kre then use useref uska referncce lelo */}
          <input
            type="file"
            name="file"
            ref={imageref}
            hidden
            // accept="image/*"
            onChange={fileHandler}
          />
          {/* imageref.current.click se input ko click krlo */}
          <img
            src={selectedImage}
            onClick={() => imageref.current.click()}
            className="object-cover h-full w-full"
          />
        </div>
      </div>
      <div
        className="bg-white w-[95%] m-auto flex flex-col gap-4 p-10 mb-3 md:w-[75%] md:px-28"
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
        }}
      >
        <h1 className="mx-auto font-bold text-xl/8 ">
          {data.username.toUpperCase()}
        </h1>
        <button
          className="bg-cyan-500 shadow-lg shadow-indigo-500/50 p-2  rounded-xl hover:opacity-90 ml-auto font-bold text-white mx-2 flex gap-1 justify-center items-center"
          onClick={formDisableHandler}
        >
          <CiEdit />
          <span>EDIT PROFILE</span>
        </button>
        <form className="flex  flex-col gap-6">
          <div>
            <label htmlFor="email">Email Address</label>
            <div className="flex items-center">
              <span>
                <MdOutlineEmail />
              </span>
              <input
                type="Email"
                defaultValue={data.email}
                disabled
                id="email"
                placeholder="Email"
                className="m-1 p-1 cursor-not-allowed bg-white flex-auto focus:outline-0 "
              ></input>
            </div>
          </div>
          <div>
            <label htmlFor="Phone">Phone Number</label>
            <div className="flex items-center">
              <span>
                <IoMdPhonePortrait />
              </span>
              <input
                type="Phone"
                defaultValue={data.phone}
                disabled={formDisable}
                id="Phone"
                placeholder="Phone"
                onChange={formHandler}
                className={`m-1 p-1  bg-white flex-auto focus:outline-0 ${
                  !formDisable && "border-slate-600 border-b-2"
                }`}
              ></input>
            </div>
          </div>
          {/* <div>
            <label htmlFor="date">Date Of Birth</label>
            <div className="flex items-center">
              <span>
                <MdOutlineEmail />
              </span>
              <input
                type="Birthdate"
                id="date"
                disabled={formDisable}
                placeholder="Birth Date"
                className={`m-1 p-1  bg-white flex-auto focus:outline-0 ${
                  !formDisable && "border-slate-600 border-b-2 bg-slate-50"
                }`}
              ></input>
            </div>
          </div> */}
          <div>
            <button
              onClick={passHandler}
              className={`text-blue-500 ${load && "cursor-not-allowed"}`}
            >
              {!load ? "Reset Password" : "Wait"}
            </button>
            {msg && <p className=" text-blue-600  text-center">{msg}</p>}
          </div>
          <div className="flex flex-col ">
            <button
              onClick={submitHandler}
              className=" p-3 rounded-lg hover:opacity-90 font-bold text-white mx-2   bg-blue-500 shadow-lg shadow-blue-500/50  "
            >
              {loading ? "UPDATING" : "SAVE CHANGES"}
            </button>
            {error.error1 && (
              <p className="text-red-600 text-center">{error.error1}</p>
            )}
          </div>
        </form>
        <div className="flex flex-col ">
          <button
            onClick={signoutHandler}
            className="bg-indigo-500 shadow-lg shadow-indigo-500/50  p-3 rounded-lg hover:opacity-90 font-bold text-white mx-2 "
          >
            SIGN OUT
          </button>
          {error.error2 && (
            <p className="text-red-600 text-center">{error.error2}</p>
          )}
          <button
            onClick={deleteHandler}
            className=" bg-red-700 p-3 rounded-lg hover:opacity-90 font-bold text-white mt-4 mx-2"
          >
            DELETE ACCOUNT
          </button>
          {error.error3 && (
            <p className="text-red-600 text-center">{error.error3}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
