import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import "./AccountsPage.css";

export default function AccountsPage() {
  const { balance } = useContext(AuthContext);

  return (
    <div className="account-page">
      <h2>My Account</h2>

      <div className="account-info">
        <div className="account-item">
          <span className="label">Balance:</span>
          <span className="value"> ${balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="account-history">
        <h3>Transaction History</h3>
        <p>No transactions yet.</p> 
        {/* replace with real list of transactions */}
      </div>
    </div>
  );
}