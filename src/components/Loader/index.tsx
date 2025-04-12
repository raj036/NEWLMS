import React from "react";
import { ColorRing } from "react-loader-spinner";

const Loader = () => {
  return (
    <>
      <div className="h-3/4 flex justify-center items-center z-[100]">
        <ColorRing
          visible={true}
          height="90"
          width="90"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={["#002D51", "#002D51", "#FFF", "#002D51", "#002D51"]}
        />
      </div>
    </>
  );
};

export default Loader;
