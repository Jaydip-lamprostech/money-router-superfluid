import React, { useEffect, useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import * as PushAPI from "@pushprotocol/restapi";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import MoneyRouterABI from "../artifacts/MoneyRouter.json";
const moneyRouterAddress = "0x563a2ED0F4c430FD4A94D9C08a3fB08635C23eFE";

function UpdateFFC() {
  const { address, isConnected } = useAccount();

  const [indexValue, setIndexValue] = useState("");
  const [tempFlow, setTempFlow] = useState();
  const [flowRate, setFlowRate] = useState();
  const [showTime, setTime] = useState("second");

  const handleChange = (e) => {
    setIndexValue(e.target.value);
  };

  const handleChangeTime = (e) => {
    setTime(e.target.value);
  };

  const [loadingAnim, setLoadingAnim] = useState(false);
  const [btnContent, setBtnContent] = useState("Update Flow");

  const PK = `${process.env.REACT_APP_PUSH_CHANNEL_PKEY}`;
  const Pkey = `0x${PK}`;
  const signer = new ethers.Wallet(Pkey);
  // apiResponse?.status === 204, if sent successfully!
  const sendMessage = async () => {
    const receiver = document.getElementById("receiver").value;
    console.log(receiver);
    const flow = document.getElementById("flow").value;

    const apiResponse = await PushAPI.payloads.sendNotification({
      signer,
      type: 3, // target
      identityType: 2, // direct payload
      notification: {
        title: "Stream Updated",
        body: "Stream updated from contract to your account",
      },
      payload: {
        title: "Stream Updated",
        body: `Stream has been updated from contract into your address
        flow rate - ${flow} Wei/second`,
        cta: "",
        img: "",
      },
      recipients: `eip155:5:${receiver}`, // recipient address
      channel: "eip155:5:0x158a6720c0709F8B55dc9753B92DF1d555A9F577", // your channel address
      env: "staging",
    });
    if (apiResponse?.status === 204) {
      console.log("Message sent successfully");
    }
  };

  const updateFlowFromContract = async () => {
    setLoadingAnim(true);
    await print();

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const sf = await Framework.create({
          chainId: 5,
          provider: provider,
        });

        const daix = await sf.loadSuperToken("fDAIx");
        const moneyRouter = new ethers.Contract(
          moneyRouterAddress,
          MoneyRouterABI,
          signer
        );

        const flow = document.getElementById("flow").value;
        console.log(flowRate);
        const receiver = document.getElementById("receiver").value;
        //call money router create flow into contract method from signer
        //this flow rate is ~2000 tokens/month
        await moneyRouter
          .connect(signer)
          .updateFlowFromContract(daix.address, receiver, flowRate)
          .then(async function (tx) {
            await tx.wait();
            sendMessage();
            console.log(`
            Congrats! You just successfully updated a flow from the money router contract. 
            Tx Hash: ${tx.hash}
        `);
            setBtnContent("Flow Updated");
            setTimeout(() => {
              setBtnContent("Update Flow");
            }, 2000);
            setLoadingAnim(false);
          });
      }
    } catch (error) {
      console.log(error);
      setLoadingAnim(false);
    }
  };
  const print = async (e) => {
    if (showTime === "minute") {
      setFlowRate(tempFlow * 60);
    } else if (showTime === "hour") {
      setFlowRate(tempFlow * 3600);
    } else if (showTime === "day") {
      setFlowRate(tempFlow * 86400);
    } else if (showTime === "week") {
      setFlowRate(tempFlow * 604800);
    } else if (showTime === "month") {
      setFlowRate(tempFlow * 18144000);
    } else if (showTime === "year") {
      setFlowRate(tempFlow * 18144000 * 365);
    } else if (showTime === "second") {
      setFlowRate(tempFlow);
    }
  };
  useEffect(() => {
    console.log(flowRate + "/second");
  }, [flowRate]);
  return (
    <div className="db-sub">
      <h1>Update Flow</h1>
      <p>Update the flow from the contract.</p>
      <div className="subscriber-add-box">
        <FormControl required fullWidth>
          {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
          <Select
            displayEmpty
            id="demo-simple-select"
            value={indexValue}
            onChange={handleChange}
            sx={{
              margin: "10px 0px",
              color: "rgba(18, 20, 30, 0.87)",
              fontSize: "1rem",
              padding: "0px 5px",
              ".css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select":
                {
                  minHeight: "auto",
                },
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgb(224, 224, 224)",
                boxShadow: "rgba(204, 204, 204, 0.25) 0px 0px 6px 3px",
                borderRadius: "15px",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgb(224, 224, 224)",
                boxShadow: "rgba(204, 204, 204, 0.25) 0px 0px 6px 3px",
                borderRadius: "15px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgb(224, 224, 224)",
                boxShadow: "rgba(204, 204, 204, 0.25) 0px 0px 6px 3px",
                borderRadius: "15px",
              },
              ".MuiSvgIcon-root ": {
                fill: "black",
              },
            }}
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem disabled value="">
              <h4 className="index-placeholder">Select Token</h4>
            </MenuItem>
            <MenuItem value={"fDAIx"}>fDAIx</MenuItem>
          </Select>
        </FormControl>
        {/* <h3>Subscriber Address</h3> */}

        {/* <h3>Unit</h3> */}
        <div className="subscriber-input-div">
          <input
            id="receiver"
            type="text"
            className="subscriber-input-index"
            placeholder="Receiver's Public Address"
          />
        </div>
        <div className="flex-row">
          <div className="subscriber-input-div">
            <input
              id="flow"
              type="number"
              className="subscriber-input-index"
              placeholder="Flow rate in Wei"
              onChange={(e) => setTempFlow(e.target.value)}
            />
          </div>

          <FormControl required>
            <Select
              displayEmpty
              id="demo-simple-select"
              value={showTime}
              onChange={handleChangeTime}
              sx={{
                margin: "10px 0px",
                color: "rgba(18, 20, 30, 0.87)",
                fontSize: "1rem",
                padding: "0px 5px",
                ".css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.MuiSelect-select":
                  {
                    minHeight: "auto",
                  },
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgb(224, 224, 224)",
                  boxShadow: "rgba(204, 204, 204, 0.25) 0px 0px 6px 3px",
                  borderRadius: "15px",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgb(224, 224, 224)",
                  boxShadow: "rgba(204, 204, 204, 0.25) 0px 0px 6px 3px",
                  borderRadius: "15px",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgb(224, 224, 224)",
                  boxShadow: "rgba(204, 204, 204, 0.25) 0px 0px 6px 3px",
                  borderRadius: "15px",
                },
                ".MuiSvgIcon-root ": {
                  fill: "black",
                },
              }}
              inputProps={{ "aria-label": "Without label" }}
            >
              {/* <MenuItem value="">
                <h4 className="index-placeholder">Select Token</h4>
              </MenuItem> */}
              <MenuItem value={"second"}>/ second</MenuItem>
              <MenuItem value={"minute"}>/ minute</MenuItem>
              <MenuItem value={"hour"}>/ hour</MenuItem>
              <MenuItem value={"day"}>/ day</MenuItem>
              <MenuItem value={"week"}>/ week</MenuItem>
              <MenuItem value={"month"}>/ month</MenuItem>
              <MenuItem value={"year"}>/ year</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="subscriber-add-btn">
          {isConnected ? (
            <button
              className="action-btn"
              onClick={() => updateFlowFromContract()}
            >
              {loadingAnim ? <span className="loader"></span> : btnContent}
            </button>
          ) : (
            <div className="connect-wallet ">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateFFC;
