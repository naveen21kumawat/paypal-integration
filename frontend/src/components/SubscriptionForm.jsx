import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

const PAYPAL_CLIENT_ID = "YOUR_PAYPAL_CLIENT_ID"; // Sandbox or Live
const PLAN_ID = "YOUR_PAYPAL_PLAN_ID"; // From PayPal Dashboard

export default function SubscriptionForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleApprove = async (subscriptionID) => {
    try {
      await axios.post("http://localhost:5000/api/save-subscription", {
        subscriptionID,
        name,
        email,
      });
      setSubscribed(true);
    } catch (error) {
      alert("Subscription failed to save.");
      console.error(error);
    }
  };

  return (
    <div className="subscription-container" style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Subscribe to our Pharmacy Plan</h2>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "10px", width: "100%" }}
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "10px", width: "100%", marginTop: "10px" }}
        />
      </div>

      {!subscribed ? (
        <PayPalScriptProvider
          options={{
            "client-id": PAYPAL_CLIENT_ID,
            vault: true,
            intent: "subscription",
          }}
        >
          <PayPalButtons
            style={{ layout: "vertical" }}
            createSubscription={(data, actions) => {
              if (!name || !email) {
                alert("Please enter name and email first.");
                return;
              }
              return actions.subscription.create({
                plan_id: PLAN_ID,
              });
            }}
            onApprove={(data) => handleApprove(data.subscriptionID)}
            onError={(err) => console.error("PayPal Error", err)}
          />
        </PayPalScriptProvider>
      ) : (
        <p style={{ color: "green" }}>✅ Subscription successful! Thank you, {name}.</p>
      )}
    </div>
  );
}
