import React from "react";
import "./clickUpLoginStyle.css";

const CLIENT_ID = "36KM953AC75ZFQ7H3OO1UK2RBE1DD6ER";
const REDIRECT_URI = "http://localhost:5173/callback";

const ClickUpLogin = () => {
  const handleLogin = () => {
    window.location.href = `https://app.clickup.com/api?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  };

  return (
    <button className="clickup-btn" onClick={handleLogin}>
      Conectar con ClickUp
    </button>
  );
};

export default ClickUpLogin;