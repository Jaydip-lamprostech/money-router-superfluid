import React, { useEffect, useState } from "react";
import { FormControl, MenuItem, Select, Tooltip } from "@mui/material";
import Fade from "@mui/material/Fade";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import MoneyRouterABI from "../artifacts/MoneyRouter.json";
const moneyRouterAddress = "0x563a2ED0F4c430FD4A94D9C08a3fB08635C23eFE";

function CreateFIC() {
  const [indexValue, setIndexValue] = useState("");
  const { address, isConnected } = useAccount();
  const [tempFlow, setTempFlow] = useState(0);
  // const [flowRate, setFlowRate] = useState();

  const handleChange = (e) => {
    setIndexValue(e.target.value);
  };
  const handleChangeTime = (e) => {
    setTime(e.target.value);
  };
  const [loadingAnim, setLoadingAnim] = useState(false);
  const [btnContent, setBtnContent] = useState("Create Flow");
  const [showTime, setTime] = useState("second");

  const sendStreamIntoContract = async () => {
    setLoadingAnim(true);

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

        // check permission data
        const isAuthorized = await daix.getFlowOperatorData({
          sender: address,
          flowOperator: moneyRouterAddress,
          token: daix.address,
          providerOrSigner: signer,
        });
        const permission = isAuthorized.permissions;
        // const flow = document.getElementById("flow").value;
        let flowRate;
        if (showTime === "minute") {
          flowRate = tempFlow * 60;
        } else if (showTime === "hour") {
          flowRate = tempFlow * 3600;
        } else if (showTime === "day") {
          flowRate = tempFlow * 86400;
        } else if (showTime === "week") {
          flowRate = tempFlow * 604800;
        } else if (showTime === "month") {
          flowRate = tempFlow * 18144000;
        } else if (showTime === "year") {
          flowRate = tempFlow * 18144000 * 365;
        } else if (showTime === "second") {
          flowRate = parseInt(tempFlow);
        }
        console.log(flowRate);
        console.log(typeof flowRate);

        console.log(permission);
        console.log(typeof permission);
        // condition for authorization
        if (permission === String(0)) {
          //  approve contract to spend 1000 daix
          const aclApproval = daix.updateFlowOperatorPermissions({
            flowOperator: moneyRouterAddress,
            flowRateAllowance: "3858024691358024", //10k tokens per month in flowRateAllowanace
            permissions: 7, //NOTE: this allows for full create, update, and delete permissions. Change this if you want more granular permissioning
          });
          await aclApproval.exec(signer).then(async function (tx) {
            await tx.wait();
            console.log(`
            Congrats! You've just successfully made the money router contract a flow operator.
            Tx Hash: ${tx.hash}
        `);
          });
        }
        // const tx = await moneyRouter.createFlowIntoContract(daix.address, flow);
        // tx.wait();
        console.log(ethers.utils.parseEther(String(flowRate)));
        await moneyRouter
          .connect(signer)
          .createFlowIntoContract(
            daix.address,
            // parseInt(ethers.utils.parseEther(String(flowRate)))
            flowRate
          )
          .then(async function (tx) {
            await tx.wait();
            console.log(`
              Congrats! You just successfully created a flow into the money router contract.
              Tx Hash: ${tx.hash}
          `);
            setBtnContent("Flow Started");
            setTimeout(() => {
              setBtnContent("Create Flow");
            }, 2000);
            setLoadingAnim(false);
          });
      }
    } catch (error) {
      console.log(error);
      setLoadingAnim(false);
    }
  };

  // const print = async (e) => {
  //   if (showTime === "minute") {
  //     setFlowRate(tempFlow * 60);
  //   } else if (showTime === "hour") {
  //     setFlowRate(tempFlow * 3600);
  //   } else if (showTime === "day") {
  //     setFlowRate(tempFlow * 86400);
  //   } else if (showTime === "week") {
  //     setFlowRate(tempFlow * 604800);
  //   } else if (showTime === "month") {
  //     setFlowRate(tempFlow * 18144000);
  //   } else if (showTime === "year") {
  //     setFlowRate(tempFlow * 18144000 * 365);
  //   } else if (showTime === "second") {
  //     setFlowRate(tempFlow);
  //   }
  // };
  // useEffect(() => {
  //   console.log(flowRate + "/second");
  // }, [flowRate]);
  return (
    <div className="db-sub">
      <h1>Create Flow</h1>
      <p>Create the flow in the contract.</p>
      <div className="subscriber-add-box">
        <FormControl required fullWidth>
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
        {/* <h3>Unit</h3> */}
        <div style={{ textAlign: "left", alignItems: "center" }}>
          <Tooltip
            title="1 fDAIx = 1000000000000000000 Wei"
            arrow
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
          >
            <span
              style={{
                fontWeight: "600",
                paddingLeft: "5px",
                color: "rgba(18, 20, 30, 0.87)",
              }}
            >
              What is Wei ?
            </span>
          </Tooltip>
        </div>
        <div className="subscriber-add-btn">
          {isConnected ? (
            <button
              className="action-btn"
              onClick={() => sendStreamIntoContract()}
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

export default CreateFIC;
