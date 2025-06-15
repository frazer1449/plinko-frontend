import React from "react"
import {useState} from "react"
import "./LoginModal.css"
import {useContext} from "react"
import {AuthContext} from "../context/AuthContext.js"

export default function LoginModal(props){
    const {isLoggedIn, setLoggedIn, jwtToken, setJwtToken} = useContext(AuthContext)

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function handleIdentifierChange(e){
        setIdentifier(e.target.value)
    }
    function handlePasswordChange(e){
        setPassword(e.target.value)
    }
    // props.onLoginSuccess
    async function handleSubmit(e){
        // prevent from re-render
        e.preventDefault();
        
        // trim used to get rid of trailing / preceding white spaces
        if (identifier.trim() === ""){
            setError("Please enter your email or username.");
            return;
        }
        if (password.trim() === ""){
            setError("Please enter your password.");
            return;
        }
        // clear any prev. error
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  identifier: identifier,
                  password: password
                })
              });
            
            const data = await response.json();

            if (data.success){
                setJwtToken(data.jwtToken);
                setLoggedIn(true);
                props.close()
            } else {
                setError(data.message || "Invalid credentials.");
                return
            }

        }catch(err){
            console.error("Error calling login API:", err);
            setError("Something went wrong. Please try again later.");
            return
        }
    }

    return (<div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-head">
                <h2>Plinko Game</h2>
                <button className="close-button" onClick={props.onClose}>×</button>
            </div>
            <div className="modal-body">
                {error && <div className="error-message">{error}</div>}
                <form className="login-form" onSubmit={handleSubmit}>
                    <label>Email or Username</label>
                    <input 
                        type="text" 
                        value={identifier} 
                        onChange={handleIdentifierChange} 
                        placeholder="Enter email or username" />

                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={handlePasswordChange} 
                        placeholder="Enter password" />

                    <button type="submit" className="login-submit">Log In</button>
                </form>
            </div>
            <div className="extra-links">
                <a href="#">Forgot Password</a>
                <p>Don't have an account? <a href="#">Register</a></p>
            </div>
        </div>
    </div>)
}