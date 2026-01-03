import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import axiosInstance from "../utils/axiosInstance";

const CheckoutForm = ({ total, formData, cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card === null) return;

    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/create-payment-intent", {
        total,
        email: formData.email,
      });

      const clientSecret = data.clientSecret;

      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              name: formData.fullName,
              email: formData.email,
            },
          },
        });

      if (confirmError) {
        toast.error(confirmError.message);
        setLoading(false);
      } else if (paymentIntent.status === "succeeded") {
        toast.success(`Payment Successful! ID: ${paymentIntent.id}`);

        const orderInfo = {
          email: formData.email,
          products: cartItems,
          total: total,
          paymentMethod: "Stripe",
          transactionId: paymentIntent.id,
          shippingAddress: formData,
        };

        const orderResponse = await axiosInstance.post("/orders/", orderInfo);

        if (orderResponse.status === 201) {
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cart-updated"));
          navigate("/order-success");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Something went wrong during payment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-xl bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-4 rounded-xl font-black text-white transition shadow-lg ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
        }`}
      >
        {loading ? "Processing..." : `Pay $${total.toFixed(2)} Now`}
      </button>
    </form>
  );
};

export default CheckoutForm;
