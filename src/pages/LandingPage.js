import React, { useEffect, useState } from "react";
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
import { Box, Button, Modal, Skeleton, Typography } from "@mui/material";
import * as PushAPI from "@pushprotocol/restapi";
import { useAccount, useSigner } from "wagmi";
import push_logo from "../assets/push_logo.png";

function LandingPage() {
  // const [index, setIndex] = useState();
  const [showDashboard, setDashboard] = useState(true);
  const [showLumpSum, setLumpSum] = useState(false);
  const [showFlowIntoContract, setFlowIntoContract] = useState(false);
  const [showFlowFromContract, setFlowFromContract] = useState(false);
  const { data: signer } = useSigner();
  const [showOpted, setOpted] = useState(false);
  const { address, isConnected } = useAccount();

  const [showPushNotifications, setPushNotifications] = useState([]);
  const [showNewNotification, setNewNotification] = useState(false);
  const [notificationNumber, setnotificationNumber] = useState(0);
  // notification model
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    notifi();
    setNewNotification(false);
    setnotificationNumber(0);
  };
  const handleClose = () => setOpen(false);

  // const ethers = require("ethers");
  // const PK = "bbc51259d318490f8adf068a81fa146344b1de5301413c11279f91ea31853859";
  // const Pkey = `0x${PK}`;
  // const signer = new ethers.Wallet(Pkey);
  // const timeInterval = window.setInterval(() => {
  //   alert("Hello");
  //   return <></>;
  // const subscriptions = await PushAPI.user.getSubscriptions({
  //   user: `eip155:5:${address}`, // user address in CAIP
  //   env: "staging",
  // });
  // if (subscriptions.length === 0) {
  //   setOpted(false);
  // }
  // for (let i = 0; i < subscriptions.length; i++) {
  //   if (
  //     subscriptions[i].channel ===
  //     "0x158a6720c0709F8B55dc9753B92DF1d555A9F577"
  //   ) {
  //     console.log("subscribed");
  //     setOpted(true);
  //   }
  // }
  // console.log(subscriptions);

  // const notifications = await PushAPI.user.getFeeds({
  //   user: `eip155:5:${address}`, // user address in CAIP
  //   env: "staging",
  // });
  // console.log(notifications);
  // if (notifications.length > showPushNotifications.length) {
  //   setNewNotification(true);
  //   setPushNotifications(notifications);
  // }
  // }, 10000);
  const notifi = async () => {
    const subscriptions = await PushAPI.user.getSubscriptions({
      user: `eip155:5:${address}`, // user address in CAIP
      env: "staging",
    });
    if (subscriptions.length === 0) {
      setOpted(false);
    }
    for (let i = 0; i < subscriptions.length; i++) {
      if (
        subscriptions[i].channel ===
        "0x158a6720c0709F8B55dc9753B92DF1d555A9F577"
      ) {
        console.log("subscribed");
        setOpted(true);
      }
    }
    console.log(subscriptions);

    const notifications = await PushAPI.user.getFeeds({
      user: `eip155:5:${address}`, // user address in CAIP
      env: "staging",
    });
    console.log(notifications);
    setPushNotifications(notifications);
  };

  const optIn = async () => {
    await PushAPI.channels.subscribe({
      signer: signer,
      channelAddress: "eip155:5:0x158a6720c0709F8B55dc9753B92DF1d555A9F577", // channel address in CAIP
      userAddress: `eip155:5:${address}`, // user address in CAIP
      onSuccess: () => {
        console.log("opt in success");
      },
      onError: () => {
        console.error("opt in error");
      },
      env: "staging",
    });
  };

  const optOut = async () => {
    await PushAPI.channels.unsubscribe({
      signer: signer,
      channelAddress: "eip155:5:0x158a6720c0709F8B55dc9753B92DF1d555A9F577", // channel address in CAIP
      userAddress: "eip155:5:0xeB88DDaEdA2261298F1b740137B2ae35aA42A975", // user address in CAIP
      onSuccess: () => {
        console.log("opt out success");
      },
      onError: () => {
        console.error("opt out error");
      },
      env: "staging",
    });
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50vw",
    bgcolor: "background.paper",
    borderRadius: "20px",
    boxShadow: 24,
    p: 0,
    paddingBottom: "32px",
    maxHeight: "70vh",
    overflow: "auto",
    overflowX: "hidden",
    maxWidth: "700px",
  };

  useEffect(() => {
    if (address) {
      const timeInterval = setInterval(async () => {
        console.log("timer");
        const subscriptions = await PushAPI.user.getSubscriptions({
          user: `eip155:5:${address}`, // user address in CAIP
          env: "staging",
        });
        if (subscriptions.length === 0) {
          setOpted(false);
        }
        for (let i = 0; i < subscriptions.length; i++) {
          if (
            subscriptions[i].channel ===
            "0x158a6720c0709F8B55dc9753B92DF1d555A9F577"
          ) {
            console.log("subscribed");
            setOpted(true);
          }
        }
        console.log(subscriptions);
        const notifications = await PushAPI.user.getFeeds({
          user: `eip155:5:${address}`, // user address in CAIP
          env: "staging",
        });
        console.log(notifications);

        if (notifications.length > showPushNotifications.length) {
          setNewNotification(true);
          setnotificationNumber(
            notifications.length - showPushNotifications.length
          );
        }
        setPushNotifications(notifications);
      }, 5000);
      return () => clearInterval(timeInterval);
    }
  }, [address]);

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
            {/* <button onClick={() => timeInterval()}>start</button> */}
            {isConnected ? (
              <Button onClick={handleOpen} className="notification-btn">
                <img src={push_logo} alt="pushlogo" height={"28px"} />{" "}
                {showNewNotification ? (
                  <span className="red-dot">
                    {notificationNumber > 0 ? notificationNumber : null}
                  </span>
                ) : null}
              </Button>
            ) : null}

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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{
              position: "sticky",
              top: "0",
              backgroundColor: "#f3f4f6",
              padding: "20px 20px",
              margin: "0px",
              fontWeight: 600,
            }}
          >
            Notifications
            {showOpted === true ? (
              <button onClick={() => optOut()} className="push-btns">
                Opt Out
              </button>
            ) : showOpted === false ? (
              <button onClick={() => optIn()} className="push-btns">
                Opt IN
              </button>
            ) : (
              <Skeleton
                animation="wave"
                variant="rounded"
                sx={{ bgcolor: "grey.100" }}
              />
            )}
          </Typography>{" "}
          <Typography id="modal-modal-description" sx={{ mt: 2, p: 2 }}>
            {showPushNotifications.length > 0 &&
              showOpted === true &&
              showPushNotifications.map((item, key) => {
                return (
                  <div
                    style={{
                      border: "1px solid #10bb35aa",
                      margin: "10px 0px",
                      padding: "10px",
                      borderRadius: "10px",
                    }}
                  >
                    <h4 key={key}>{item.title} </h4>
                    <p>{item.message}</p>
                  </div>
                );
              })}
            {!showOpted ? (
              <div
                style={{
                  border: "1px solid #10bb35aa",
                  margin: "10px 0px",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                <h4>Opt In Money-Router channel to get notification </h4>
                <p>
                  Channel address - 0x158a6720c0709F8B55dc9753B92DF1d555A9F577{" "}
                </p>
              </div>
            ) : null}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default LandingPage;
