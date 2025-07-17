import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

// PayPal sandbox credentials (client ID and plan ID)
const PAYPAL_CLIENT_ID = "AePlNSus7RajjLF7YmjuHqJ6Dw4wNH6iQyAB8Vz9ESSSb5QDE4nwXz0VoEJiPL7mOje4cxOnGamGGZFS";
const PLAN_ID = "P-1RL929111W456384RNB4J4QQ";
const PRICE = 9.99;

export default function SubscriptionForm() {
  const [subscribed, setSubscribed] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  const handleApprove = async (subscriptionID) => {
    try {
      const response = await axios.post("http://localhost:5000/api/save-subscription", {
        subscriptionID,
        price: PRICE,
      });

      const data = response.data.subscription;
      console.log(data)
      setSubscriptionDetails(data);
      setSubscribed(true);
    } catch (error) {
      alert("Failed to fetch subscription details.");
      console.error("❌ Error from backend:", error?.response?.data || error.message);
    }
  };

  return (
    <div className="subscription-container" style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Subscribe to our Pharmacy Plan</h2>

      {!subscribed ? (
        <>
          {!showPayPal ? (
            <button
              onClick={() => setShowPayPal(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#0070ba",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Subscribe ₹{PRICE}
            </button>
          ) : (
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
                  return actions.subscription.create({
                    plan_id: PLAN_ID,
                  });
                }}
                onApprove={(data) => handleApprove(data.subscriptionID)}
                onError={(err) => console.error("PayPal Error", err)}
              />
            </PayPalScriptProvider>
          )}
        </>
      ) : (
        <>
          <p style={{ color: "green" }}>✅ Subscription successful!</p>
          {subscriptionDetails && (
            <div style={{ marginTop: "20px", background: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
              <h3>Subscription Details:</h3>
              <p><strong>ID:</strong> {subscriptionDetails.id}</p>
              <p><strong>Status:</strong> {subscriptionDetails.status}</p>
              <p><strong>Plan:</strong> {subscriptionDetails.plan_id}</p>
              <p><strong>Start:</strong> {new Date(subscriptionDetails.start_time).toLocaleString()}</p>
              <p><strong>Next Billing:</strong> {new Date(subscriptionDetails.billing_info?.next_billing_time).toLocaleString()}</p>
              <p><strong>Subscriber:</strong> {subscriptionDetails.subscriber?.name?.given_name} {subscriptionDetails.subscriber?.name?.surname}</p>
              <p><strong>Email:</strong> {subscriptionDetails.subscriber?.email_address}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
