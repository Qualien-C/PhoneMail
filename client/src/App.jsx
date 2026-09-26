import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [screen, setScreen] = useState(1);
  const [accepted, setAccepted] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [emails, setEmails] = useState([]);
  const [view, setView] = useState("inbox");

  const [searchPhone, setSearchPhone] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);

  const [showCompose, setShowCompose] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [conversation, setConversation] = useState([]);

  const languages = [
    { name: "English", native: "English" },
    { name: "Tamil", native: "தமிழ்" },
    { name: "Hindi", native: "हिन्दी" },
    { name: "Telugu", native: "తెలుగు" },
    { name: "Kannada", native: "ಕನ್ನಡ" },
  ];

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");


  const openConversation = async (email) => {
    try {
      const response = await fetch(
        `${API_URL}/api/emails/thread/${email.threadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch conversation");
      }

      setConversation(data.emails);
      setSelectedEmail(email);

    } catch (error) {
      console.error("Conversation error:", error);
    }
  };


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


  const fetchEmails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/emails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch emails");
      }

      setEmails(data.emails || []);
    } catch (error) {
      console.error("Fetch emails error:", error);
    }
  };

  useEffect(() => {
    if (screen === 5 && token) {
      fetchEmails();
    }
  }, [screen, view]);

  // --------------------------------------------------
  // SEARCH USER
  // --------------------------------------------------

  const searchUser = async () => {
    if (searchPhone.length !== 10) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/users/search?phoneNumber=${searchPhone}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "User not found");
      }

      setSearchedUser(data.user);
      setError("");
    } catch (error) {
      setSearchedUser(null);
      setError(error.message);
    }
  };


  const sendEmail = async () => {
    if (!recipient || !body) {
      setError("Recipient and message are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipients: [recipient],
          subject,
          body,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email");
      }

      setRecipient("");
      setSubject("");
      setBody("");
      setShowCompose(false);

      await fetchEmails();
      setView("sent");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setScreen(1);
    setPhoneNumber("");
    setOtp("");
  };

  // --------------------------------------------------
  // AUTH SCREENS
  // --------------------------------------------------

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
                className={`language ${selectedLanguage === language.name ? "selected" : ""
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
            id="otp-continue-button"
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

  // --------------------------------------------------
  // HOME SCREEN
  // --------------------------------------------------

  return (
    <div className="home-page">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">
          PhoneMail
        </div>

        <button
          className="compose-button"
          onClick={() => {
            setShowCompose(true);
            setError("");
          }}
        >
          + Compose
        </button>

        <nav className="sidebar-nav">

          <button
            className={view === "inbox" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setView("inbox");
              setSelectedEmail(null);
            }}
          >
            📥 Inbox
          </button>

          <button
            className={view === "sent" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setView("sent");
              setSelectedEmail(null);
            }}
          >
            📤 Sent
          </button>

          <button
            className={view === "favorite" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setView("favorite");
              setSelectedEmail(null);
            }}
          >
            ⭐ Favorites
          </button>

          <button
            className={view === "draft" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setView("draft");
              setSelectedEmail(null);
            }}
          >
            📝 Drafts
          </button>

          <button
            className={view === "spam" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setView("spam");
              setSelectedEmail(null);
            }}
          >
            🚫 Spam
          </button>

          <button
            className={view === "trash" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setView("trash");
              setSelectedEmail(null);
            }}
          >
            🗑 Trash
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="profile-mini">
            <div className="avatar">
              {user.phoneNumber?.slice(-2) || "PM"}
            </div>

            <div>
              <strong>{user.phoneNumber}</strong>
              <span>{user.emailId}</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="home-main">

        <header className="home-header">

          <div>
            <h2>
              {view === "inbox" && "Inbox"}
              {view === "sent" && "Sent"}
              {view === "favorite" && "Favorites"}
              {view === "draft" && "Drafts"}
              {view === "spam" && "Spam"}
              {view === "trash" && "Trash"}
            </h2>

            <p>
              {user.emailId}
            </p>
          </div>

          <div className="search-container">

            <input
              type="tel"
              placeholder="Search phone number..."
              value={searchPhone}
              onChange={(e) => {
                setSearchPhone(
                  e.target.value.replace(/\D/g, "")
                );
                setSearchedUser(null);
              }}
              maxLength="10"
            />

            <button onClick={searchUser}>
              Search
            </button>

          </div>

        </header>

        {/* SEARCH RESULT */}

        {searchedUser && (
          <div className="user-result">

            <div className="avatar large">
              {searchedUser.phoneNumber.slice(-2)}
            </div>

            <div>
              <strong>
                {searchedUser.name || "PhoneMail User"}
              </strong>

              <p>
                +91 {searchedUser.phoneNumber}
              </p>

              <small>
                {searchedUser.emailId}
              </small>
            </div>

            <button
              onClick={() => {
                setRecipient(searchedUser.phoneNumber);
                setShowCompose(true);
                setSearchedUser(null);
              }}
            >
              Compose
            </button>

          </div>
        )}

        {error && (
          <p className="home-error">
            {error}
          </p>
        )}

        {/* EMAIL LIST */}

        {!selectedEmail && (
          <section className="email-list">

            {emails.length === 0 ? (
              <div className="empty-state">

                <div className="empty-icon">
                  ✉
                </div>

                <h3>
                  No emails yet
                </h3>

                <p>
                  Your conversations will appear here.
                </p>

                <button
                  onClick={() => setShowCompose(true)}
                >
                  Compose your first email
                </button>

              </div>
            ) : (
              emails.map((email) => (
                <button
                  className="email-card"
                  key={email._id}
                  onClick={() => openConversation(email)}
                >

                  <div className="email-avatar">
                    {email.sender?.slice(-2)}
                  </div>

                  <div className="email-content">

                    <div className="email-top">

                      <strong>
                        {email.sender === user.phoneNumber
                          ? `To: ${email.recipients?.join(", ")}`
                          : email.sender}
                      </strong>

                      <span>
                        {new Date(
                          email.createdAt
                        ).toLocaleDateString()}
                      </span>

                    </div>

                    <h3>
                      {email.subject || "(No subject)"}
                    </h3>

                    <p>
                      {email.body?.slice(0, 100)}
                    </p>

                  </div>

                  {email.isFavorite && (
                    <span className="favorite-star">
                      ★
                    </span>
                  )}

                </button>
              ))
            )}

          </section>
        )}

        {/* EMAIL VIEW */}

        {selectedEmail && (
          <section className="email-view">

            <button
              className="back-button"
              onClick={() => {
                setSelectedEmail(null);
                setConversation([]);
              }}
            >
              ← Back
            </button>

            <h1>
              {selectedEmail.subject || "(No subject)"}
            </h1>

            <div className="conversation-messages">

              {conversation.map((email) => (
                <div
                  key={email._id}
                  className={
                    email.sender === user.phoneNumber
                      ? "message sent"
                      : "message received"
                  }
                >

                  <div className="message-header">
                    <strong>
                      {email.sender === user.phoneNumber
                        ? "You"
                        : email.sender}
                    </strong>
                  </div>

                  <p>{email.body}</p>

                  <small>
                    {new Date(email.createdAt).toLocaleString()}
                  </small>

                </div>
              ))}

            </div>

          </section>
        )}

      </main>

      {/* COMPOSE MODAL */}

      {showCompose && (
        <div className="modal-overlay">

          <div className="compose-modal">

            <div className="compose-header">
              <h2>New Message</h2>

              <button
                onClick={() => setShowCompose(false)}
              >
                ×
              </button>
            </div>

            <label>
              To
            </label>

            <input
              type="tel"
              placeholder="Phone number"
              value={recipient}
              onChange={(e) =>
                setRecipient(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />

            <label>
              Subject
            </label>

            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
            />

            <label>
              Message
            </label>

            <textarea
              placeholder="Write your message..."
              value={body}
              onChange={(e) =>
                setBody(e.target.value)
              }
            />

            <button
              className="send-button"
              onClick={sendEmail}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Email"}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;