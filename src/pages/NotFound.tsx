import React from "react";
import { Helmet } from "react-helmet";

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Not Found</title>
      </Helmet>
      <div className="text-center my-14 py-14">
        <h1 className="text-4xl my-10 py-2">Opps! Page Not Found</h1>
        <p>The Page You Are Looking for Can Not Be Found !</p>
      </div>
    </>
  );
};

export default NotFound;
