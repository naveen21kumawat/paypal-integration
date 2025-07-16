import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

const initialOptions = {
  "client-id": "YOUR_PAYPAL_CLIENT_ID",
  vault: true,
  intent: "subscription",
};

export default function SubscriptionButton({ userId }) {
  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createSubscription={(data, actions) => {
          return actions.subscription.create({
            plan_id: "YOUR_PAYPAL_PLAN_ID", // Static or from backend
          });
        }}
        onApprove={async (data, actions) => {
          await axios.post("http://localhost:5000/api/save-subscription", {
            subscriptionID: data.subscriptionID,
            userId,
          });
          alert("Subscription successful!");
        }}
      />
    </PayPalScriptProvider>
  );
}
