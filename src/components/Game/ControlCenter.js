import React, {useState} from "react"
import "./ControlCenter.css"

export default function ControlCenter({balance, betAmount, setBetAmount, risk, setRisk, rows, setRows, onBet}){
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ betAmount, risk, rows });

        if (betAmount <= 0) {
            const message = "Bet amount must be greater than zero.";
            setError(message);
            console.log(message);
            return;
        }
        
        if (betAmount > balance) {
            const message = "You cannot bet more than your current balance.";
            setError(message);
            console.log(message);
            return;
        }
        
        setError("");
        onBet();

        // TODO: Add logic here
      };

    return (<div className="control-center">
        <form onSubmit={handleSubmit}>
            <label htmlFor="bet-amount">Bet Amount</label>
            <input 
                id="bet-amount"
                name="betAmount"
                type="number"
                placeholder="Enter bet amount"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
            />

            <label htmlFor="risk">Risk</label>
            <select 
                id="risk"
                name="risk"
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <label htmlFor="rows">Rows</label>
            <select 
                id="rows"
                name="rows"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
            >
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={12}>12</option>
            </select>

            <button type="submit">Bet</button>
            </form>
            {error && <div className="error-message">{error}</div>}
    </div>)
}