// import React from "react";
import { useSelector } from "react-redux";

function Home() {
  const data = useSelector((state) => state.user.currentUser);
  // console.log(data);
  return (
    <div className=" bg-white w-5/6 m-auto text-center my-8 py-5 text-[#475569]  text-xl rounded-3xl">
      <h1 className="text-4xl py-3 font-medium">Home</h1>
      <div>
        <p className="p-4">
          Welcome to my Auth App! This is a full-stack web application built
          with the MERN (MongoDB, Express, React, Node.js) stack. It includes
          authentication features that allow users to sign up, log in, and log
          out, and provides access to protected routes only for authenticated
          users.
        </p>
        <p className="p-4">
          The front-end of the application is built with React and uses React
          Router for client-side routing. The back-end is built with Node.js and
          Express, and uses MongoDB as the database. Authentication is
          implemented using JSON Web Tokens (JWT).
        </p>
        <p className="p-4 ">
          This application is intended as a starting point for building
          full-stack web applications with authentication using the MERN stack.
        </p>
      </div>
    </div>
  );
}

export default Home;
