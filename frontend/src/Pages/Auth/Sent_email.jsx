import { useState, useRef, useEffect } from "react";
import "./OTPInput.css";

const OTPInput = ({ length = 6, onSubmit }) => {
  const [user, setUser] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('userId');
    console.log(user);
    setUser(user);
  }, []);

  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").split("").slice(0, length);
    setOtp([...pasteData, ...new Array(length - pasteData.length).fill("")]);
    inputRefs.current[pasteData.length - 1]?.focus();
  };

  return (
    <div className="otp-wrapper">
      <div className="otp-image-container">
        <img src='/src/assets/Images/OTP-IMAGE.jpg'/>
      </div>
      <div className="otp-container">
        <p style={{fontSize: '24px', fontWeight: 'bolder', marginTop: '-10px'}}>OTP Verification</p>
        <p style={{fontSize: '16px', marginTop: '-10px', marginBottom: '20px'}}>Enter otp code sent to {user}</p>
        <div className="otp-input-container">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            value={digit}
            maxLength={1}
            ref={(el) => (inputRefs.current[index] = el)}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="otp-input"
          />
        ))}
        </div>
        <p style={{fontSize: '16px', marginTop: '20px'}}>Didn't recive OTP code ?</p>
        <p style={{fontSize: '16px', marginTop: '-20px', color: '#007bff'}}>Resend OTP</p>
        <button onClick={() => onSubmit(otp.join(""))} className="otp-button">
          Verify & Proceed
        </button>
      </div>

    </div>
  );
};

export default OTPInput;