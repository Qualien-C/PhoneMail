import { useState } from "react";
import "./App.css";

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const languages = [
    { name: "English", native: "English" },
    { name: "Tamil", native: "தமிழ்" },
    { name: "Hindi", native: "हिन्दी" },
    { name: "Telugu", native: "తెలుగు" },
    { name: "Kannada", native: "ಕನ್ನಡ" },
  ];

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

        <button className="continue-button">
          Continue
        </button>

        <p className="step">Step 1 of 4</p>
      </main>
    </div>
  );
}

export default App;