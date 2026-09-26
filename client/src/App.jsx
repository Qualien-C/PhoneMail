import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [screen, setScreen] = useState(1);
  const [accepted, setAccepted] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const languages = [
    { name: "English", native: "English" },
    { name: "Tamil", native: "தமிழ்" },
    { name: "Hindi", native: "हिन्दी" },
    { name: "Telugu", native: "తెలుగు" },
    { name: "Kannada", native: "ಕನ್ನಡ" },
  ];

  const sendOTP = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setScreen(4);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Logged in user:", data.user);

      setScreen(5);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (screen === 1) {
    return (
      <div className="page">
        <main className="container">
          <h1>PhoneMail</h1>

          <h2>Choose your language</h2>

          <p className="description">
            Select your preferred language to continue.
          </p>

          <div className="languages">
            {languages.map((language) => (
              <button
                key={language.name}
                className={`language ${
                  selectedLanguage === language.name ? "selected" : ""
                }`}
                onClick={() => setSelectedLanguage(language.name)}
              >
                <span>{language.name}</span>
                <span className="native">{language.native}</span>
              </button>
            ))}
          </div>

          <button
            className="continue-button"
            onClick={() => setScreen(2)}
          >
            Continue
          </button>

          <p className="step">Step 1 of 4</p>
        </main>
      </div>
    );
  }

  if (screen === 2) {
    return (
      <div className="page">
        <main className="container">
          <h1>PhoneMail</h1>

          <h2>Terms & Conditions</h2>

          <p className="description">
            Please read and accept the Terms & Conditions before continuing.
          </p>

          <div className="terms">
            <p>
              By using PhoneMail, you agree to follow the terms and conditions
              of the service.
            </p>

            <p>
              Please use PhoneMail responsibly and provide accurate information
              when creating your account.
            </p>

            <p>
              You can review the complete Terms & Conditions before continuing.
            </p>
          </div>

          <label className="terms-check">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>I agree to the Terms & Conditions</span>
          </label>

          <button
            className="continue-button"
            disabled={!accepted}
            onClick={() => setScreen(3)}
          >
            Continue
          </button>

          <p className="step">Step 2 of 4</p>
        </main>
      </div>
    );
  }

  if (screen === 3) {
    return (
      <div className="page">
        <main className="container">
          <h1>PhoneMail</h1>

          <h2>Verify your phone number</h2>

          <p className="description">
            Enter your phone number to create your PhoneMail account.
          </p>

          <label className="input-label" htmlFor="phone">
            Phone number
          </label>

          <div className="phone-input">
            <span className="country-code">+91</span>

            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              placeholder="Enter phone number"
              maxLength="10"
            />
          </div>

          <p className="input-hint">
            We'll send an OTP to this number.
          </p>

          {error && <p className="error-message">{error}</p>}

          <button
            className="continue-button"
            disabled={phoneNumber.length !== 10 || loading}
            onClick={sendOTP}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          <p className="step">Step 3 of 4</p>
        </main>
      </div>
    );
  }

  if (screen === 4) {
    return (
      <div className="page">
        <main className="container">
          <h1>PhoneMail</h1>

          <h2>Enter OTP</h2>

          <p className="description">
            Enter the 6-digit OTP sent to +91 {phoneNumber}.
          </p>

          <label className="input-label" htmlFor="otp">
            OTP
          </label>

          <input
            id="otp"
            className="otp-input"
            type="tel"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            placeholder="Enter 6-digit OTP"
            maxLength="6"
          />

          {error && <p className="error-message">{error}</p>}

          <button
            className="continue-button"
            disabled={otp.length !== 6 || loading}
            onClick={verifyOTP}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <p className="step">Step 4 of 4</p>
        </main>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="page">
      <main className="container">
        <h1>PhoneMail</h1>

        <h2>Welcome to PhoneMail</h2>

        <p className="description">
          Your account has been created successfully.
        </p>

        <div className="account-info">
          <p>
            <strong>Phone number</strong>
            <br />
            +91 {user.phoneNumber}
          </p>

          <p>
            <strong>PhoneMail ID</strong>
            <br />
            {user.emailId}
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;