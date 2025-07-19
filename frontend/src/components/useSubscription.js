import { useState } from "react";
import axios from "axios";

const PLAN_ID = "P-1RL929111W456384RNB4J4QQ";
const PRICE = 9.99;

export default function useSubscription() {
  const [subscribed, setSubscribed] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  const handleShowPayPal = () => setShowPayPal(true);

  const handleApprove = async (subscriptionID) => {
    try {
      const response = await axios.post("http://localhost:5000/api/save-subscription", {
        subscriptionID,
        price: PRICE,
      });

      const data = response.data.subscription;
      setSubscriptionDetails(data);
      setSubscribed(true);
    } catch (error) {
      console.error("❌ Failed to save subscription:", error);
      alert("Failed to fetch subscription details.");
    }
  };

  return {
    subscribed,
    showPayPal,
    subscriptionDetails,
    handleShowPayPal,
    handleApprove,
    PLAN_ID,
    PRICE,
  };
}
