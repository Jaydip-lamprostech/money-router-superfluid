import React, { useState } from "react";
import CreateFFC from "./CreateFFC";
import DeleteFFC from "./DeleteFFC";
import UpdateFFC from "./UpdateFFC";

import "../styles/dashboard.scss";
import "../styles/subscriber.scss";
import ViewAllFromContract from "./ViewAllFromContract";

function FlowFromContract() {
  const [showCreateFlow, setCreateFlow] = useState(true);
  const [showUpdateFlow, setUpdateFlow] = useState(false);
  const [showDeleteFlow, setDeleteFlow] = useState(false);
  const [showViewFlow, setViewFlow] = useState(false);

  return (
    <div className="db-main">
      <div className="subscriber-header">
        <button
          className={
            showCreateFlow
              ? "subscriber-header-btn active"
              : "subscriber-header-btn"
          }
          onClick={() => {
            setCreateFlow(true);
            setUpdateFlow(false);
            setDeleteFlow(false);
            setViewFlow(false);
          }}
        >
          Create
        </button>
        <button
          className={
            showUpdateFlow
              ? "subscriber-header-btn active"
              : "subscriber-header-btn"
          }
          onClick={() => {
            setCreateFlow(false);
            setUpdateFlow(true);
            setDeleteFlow(false);
            setViewFlow(false);
          }}
        >
          Update
        </button>
        <button
          className={
            showDeleteFlow
              ? "subscriber-header-btn active"
              : "subscriber-header-btn"
          }
          onClick={() => {
            setCreateFlow(false);
            setUpdateFlow(false);
            setDeleteFlow(true);
            setViewFlow(false);
          }}
        >
          Delete
        </button>
        <button
          className={
            showViewFlow
              ? "subscriber-header-btn active"
              : "subscriber-header-btn"
          }
          onClick={() => {
            setCreateFlow(false);
            setUpdateFlow(false);
            setDeleteFlow(false);
            setViewFlow(true);
          }}
        >
          View All
        </button>
      </div>
      {showCreateFlow ? (
        <CreateFFC />
      ) : showUpdateFlow ? (
        <UpdateFFC />
      ) : showDeleteFlow ? (
        <DeleteFFC />
      ) : showViewFlow ? (
        <ViewAllFromContract />
      ) : null}
    </div>
  );
}

export default FlowFromContract;
