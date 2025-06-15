import React from "react"
import "./HomePage.css"
import ControlPanel from "../components/Game/ControlCenter.js"
import GameBoard from "../components/Game/GameBoard.js"

export default function HomePage(){
    return (
        <div className="homepage">
            <ControlPanel />
            <GameBoard />
        </div>
    )
}