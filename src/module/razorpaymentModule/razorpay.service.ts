import Razorpay from "razorpay";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

// Validate Razorpay keys
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay credentials are missing in environment variables.");
}

// Create Razorpay instance
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Request body interface
interface CreateOrderRequest {
  amount: number;
}

// Inline type definition for Razorpay order options
interface RazorpayCreateOrderOptions {
  amount: number;
  currency: string;
  receipt?: string;
  notes?: Record<string, string>;
  payment_capture?: number;
}

// Controller
export const createRazorpayOrder = async (
  req: Request<{}, {}, CreateOrderRequest>,
  res: Response
): Promise<void> => {
  const { amount } = req.body;

  if (!amount || isNaN(amount)) {
    res.status(400).json({ message: "Invalid amount" });
    return;
  }

  const options: RazorpayCreateOrderOptions = {
    amount: Math.round(amount * 100), // paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
