import React, { useState } from "react";

import "./App.css";
const SERVER_URL = process.env.REACT_APP_SERVERURL;

function App() {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");
  const [expirationYear, setExpirationYear] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formattedCardNumber = cardNumber.replace(/\s/g, ""); // remove spaces from card number
    // Check if the card number passes the Luhn check Algorithm
    const isCardNumberValid = luhnCheck(formattedCardNumber);
    if (!isCardNumberValid) {
      alert("Invalid credit card number!");
      return;
    }
    const data = {
      cardNumber: formattedCardNumber,
      cvv,
      cardHolderName,
      expirationMonth,
      expirationYear,
    };

    try {
      const response = await fetch(`${SERVER_URL}/credits/savecreditinfo`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error);
      }

      const message = await response.text();
      alert(message);

      // clear the form fields
      setCardNumber("");
      setCvv("");
      setCardHolderName("");
      setExpirationMonth("");
      setExpirationYear("");
    } catch (error) {
      alert(error);
    }
  };

  function luhnCheck(cardNumber) {
    // Convert the card number to an array of digits
    const digits = cardNumber.split("").map((digit) => parseInt(digit));
    // Double every other digit, starting from the second digit from the right
    for (let i = digits.length - 2; i >= 0; i -= 2) {
      digits[i] *= 2;
      if (digits[i] > 9) {
        digits[i] -= 9;
      }
    }
    // Sum up all the digits
    const sum = digits.reduce((acc, digit) => acc + digit, 0);
    // If the sum is a multiple of 10, the card number is valid
    return sum % 10 === 0;
  }
  return (
    <form className="credit-card-form" onSubmit={handleSubmit}>
      <label>
        Card Number
        <input
          className="credit-card-input"
          type="text"
          value={cardNumber}
          onChange={(event) => {
            const { value } = event.target;
            const formattedValue = value
              .replace(/[^0-9 ]/g, "") // Only allow digits and spaces
              .replace(/\D/g, "") // Remove spaces
              .replace(/(\d{4})/g, "$1 ") // Add space after every fourth digit
              .trim(); // Remove leading/trailing spaces
            setCardNumber(formattedValue);
          }}
          pattern="(?:\d[ -]?){15}\d"
          title="Please enter a valid credit card number"
          maxLength="19" // Allow for spaces
          inputMode="numeric"
          onKeyDown={(event) => {
            // Allow only numeric input and allow deleting characters
            const { key } = event;
            if (
              key !== "Backspace" &&
              key !== "Delete" &&
              isNaN(parseInt(key, 10))
            ) {
              event.preventDefault();
            }
          }}
          required
        />
      </label>

      <label>
        CVV
        <input
          className="credit-card-input"
          type="text"
          value={cvv}
          onChange={(event) => setCvv(event.target.value)}
          pattern="\d{3}" // Allow only 3 digits
          maxLength="3"
          required
        />
      </label>
      <label>
        Cardholder Name
        <input
          className="credit-card-input"
          type="text"
          value={cardHolderName}
          onChange={(event) => setCardHolderName(event.target.value)}
          required
        />
      </label>
      <div className="expiration-date">
        <label>
          Expiration Month
          <input
            className="expiration-input"
            type="number"
            value={expirationMonth}
            onChange={(event) => setExpirationMonth(event.target.value)}
            min={new Date().getMonth() + 1}
            max="12"
            title="Please enter a 2-digit month"
            required
          />
        </label>
        <label>
          Expiration Year
          <input
            className="expiration-input"
            type="number"
            value={expirationYear}
            onChange={(event) => setExpirationYear(event.target.value)}
            min={new Date().getFullYear()}
            max={new Date().getFullYear() + 10}
            pattern="[0-9]{4}"
            title="Please enter a 4-digit year"
            required
          />
        </label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
