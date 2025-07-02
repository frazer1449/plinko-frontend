import React, {useState, useRef} from "react"
import "./HomePage.css"
import ControlPanel from "../components/Game/ControlCenter.js"
import PlinkoSketch from "../components/Game/PlinkoSketch.js"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

export default function HomePage(){
    const [betAmount, setBetAmount] = useState(0);
    const [risk, setRisk] = useState("medium");
    const [rows, setRows] = useState(10);
    const plinkoRef = useRef();
    const { balance, setBalance } = useContext(AuthContext);

    function onBet(){
        plinkoRef.current?.dropBall();
    }

    return (
        <div className="homepage">
            <ControlPanel 
                betAmount={betAmount}
                setBetAmount={setBetAmount}
                risk={risk}
                setRisk={setRisk}
                rows={rows}
                setRows={setRows}
                balance={balance}
                onBet={onBet}/>
            <PlinkoSketch 
                betAmount={betAmount}
                risk={risk}
                rows={rows}
                ref={plinkoRef}
            />
        </div>
    )
}