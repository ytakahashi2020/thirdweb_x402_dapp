"use client";

import { useState } from "react";
import { createThirdwebClient } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { wrapFetchWithPayment } from "thirdweb/x402";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export default function Home() {
  const [freeData, setFreeData] = useState<any>(null);
  const [paidData, setPaidData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create MetaMask wallet
      const metamaskWallet = createWallet("io.metamask");
      const account = await metamaskWallet.connect({ client });

      console.log("Wallet connected:", account);

      // Get the wallet address
      const address = account.address;
      console.log("Wallet address:", address);

      setWallet(metamaskWallet);
      setWalletAddress(address);
      setIsConnected(true);
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
      console.error("Connection error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFreeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:3001/api/free");
      const data = await response.json();

      setFreeData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch free data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaidData = async () => {
    if (!wallet) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching paid data with wallet:", walletAddress);

      // Wrap fetch with payment functionality
      const fetchWithPay = wrapFetchWithPayment(
        fetch,
        client,
        wallet,
        BigInt(1 * 10 ** 6) // max 1 USDC
      );

      console.log("Making request to paid endpoint...");
      const response = await fetchWithPay("http://localhost:3001/api/paid-data");
      console.log("Response received:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      setPaidData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch paid data");
      console.error("Fetch paid data error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Thirdweb x402 Demo
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Wallet Connection</h2>

          {!isConnected ? (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
            >
              {loading ? "Connecting..." : "Connect MetaMask"}
            </button>
          ) : (
            <div>
              <div className="text-green-600 font-semibold mb-2">
                ✓ Wallet Connected
              </div>
              <div className="text-sm text-gray-600 font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Free Endpoint</h2>
            <p className="text-gray-600 mb-4">
              This endpoint does not require payment
            </p>

            <button
              onClick={fetchFreeData}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded disabled:opacity-50 mb-4"
            >
              {loading ? "Loading..." : "Fetch Free Data"}
            </button>

            {freeData && (
              <div className="bg-gray-100 p-4 rounded">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(freeData, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Paid Endpoint</h2>
            <p className="text-gray-600 mb-4">
              This endpoint requires payment (0.01 USDC)
            </p>

            <button
              onClick={fetchPaidData}
              disabled={loading || !isConnected}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded disabled:opacity-50 mb-4"
            >
              {loading ? "Loading..." : "Fetch Paid Data"}
            </button>

            {paidData && (
              <div className="bg-gray-100 p-4 rounded">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(paidData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </main>
  );
}
