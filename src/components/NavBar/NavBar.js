import React from "react"
import {useState} from "react"
import {Link} from "react-router-dom"
import './NavBar.css';
import {AuthContext} from "../../context/AuthContext.js"
import {useContext} from "react"

export default function NavBar(props){
    const {isLoggedIn, setLoggedIn} = useContext(AuthContext)
    const {balance } = useContext(AuthContext);
    
    return (<nav>
        <Link to="/" className="logo">Plinko Game</Link>
        {isLoggedIn && <div className="balance">Balance: ${balance}</div>}
        <div className="nav-buttons">
            {isLoggedIn ? (
                <>
                    <Link to="/account" className="nav-link account">Account</Link>
                    <button className="signout" onClick={props.onSignOut}>Sign Out</button>
                </>
            ) : (
                <>
                    <button className="login" onClick={props.onLoginClick}>Log In</button>
                    <button className="signup" onClick={props.onSignUpClick}>Sign Up</button>
                </>
            )}
        </div>
    </nav>)
}