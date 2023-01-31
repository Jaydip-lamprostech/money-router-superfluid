import React from "react";
import { useAccount } from "wagmi";
import { createClient } from "urql";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

function ViewAllIntoContract() {
  const { address, isConnected } = useAccount();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    const API =
      "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli";

    const data_ = `
    query {
      account(id: "0x563a2ed0f4c430fd4a94d9c08a3fb08635c23efe") {
        inflows(orderBy: createdAtTimestamp, orderDirection: desc, where: {}) {
          currentFlowRate
          sender {
            id
          }
          streamedUntilUpdatedAt
          createdAtTimestamp
        }
      }

    }
  `;
    const c = createClient({
      url: API,
    });
    const result1 = await c.query(data_).toPromise();
    const finalData = result1.data.account.inflows;
    console.log("finalData");

    if (data.length < finalData.length) {
      for (let i = 0; i < finalData.length; i++) {
        const converted = new Date(
          parseInt(finalData[i].createdAtTimestamp) * 1000
        );
        const date =
          String(converted.getDate()) +
          "/" +
          String(converted.getMonth() + 1) +
          "/" +
          String(converted.getFullYear());
        data.push([finalData[i].sender.id, finalData[i].currentFlowRate, date]);
      }
    }
    setData(data);
    setLoading(true);
    // console.log(result1.data.account.inflows);
    // try {
    //   const { ethereum } = window;
    //   if (ethereum) {
    //     const provider = new ethers.providers.Web3Provider(ethereum);
    //     const signer = provider.getSigner();

    //     const sf = await Framework.create({
    //       chainId: 5,
    //       provider: provider,
    //     });
    //     const daix = await sf.loadSuperToken("fDAIx");
    //     const response = await daix.getFlow({
    //       sender: address,
    //       receiver: "0x563a2ED0F4c430FD4A94D9C08a3fB08635C23eFE",
    //       providerOrSigner: signer,
    //     });
    //     let active;
    //     if (
    //       response.deposit === "0" &&
    //       response.owedDeposit === "0" &&
    //       response.flowRate === "0"
    //     ) {
    //       active = "Not Active";
    //     } else {
    //       active = "Active";
    //     }
    //     // loop over query response
    //     for (let i = 0; i < finalData.length; i++) {
    //       const converted = new Date(parseInt(finalData[i].timestamp) * 1000);
    //       const date =
    //         String(converted.getDate()) +
    //         "/" +
    //         String(converted.getMonth() + 1) +
    //         "/" +
    //         String(converted.getFullYear());

    //       if (!data.find((item) => finalData[i].timestamp === item[3])) {
    //         // let check = true;
    //         // for (let i = 0; i < data.length; i++) {
    //         //   if (data[i].includes(finalData[i].sender)) {
    //         //     check = false;
    //         //   }
    //         // }
    //         if (finalData[i].stream["currentFlowRate"] !== "0") {
    //           data.push([
    //             finalData[i].flowRate,
    //             date,
    //             active,
    //             finalData[i].timestamp,
    //             finalData[i].sender,
    //           ]);
    //         } else {
    //           // if (!data[data.length - 1].includes(finalData[i].sender))
    //           data.push([
    //             finalData[i].flowRate,
    //             date,
    //             "Not Active",
    //             finalData[i].timestamp,
    //             finalData[i].sender,
    //           ]);
    //         }
    //       }
    //     }
    //     setData(data);
    //     setLoading(true);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };
  useEffect(() => {
    getData();
  });
  if (loading) {
    return (
      <div className="db-sub">
        <h1>All streams</h1>
        <p>View all streams in the contract.</p>
        <div className="subscriber-add-box view-all">
          {/* <h3>Subscriber Address</h3> */}
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>Flow Rate</th>
                <th>Start / End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0
                ? data.map((item, key) => {
                    return item[0] !== "0" ? (
                      <tr key={key}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              fill="#000000"
                            >
                              <path d="M0 0h24v24H0V0z" fill="none" />
                              <path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" />
                            </svg>{" "}
                            {item[0].substring(0, 7) +
                              "..." +
                              item[0].substring(
                                item[0].length - 5,
                                item[0].length
                              )}
                          </div>
                        </td>
                        <td>{item[1] + " wei / sec"}</td>
                        <td>{item[2]}</td>
                        <td>
                          {item[1] > "0" ? (
                            <span className="active-span">Active</span>
                          ) : (
                            "Not Active"
                          )}
                        </td>
                      </tr>
                    ) : null;
                  })
                : null}
            </tbody>
          </table>
          {/* <h3>Unit</h3> */}
        </div>
      </div>
    );
  } else {
    return (
      <div className="db-sub">
        <h1>All streams</h1>
        <p>View all streams in the contract.</p>
        <div className="subscriber-add-box view-all">
          {/* <h3>Subscriber Address</h3> */}
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>Flow Rate</th>
                <th>Start / End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    sx={{ bgcolor: "grey.100" }}
                  />
                </td>
                <td>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    sx={{ bgcolor: "grey.100" }}
                  />
                </td>
                <td>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    sx={{ bgcolor: "grey.100" }}
                  />
                </td>
                <td>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    sx={{ bgcolor: "grey.100" }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {/* <h3>Unit</h3> */}
        </div>
      </div>
    );
  }
}
export default ViewAllIntoContract;
