import React from "react";
import { css } from "@emotion/react";
import { BarLoader, ClipLoader, DotLoader } from "react-spinners";
import "./loading.css";

function Loading({ message }) {

  return (
    <div
      className="loading-box custom-loading"
    >
      <ClipLoader
        color={"#4A85F6"}
      />
      
      {message!==undefined||message!==null||message.length>0 ? <div style={{ fontSize: "1.3vmax" }}>{message}</div> : null}
      
    </div>
  );
}

export default Loading;
