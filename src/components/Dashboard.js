import { Skeleton } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { Framework } from "@superfluid-finance/sdk-core";
// import Abi_IDA from "../artifacts/Abi_IDA.json";
// import { CONTRACT_ADDRESS } from "../config";

import "../styles/dashboard.scss";
import { useProvider } from "wagmi";
import { ethers } from "ethers";

function Dashboard() {
  const provider = useProvider();
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState();

  const [weiToken] = useState("1000000000000000000000");

  // const provider = useProvider();
  const { data: signer } = useSigner();

  // const AddFunds = async () => {
  //   try {
  //     const tx = await connectedContract.gainFdaix(weiToken);
  //     console.log(tx);
  //     // console.log(parseInt(tx[0]));

  //     // const receipt = await tx.wait();
  //     // console.log(receipt);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getBalance = async () => {
    const sf = await Framework.create({
      chainId: 5,
      provider: provider,
    });
    const daix = await sf.loadSuperToken("fDAIx");
    console.log("fDAIx balance...");
    try {
      const daixBalance = await daix.balanceOf({
        account: address,
        providerOrSigner: signer,
      });
      console.log(daixBalance);
      setTokenBalance(parseFloat(daixBalance / Math.pow(10, 18)).toFixed(5));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBalance();
    // const getFunds = async () => {
    //   try {
    //     const tx = await connectedContract.viewAddressStake();
    //     console.log(tx);
    //     if (tx) setTokenBalance(parseFloat(tx / Math.pow(10, 18)).toFixed(5));
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // getFunds();
  });

  if (isConnected) {
    return (
      <div className="db-main">
        <div className="db-sub">
          {/* <p>Connect your wallet, view any wallet, or take a look around!</p> */}
          <div className="db-box-parent">
            <h1 className="super-token">
              {loading ? (
                <Skeleton
                  animation="wave"
                  variant="rounded"
                  sx={{ bgcolor: "grey.100" }}
                />
              ) : (
                "Super Token"
              )}
            </h1>
            <div className="db-box">
              <div className="db-header">
                <div className="connect-wallet">
                  <ConnectButton
                    accountStatus={{
                      smallScreen: "avatar",
                      largeScreen: "full",
                    }}
                    showBalance={{
                      smallScreen: false,
                      largeScreen: false,
                    }}
                  />
                </div>
              </div>
              <div className="token-details">
                <table>
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Balance</th>
                      <th>Net Flow</th>
                      <th>Inflow/Outflow</th>
                      <th>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          enableBackground="new 0 0 24 24"
                          height="24px"
                          viewBox="0 0 24 24"
                          width="24px"
                          fill="#000000"
                        >
                          <g>
                            <rect fill="none" height="24" width="24" />
                            <rect fill="none" height="24" width="24" />
                          </g>
                          <g>
                            <g>
                              <path d="M17.29,5.71L17.29,5.71c-0.39-0.39-1.02-0.39-1.41,0L12,9.58L8.11,5.7c-0.39-0.39-1.02-0.39-1.41,0l0,0 c-0.39,0.39-0.39,1.02,0,1.41l4.59,4.59c0.39,0.39,1.02,0.39,1.41,0l4.59-4.59C17.68,6.73,17.68,6.1,17.29,5.71z" />
                              <path d="M17.29,12.3L17.29,12.3c-0.39-0.39-1.02-0.39-1.41,0L12,16.17l-3.88-3.88c-0.39-0.39-1.02-0.39-1.41,0l0,0 c-0.39,0.39-0.39,1.02,0,1.41l4.59,4.59c0.39,0.39,1.02,0.39,1.41,0l4.59-4.59C17.68,13.32,17.68,12.69,17.29,12.3z" />
                            </g>
                          </g>
                        </svg>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="token-icon">
                          <div aria-label="" className="svg-parent">
                            <svg
                              data-cy="animation"
                              viewBox="0 0 36 36"
                              className="fdaix-token-svg"
                            >
                              <clipPath id="clip">
                                <polygon points="18,18, 30.5,0 36,10.2"></polygon>
                              </clipPath>
                              <mask id="mask">
                                <rect
                                  x="-3"
                                  y="-3"
                                  width="42"
                                  height="42"
                                  fill="white"
                                ></rect>
                                <polygon
                                  points="18,18, 30.5,0 36,10.2"
                                  fill="black"
                                ></polygon>
                              </mask>
                              <circle
                                mask="url(#mask)"
                                r="17.5px"
                                cx="18"
                                cy="18"
                                stroke="#10BB35FF"
                                strokeWidth="1"
                                fill="transparent"
                              ></circle>
                              <circle
                                clipPath="url(#clip)"
                                r="17px"
                                cx="18"
                                cy="18"
                                strokeDasharray="2"
                                stroke="#10BB35FF"
                                strokeWidth="2"
                                fill="transparent"
                              ></circle>
                            </svg>
                            <div
                              className="MuiAvatar-root MuiAvatar-circular token-avatar-parent"
                              data-cy="token-icon"
                            >
                              <img
                                alt="fDAIx token icon"
                                src="https://raw.githubusercontent.com/superfluid-finance/assets/master/public//tokens/dai/icon.svg"
                                className="MuiAvatar-img avatar-token"
                              ></img>
                            </div>
                          </div>
                          <h4 className="fdaix">fDAIx</h4>
                        </div>
                      </td>
                      <td>
                        {tokenBalance >= 0 ? (
                          <h4 className="token-balance">{tokenBalance}</h4>
                        ) : (
                          <h4 className="token-balance">
                            <Skeleton
                              animation="wave"
                              variant="rounded"
                              sx={{ bgcolor: "grey.100" }}
                            />
                          </h4>
                        )}
                      </td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="db-main">
      <div className="db-sub">
        <h1>
          {loading ? (
            <Skeleton
              animation="wave"
              variant="rounded"
              sx={{ bgcolor: "grey.100" }}
            />
          ) : (
            "Money Router"
          )}
        </h1>
        <p></p>
        <div className="db-grid-sub">
          {loading ? (
            <Skeleton animation="wave" variant="rounded" height={"100%"} />
          ) : (
            <div className="grid-sub">
              <span className="grid-sub-title">Send a lump sum</span>
              <span className="grid-sub-info">
              Send and withdraw lump sums of tokens into and from the contract.
              </span>
            </div>
          )}
          <div className="grid-sub">
            <span className="grid-sub-title">Send a stream into the contract</span>
            <span className="grid-sub-info">
            Choose a token, enter a flow rate, and stream it into the contract.
            </span>
          </div>
          <div className="grid-sub">
            <span className="grid-sub-title">Send a stream from the contract</span>
            <span className="grid-sub-info">
            Choose a token, enter a flow rate and recipient, and stream it from the contract.
            </span>
          </div>
          <div className="grid-sub">
            <span className="grid-sub-title">Update and Delete streams</span>
            <span className="grid-sub-info">
            Update and delete streams into and from the contract.
            </span>
          </div>
        </div>
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
      </div>
    </div>
  );
}

export default Dashboard;
