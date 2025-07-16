// src/PayPalFunctions.js

import axios from "axios";

export const PAYPAL_CLIENT_ID = "AXAq8qr5pSGasHhbqCmFWU81tocAG0N66QTLIa6mW9GB-aPsvE-mubYjwQacQt3ZWww5Rke7eBlbnAXJ";

export const loadPayPalScript = (clientId) =>
  new Promise((resolve) => {
    if (document.querySelector("#paypal-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    script.id = "paypal-sdk";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const handlePayPalPayment = async (price, title) => {
  try {
    const res = await axios.post("http://localhost:5000/api/paypal/create-order", {
      amount: price,
    });

    const orderId = res.data.id;
    console.log(orderId)

    if (!window.paypal) {
      alert("PayPal SDK not loaded");
      return;
    }

    const existing = document.getElementById("paypal-button-container");
    if (existing) existing.remove();

    const container = document.createElement("div");
    container.id = "paypal-button-container";
    container.style.position = "fixed";
    container.style.top = "20%";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
    container.style.zIndex = "9999";
    container.style.background = "#fff";
    container.style.padding = "20px";
    container.style.borderRadius = "12px";
    document.body.appendChild(container);

    window.paypal.Buttons({
      createOrder: () => orderId,
      onApprove: async (data) => {
        const captureRes = await axios.post(
          `http://localhost:5000/api/paypal/capture-order/${data.orderID}`
        );
        const name = captureRes?.data?.payer?.name?.given_name || "User";
        alert(`✅ Payment successful by ${name}`);
        container.remove();
      },
      onCancel: () => {
        alert("⚠️ Payment cancelled");
        container.remove();
      },
      onError: (err) => {
        console.error("PayPal error:", err);
        alert("❌ Error during PayPal transaction");
        container.remove();
      },
    }).render("#paypal-button-container");
  } catch (error) {
    console.error("Payment error:", error.message);
    alert("❌ Payment failed");
  }
};
