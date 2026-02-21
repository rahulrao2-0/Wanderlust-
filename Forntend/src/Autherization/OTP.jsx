import React, { use, useState } from "react";
import "./OTP.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../PropertyDetails/AuthContext";
const OTP = ({ email,  onResend }) => {
    const Navigate = useNavigate();
    const{checkAuth} = useAuth();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleOtpChange = (e) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setOtp(value);
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");

        if (otp.length !== 6) {
            setError("Please enter a 6-digit OTP");
            return;
        }

        setLoading(true);
        try {
            console.log("Attempting to verify OTP:", otp);
           const res = await fetch(
          `http://localhost:5000/api/auth/verify-email/${otp}`,
          { method: "POST",
            credentials: "include"
           }
        );
        const result = await res.json();
        if (result.success) {
            alert("Email verified successfully!");
            await checkAuth(); // Update auth state in context
            Navigate("/")
        } else {
            throw new Error(result.message || "Invalid OTP. Please try again.");       
        }
        } catch (err) {
            setError(err.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError("");
        setOtp("");
        setLoading(true);
        try {
            await onResend();
        } catch (err) {
            setError("Failed to resend OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="otp-container">
            <div className="otp-card">
                <h2>Verify Your Email</h2>
                <p className="otp-email">We sent a code to {email}</p>

                <form onSubmit={handleVerify}>
                    <div className="otp-form-group">
                        <label htmlFor="otp">Enter OTP Code</label>
                        <input
                            type="text"
                            id="otp"
                            className="otp-input"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="000000"
                            maxLength="6"
                            disabled={loading}
                        />
                        <p className="otp-hint">6-digit code</p>
                    </div>

                    {error && <div className="otp-error">{error}</div>}

                    <button
                        type="submit"
                        className="otp-verify-btn"
                        disabled={loading || otp.length !== 6}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <div className="otp-footer">
                    <p>
                        Didn't receive the code?{" "}
                        <button
                            type="button"
                            className="otp-resend-btn"
                            onClick={handleResend}
                            disabled={loading}
                        >
                            Resend OTP
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OTP;
