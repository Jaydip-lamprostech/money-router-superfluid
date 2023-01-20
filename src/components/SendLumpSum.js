import React, { useState } from "react";
import SendTokenLS from "./SendTokenLS";
import Withdraw from "./Withdraw";

import "../styles/dashboard.scss";
import "../styles/subscriber.scss";

function SendLumpSum() {
  const [showSendTokenLS, setSendTokenLS] = useState(true);
  const [showWithdraw, setWithdraw] = useState(false);
  // const [showDeleteFlow, setDeleteFlow] = useState(false);

  return (
    <div className="db-main">
      <div className="subscriber-header">
        <button
          className={
            showSendTokenLS
              ? "subscriber-header-btn active"
              : "subscriber-header-btn"
          }
          onClick={() => {
            setSendTokenLS(true);
            setWithdraw(false);
          }}
        >
          Send Token
        </button>
        <button
          className={
            showWithdraw
              ? "subscriber-header-btn active"
              : "subscriber-header-btn"
          }
          onClick={() => {
            setSendTokenLS(false);
            setWithdraw(true);
          }}
        >
          Withdraw Token
        </button>
      </div>
      {showSendTokenLS ? <SendTokenLS /> : showWithdraw ? <Withdraw /> : null}
    </div>
  );
}

export default SendLumpSum;
