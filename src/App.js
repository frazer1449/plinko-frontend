import logo from './logo.svg';
// import css
import './App.css';

// import components
import NavBar from "./components/NavBar/NavBar.js"
import Footer from "./components/Footer/Footer.js"

// import pages
import HomePage from "./pages/HomePage.js"
import AccountsPage from "./pages/AccountsPage.js"

// import modals
import LoginModal from "./modals/LoginModal.js"
import SignUpModal from "./modals/SignUpModal.js"

// import packages / functions
import {useState} from "react"
import {Routes, Route, useNavigate} from "react-router-dom"
import {AuthContext} from "./context/AuthContext.js"

export default function App() {
  // changed for testing purposes
  const [isLoggedIn, setLoggedIn] = useState(true);
  const [jwtToken, setJwtToken] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const [balance, setBalance] = useState(10000);

  const navigate = useNavigate();

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, jwtToken, setJwtToken, balance, setBalance }}>
      <div className="App">
        <NavBar 
          onLoginClick={() => setShowLogin(true)}
          onSignUpClick={() => setShowSignUp(true)}
          onSignOut={() => {
            setLoggedIn(false);
            setJwtToken("");
            setBalance(0);
            navigate("/")
          }}
        />
        <div className="main-content">
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/account" exact element={<AccountsPage />} />
          </Routes>
        </div>
        <Footer />
        {showLogin && 
          <LoginModal 
            onClose={() => setShowLogin(false)}
          />
        }

        {showSignUp &&
          <SignUpModal 
            onClose={() => setShowSignUp(false)}
          />
        }
      </div>
    </AuthContext.Provider>
  );
}
