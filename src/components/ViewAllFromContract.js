import React from "react";
import { useAccount } from "wagmi";
import { createClient } from "urql";
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

function ViewAllFromContract() {
  const { address, isConnected } = useAccount();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    const API =
      "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli";

    const data_ = `
    query {
      account(id: "0x563a2ed0f4c430fd4a94d9c08a3fb08635c23efe") {
        outflows(orderBy: createdAtTimestamp, orderDirection: desc) {
          currentFlowRate
          streamedUntilUpdatedAt
          createdAtTimestamp
          receiver {
            id
          }
        }
      }
    }
  `;
    const c = createClient({
      url: API,
    });
    const result1 = await c.query(data_).toPromise();
    const finalData = result1.data.account.outflows;
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
        data.push([
          finalData[i].receiver.id,
          finalData[i].currentFlowRate,
          date,
        ]);
      }
    }
    setData(data);
    setLoading(true);
  };
  useEffect(() => {
    getData();
  });

  if (loading) {
    return (
      <div className="db-sub">
        <h1>All streams</h1>
        <p>View all streams from the contract.</p>
        <div className="subscriber-add-box view-all">
          {/* <h3>Subscriber Address</h3> */}
          <table>
            <thead>
              <tr>
                <th>To</th>
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
                              style={{ transform: "rotate(180deg)" }}
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
                        <td>{item[1]}</td>
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
        <p>View all streams from the contract.</p>
        <div className="subscriber-add-box view-all">
          {/* <h3>Subscriber Address</h3> */}
          <table>
            <thead>
              <tr>
                <th>To</th>
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
                    width="50%"
                    sx={{ bgcolor: "grey.100" }}
                  />
                </td>
                <td>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width="50%"
                    sx={{ bgcolor: "grey.100" }}
                  />
                </td>
                <td>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width="50%"
                    sx={{ bgcolor: "grey.100" }}
                  />
                </td>
                <td>
                  <Skeleton
                    animation="wave"
                    variant="rounded"
                    width="50%"
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
export default ViewAllFromContract;
