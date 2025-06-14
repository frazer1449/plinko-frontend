import React from "react"
import {useState} from "react"
import {Link} from "react-router-dom"
import './NavBar.css';

export default function NavBar(){
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);

    function handleSignOut(){
        setLoggedIn(false);
    }
    function handleLogin(){
        setShowLogin(true);
        setLoggedIn(true);
    }
    function handleSignUp(){
        setShowSignUp(true);
        setLoggedIn(true);
    }
    
    return (<nav>
        {/* navigation to another page => Link */}
        <Link to="/" className="logo">Plinko Game</Link>
        <div className="nav-buttons">
            {isLoggedIn ? (
                <>
                    <Link to="/account" className="account">Account</Link>
                    <button className="signout" onClick={handleSignOut}>Sign Out</button>
                </>
            ) : (
                <>
                    <button className="login" onClick={handleLogin}>Log In</button>
                    <button className="signup" onClick={handleSignUp}>Sign Up</button>
                </>
            )}
        </div>
    </nav>)
}