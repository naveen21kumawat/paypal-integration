import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import useSubscription from "./useSubscription";

const PAYPAL_CLIENT_ID = "AePlNSus7RajjLF7YmjuHqJ6Dw4wNH6iQyAB8Vz9ESSSb5QDE4nwXz0VoEJiPL7mOje4cxOnGamGGZFS"; // Sandbox

export default function SubscriptionForm() {
  const {
    subscribed,
    showPayPal,
    subscriptionDetails,
    handleShowPayPal,
    handleApprove,
    PLAN_ID,
    PRICE,
  } = useSubscription();

  const styles = {
    container: { padding: "20px", maxWidth: "600px", margin: "0 auto" },
    subscribeButton: {
      padding: "10px 20px",
      backgroundColor: "#0070ba",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
    },
    detailsBox: {
      marginTop: "20px",
      background: "#f9f9f9",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 0 5px rgba(0,0,0,0.1)",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Subscribe to our Pharmacy Plan</h2>

      {!subscribed ? (
        <>
          {!showPayPal ? (
            <button onClick={handleShowPayPal} style={styles.subscribeButton}>
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
                createSubscription={(data, actions) =>
                  actions.subscription.create({ plan_id: PLAN_ID })
                }
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
            <div style={styles.detailsBox}>
              <h3>Subscription Details:</h3>
              <p><strong>ID:</strong> {subscriptionDetails.id}</p>
              <p><strong>Status:</strong> {subscriptionDetails.status}</p>
              <p><strong>Plan:</strong> {subscriptionDetails.plan_id}</p>
              <p><strong>Start:</strong> {new Date(subscriptionDetails.start_time).toLocaleString()}</p>
              <p><strong>Next Billing:</strong> {new Date(subscriptionDetails.billing_info?.next_billing_time).toLocaleString()}</p>
              <p><strong>Subscriber:</strong> {subscriptionDetails.subscriber?.name?.given_name} {subscriptionDetails.subscriber?.name?.surname}</p>
              <p><strong>Email:</strong> {subscriptionDetails.subscriber?.email_address}</p>
              <p><strong>Transaction ID:</strong> {subscriptionDetails.transaction_id || "N/A"}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
