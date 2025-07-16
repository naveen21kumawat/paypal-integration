// ✅ React Frontend - src/Courses.jsx

import axios from "axios";
import { useEffect } from "react";

const PAYPAL_CLIENT_ID = "AXAq8qr5pSGasHhbqCmFWU81tocAG0N66QTLIa6mW9GB-aPsvE-mubYjwQacQt3ZWww5Rke7eBlbnAXJ";

const courses = [
  {
    title: "React Course",
    description: "52 hours of React content + projects with source code",
    price: "1",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  },
  {
    title: "Node Course",
    description: "52 hours of Node.js content + projects with source code",
    price: "2",
    image: "https://nodejs.org/static/images/logo.svg",
  },
  {
    title: "MERN Course",
    description: "Full MERN stack course with projects and source code",
    price: "300",
    image: "https://miro.medium.com/v2/resize:fit:750/1*b7zSnFs9vJhFXhZgkvlxZA.png",
  },
  {
    title: "MongoDB Course",
    description: "Learn MongoDB with 50+ hours of content and real projects",
    price: "400",
    image: "https://webimages.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png",
  },
];

const CourseCard = ({ title, description, price, image, onPayment }) => (
  <div className="bg-slate-900 text-white p-4 rounded-xl w-64 shadow-md">
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-md flex justify-center items-center h-32">
      <img src={image} alt={title} className="h-full object-contain" />
    </div>
    <h3 className="text-xl font-bold mt-4">{title}</h3>
    <p className="text-sm mt-2">{description}</p>
    <p className="mt-2 font-bold">Price: ₹{price}</p>
    <button
      onClick={() => onPayment(price, title)}
      className="mt-4 w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 rounded-md"
    >
      Buy with PayPal
    </button>
  </div>
);

const Courses = () => {
  useEffect(() => {
    loadPayPalScript(PAYPAL_CLIENT_ID);
  }, []);

  const loadPayPalScript = (clientId) =>
    new Promise((resolve) => {
      if (document.querySelector(`#paypal-sdk`)) return resolve(true);
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.id = "paypal-sdk";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const onPayment = async (price, title) => {
    try {
      const res = await axios.post("http://localhost:5000/create-order", { amount: price });
      const orderId = res.data.id;

      if (!window.paypal) {
        alert("PayPal SDK failed to load");
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
          const captureRes = await axios.post(`http://localhost:5000/capture-order/${data.orderID}`);
          alert(` Payment successful by ${captureRes.data.payer.name.given_name}`);
          container.remove();
        },
        onCancel: () => {
          alert(" Payment cancelled");
          container.remove();
        },
        onError: (err) => {
          console.error(err);
          alert(" Error during PayPal transaction");
          container.remove();
        },
      }).render("#paypal-button-container");
    } catch (error) {
      console.error("Payment error:", error.message);
      alert("Payment failed");
    }
  };

  return (
    <div className="bg-black min-h-screen px-10 py-8 text-white">
      <h2 className="text-xl text-gray-400 mb-6">
        Home &gt; Courses &gt; Computer Science
      </h2>
      <div className="flex flex-wrap gap-8 justify-start">
        {courses.map((course, index) => (
          <CourseCard key={index} onPayment={onPayment} {...course} />
        ))}
      </div>
    </div>
  );
};

export default Courses;