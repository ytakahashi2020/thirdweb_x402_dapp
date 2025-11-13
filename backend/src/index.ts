import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createThirdwebClient } from "thirdweb";
import { settlePayment, facilitator } from "thirdweb/x402";
import { baseSepolia } from "thirdweb/chains";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Thirdweb client setup
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

const thirdwebFacilitator = facilitator({
  client,
  serverWalletAddress: process.env.SERVER_WALLET_ADDRESS!,
});

// Free endpoint (no payment required)
app.get("/api/free", (req: Request, res: Response) => {
  res.json({ message: "This is a free endpoint, no payment required!" });
});

// Paid endpoint (requires payment)
app.get("/api/paid-data", async (req: Request, res: Response) => {
  try {
    console.log("Received request to paid endpoint");
    console.log("Headers:", req.headers);
    console.log("X-PAYMENT header:", req.headers['x-payment']);
    console.log("Has X-PAYMENT:", !!req.headers['x-payment']);

    // Attempt to settle payment
    const result = await settlePayment({
      resourceUrl: `http://localhost:${PORT}/api/paid-data`, // The URL of this resource
      method: req.method,
      paymentData: req.headers["x-payment"] as string | undefined,
      payTo: process.env.SERVER_WALLET_ADDRESS!,
      network: baseSepolia, // Base Sepolia Testnet
      price: "$0.01", // 0.01 USD in USDC
      facilitator: thirdwebFacilitator,
      routeConfig: {
        description: "Access to premium API content",
        mimeType: "application/json",
        maxTimeoutSeconds: 300,
      },
    });

    console.log("Payment settlement result:", result);

    // Check if payment was actually settled (status 200) or if it's a 402 response
    if (result.status === 402) {
      console.log("Returning 402 Payment Required response");
      return res.status(402)
        .set(result.responseHeaders)
        .json(result.responseBody);
    }

    // If settlement was successful, return the data
    console.log("Payment settled successfully!");
    res.json({
      message: "Payment successful! Here is your premium data.",
      data: {
        premium: true,
        timestamp: new Date().toISOString(),
        info: "This is exclusive paid content accessible only after payment.",
      },
      payment: {
        settled: true,
      },
    });
  } catch (error: any) {
    console.error("Payment settlement error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
      name: error.name,
    });

    // Check if this is a 402 Payment Required error that should be returned
    if (error.status === 402 || error.statusCode === 402) {
      console.log("Returning 402 Payment Required");
      return res.status(402).json(error.body || error);
    }

    res.status(500).json({
      error: "Payment settlement failed",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Free endpoint: http://localhost:${PORT}/api/free`);
  console.log(`Paid endpoint: http://localhost:${PORT}/api/paid-data`);
});
