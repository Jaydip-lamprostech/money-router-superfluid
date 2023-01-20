import React, { useEffect, useState } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import MoneyRouterABI from "../artifacts/MoneyRouter.json";
const moneyRouterAddress = "0x563a2ED0F4c430FD4A94D9C08a3fB08635C23eFE";

function UpdateFIC() {
  const [indexValue, setIndexValue] = useState("");
  const { address, isConnected } = useAccount();

  const handleChange = (e) => {
    setIndexValue(e.target.value);
  };

  const [loadingAnim, setLoadingAnim] = useState(false);
  const [btnContent, setBtnContent] = useState("Update Flow");

  const updatedFlowIntoContract = async () => {
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

        const flow = document.getElementById("flow").value;
        //call money router create flow into contract method from signer
        //this flow rate is ~2000 tokens/month
        await moneyRouter
          .connect(signer)
          .updateFlowIntoContract(daix.address, flow)
          .then(async function (tx) {
            await tx.wait();
            console.log(`
            Congrats! You just successfully updated a flow into the money router contract. 
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

  return (
    <div className="db-sub">
      <h1>Update Flow</h1>
      <p>Update the flow in the contract.</p>
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
        <div className="subscriber-input-div">
          <input
            id="flow"
            type="number"
            className="subscriber-input-index"
            placeholder="Flow rate"
          />
        </div>
        {/* <h3>Unit</h3> */}

        <div className="subscriber-add-btn">
          {isConnected ? (
            <button
              className="action-btn"
              onClick={() => updatedFlowIntoContract()}
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

export default UpdateFIC;
