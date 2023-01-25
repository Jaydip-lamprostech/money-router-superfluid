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
     
      flowUpdatedEvents(
        where: {receiver: "0x563a2ed0f4c430fd4a94d9c08a3fb08635c23efe"}
        orderBy: timestamp
        orderDirection: desc
      ) {
        sender
        stream {
          currentFlowRate
        }
        timestamp
        flowRate
        totalAmountStreamedUntilTimestamp
        oldFlowRate
      }
    }
  `;
    const c = createClient({
      url: API,
    });
    const result1 = await c.query(data_).toPromise();
    const finalData = result1.data.flowUpdatedEvents;
    console.log("finalData");
    console.log(finalData);
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
        const response = await daix.getFlow({
          sender: address,
          receiver: "0x563a2ED0F4c430FD4A94D9C08a3fB08635C23eFE",
          providerOrSigner: signer,
        });
        let active;
        if (
          response.deposit === "0" &&
          response.owedDeposit === "0" &&
          response.flowRate === "0"
        ) {
          active = "Not Active";
        } else {
          active = "Active";
        }
        // loop over query response
        for (let i = 0; i < finalData.length; i++) {
          const converted = new Date(parseInt(finalData[i].timestamp) * 1000);
          const date =
            String(converted.getDate()) +
            "/" +
            String(converted.getMonth() + 1) +
            "/" +
            String(converted.getFullYear());

          if (!data.find((item) => finalData[i].timestamp === item[3])) {
            // let check = true;
            // for (let i = 0; i < data.length; i++) {
            //   if (data[i].includes(finalData[i].sender)) {
            //     check = false;
            //   }
            // }
            if (finalData[i].stream["currentFlowRate"] !== "0") {
              data.push([
                finalData[i].flowRate,
                date,
                active,
                finalData[i].timestamp,
                finalData[i].sender,
              ]);
            } else {
              data.push([
                finalData[i].flowRate,
                date,
                "Not Active",
                finalData[i].timestamp,
                finalData[i].sender,
              ]);
            }
          }
        }
        setData(data);
        setLoading(true);
      }
    } catch (error) {
      console.log(error);
    }
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
                        <td>{item[4]}</td>
                        <td>{item[0]}</td>
                        <td>{item[1]}</td>
                        <td>{item[2]}</td>
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
