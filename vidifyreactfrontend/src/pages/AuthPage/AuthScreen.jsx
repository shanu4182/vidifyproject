import React, { useContext, useState } from "react";
import axios from "axios";
import API from "../../services/Api";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthScreen = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    setIsLoading(true);
    const endpoint = isRegister ? API.register : API.login;
    const payload = isRegister ? { username, email } : { email };

    try {
      const { data } = await axios.post(endpoint, payload);
      alert(data.message);
      if (data.success) {
        setStatusSuccess(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(API.verifyOtp, {
        email,
        otp,
        username: isRegister ? username : undefined,
      });
      if (data.success) {
        login(data.token);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <h1>{isRegister ? "Register" : "Login"}</h1>
      {!statusSuccess ? (
        <>
          {isRegister && (
            <div className="input-container">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          <div className="input-container">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button onClick={handleSendOtp} disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : isRegister ? "Register" : "Login"}
          </button>
        </>
      ) : (
        <>
          <div className="input-container">
            <label>OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button onClick={handleVerifyOtp} disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : "Verify OTP"}
          </button>
        </>
      )}
      {
        !statusSuccess &&      <button onClick={() => setIsRegister(!isRegister)} disabled={isLoading}>
        Switch to {isRegister ? "Login" : "Register"}
      </button>
      }

    </div>
  );
};

export default AuthScreen;
