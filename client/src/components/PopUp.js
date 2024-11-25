import React, { useState } from "react";
import "./PopUp.css";

const PopUp = ({message, confirm, cancel, type}) => {
  return (
    <div className="overlay">
      <div className="content">
        <h3>{message}</h3>
        <div className="buttons">
          {type !== "view" && <button onClick={confirm}>Confirm</button>}
          <button onClick={cancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
