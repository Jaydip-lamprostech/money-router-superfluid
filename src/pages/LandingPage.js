import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import "../styles/landingpage.scss";
import logo from "../assets/superfluid-logo-dark.svg";
import Dashboard from "../components/Dashboard";
// import IDAIndex from "../components/IDAIndex";
// import Subscriber from "../components/Subscriber";
// import Distribute from "../components/Distribute";
// import Agreements from "../components/Agreements";
import SendLumpSum from "../components/SendLumpSum";
import FlowIntoContract from "../components/FlowIntoContract";
import FlowFromContract from "../components/FlowFromContract";

function LandingPage() {
  const [index, setIndex] = useState();
  const [showDashboard, setDashboard] = useState(true);
  const [showLumpSum, setLumpSum] = useState(false);
  const [showFlowIntoContract, setFlowIntoContract] = useState(false);
  const [showFlowFromContract, setFlowFromContract] = useState(false);

  return (
    <div className="main">
      <div className="main-left">
        <div className="left-logo-main">
          <div className="left-logo">
            <img className="logo" src={logo} alt="superfluid logo" />
          </div>
        </div>
        <ul className="left-ul">
          <div
            className={showDashboard ? "left-ul-link active" : "left-ul-link"}
            onClick={() => {
              setDashboard(true);
              setLumpSum(false);
              setFlowIntoContract(false);
              setFlowFromContract(false);
            }}
          >
            <div className="link-icon">
              <svg
                className="icon"
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
              >
                <rect fill="none" height="24" width="24" />
                <path d="M9,21H5c-1.1,0-2-0.9-2-2V5c0-1.1,0.9-2,2-2h4c1.1,0,2,0.9,2,2v14C11,20.1,10.1,21,9,21z M15,21h4c1.1,0,2-0.9,2-2v-5 c0-1.1-0.9-2-2-2h-4c-1.1,0-2,0.9-2,2v5C13,20.1,13.9,21,15,21z M21,8V5c0-1.1-0.9-2-2-2h-4c-1.1,0-2,0.9-2,2v3c0,1.1,0.9,2,2,2h4 C20.1,10,21,9.1,21,8z" />
              </svg>
            </div>
            <div className="link-text selected">Dashboard</div>
          </div>
          <div
            className={showLumpSum ? "left-ul-link active" : "left-ul-link"}
            onClick={() => {
              setDashboard(false);
              setLumpSum(true);
              setFlowIntoContract(false);
              setFlowFromContract(false);
            }}
          >
            <div className="link-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z" />
              </svg>
            </div>
            <div className="link-text">Send LumpSum</div>
          </div>
          <div
            className={
              showFlowIntoContract ? "left-ul-link active" : "left-ul-link"
            }
            onClick={() => {
              setDashboard(false);
              setLumpSum(false);
              setFlowIntoContract(true);
              setFlowFromContract(false);
            }}
          >
            <div className="link-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M2 21h10c.55 0 1 .45 1 1s-.45 1-1 1H2c-.55 0-1-.45-1-1s.45-1 1-1zM5.24 8.07l2.83-2.83L20.8 17.97c.78.78.78 2.05 0 2.83-.78.78-2.05.78-2.83 0L5.24 8.07zm8.49-5.66l2.83 2.83c.78.78.78 2.05 0 2.83l-1.42 1.42-5.65-5.66 1.41-1.41c.78-.79 2.05-.79 2.83-.01zm-9.9 7.07l5.66 5.66-1.41 1.41c-.78.78-2.05.78-2.83 0l-2.83-2.83c-.78-.78-.78-2.05 0-2.83l1.41-1.41z" />
              </svg>
            </div>
            <div className="link-text">Send Into Contract</div>
          </div>
          <div
            className={
              showFlowFromContract ? "left-ul-link active" : "left-ul-link"
            }
            onClick={() => {
              setDashboard(false);
              setLumpSum(false);
              setFlowIntoContract(false);
              setFlowFromContract(true);
            }}
          >
            <div className="link-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="link-text selected">Send From Contract</div>
          </div>
        </ul>
      </div>
      <div className="main-right">
        <div className="right-header-parent">
          <header className="right-header">
            <ConnectButton
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </header>
        </div>
        <div className="inside-main-right">
          {showDashboard ? (
            <Dashboard />
          ) : showLumpSum ? (
            <SendLumpSum />
          ) : showFlowIntoContract ? (
            <FlowIntoContract />
          ) : showFlowFromContract ? (
            <FlowFromContract />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
