import React from "react";
import { Helmet } from "react-helmet";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Not Found</title>
      </Helmet>
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl">Opps! Page Not Found</h1>
        <br />
        <p>The Page You Are Looking for Can Not Be Found !</p>
      </div>
    </>
  );
};

export default NotFound;
