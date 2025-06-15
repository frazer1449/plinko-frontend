import React from "react"
import {useState} from "react"
import "./SignUpModel.css"

export default function SignUpModal(props){
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");

    function handleEmailChange(e){
        setEmail(e.target.value);
    }
    function handleUsernameChange(e){
        setUsername(e.target.value);
    }
    function handlePasswordChange(e){
        setPassword(e.target.value);
    }
    function handleVerificationCodeChange(e){
        setVerificationCode(e.target.value);
    }

    async function handleSubmit(e){
        e.preventDefault();
        
        // Check Email Input
        if (!email.trim()) {
            setError("Email is required");
            return;
        }
          
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }
        
        // Check Username Input
        if (!username.trim()) {
            setError("Username is required");
            return;
        }
          
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            setError("Username must be 3-20 characters and can only contain letters, numbers, and underscores");
            return;
        }
        
        // Check Password Input
        if (!password.trim()) {
            setError("Password is required");
            return;
        }
          
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setError("");

        try {
            setStep(2)
            return;
            const response = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: email,
                  username: username,
                  password: password
                })
              });
              const data = await response.json();
            // backend returns success
              if (data.success){
                setStep(2);
              } 
            //   backend returns failure
              else {
                setError(data.message)
              }
        }catch(err){
            console.error("Error calling signup API:", err);
            setError("Server error. Please try again later.");
            return;
        }
    }

    async function handleVerify(e){
        e.preventDefault();
        
        // check verification code format
        const codeRegex = /^\d{6}$/;
        if (!codeRegex.test(verificationCode.trim())) {
            setError("Please enter a valid 6-digit code.");
            return;
        }

        setError("")

        try {
            const response =  await fetch("http://localhost:8080/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: email,
                  code: verificationCode
                })
              });
            const data = await response.json()
            if (data.success){
                props.onClose();
                setStep(1);
                setEmail("");
                setUsername("");
                setPassword("");
                setVerificationCode("");
                setError("");
            }else {
                setError(data.message || "Invalid verification code.");
                return;
            }
        }catch(err){
            console.error("Error calling signup API:", err);
            setError("Server error. Please try again later.");
            return;
        }
    }

    return (<div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-head">
                <h2>Plinko Game</h2>
                <button className="close-button" onClick={props.onClose}>×</button>
            </div>
            {step === 1 && (
            <div className="modal-body">
            {error && <div className="error-message">{error}</div>}
            <form className="signup-form" onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                type="text"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter Email"
                />

                <label>Username</label>
                <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter Username"
                />

                <label>Password</label>
                <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter Password"
                />

                <button type="submit" className="signup-submit">Sign Up</button>
            </form>

            <div className="extra-links">
                <p>Already have an account? <a href="#">Log In</a></p>
            </div>
            </div>
        )}

            {step === 2 && (
                <div className="modal-body">
                    <p style={{ marginBottom: "1rem" }}>
                        Please enter the verification code sent to your email:
                    </p>
                    {error && <div className="error-message">{error}</div>}
                    <form className="signup-form" onSubmit={handleVerify}>
                    <label>Verification Code</label>
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={handleVerificationCodeChange}
                        placeholder="Enter verification code"
                    />
                    <button type="submit" className="signup-submit">
                        Verify
                    </button>
                    </form>
              </div>
            )}
        </div>
    </div>);
}