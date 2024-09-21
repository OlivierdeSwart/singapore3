"use client";

import { useState } from "react";
import type { NextPage } from "next";

// import { useAccount } from "wagmi";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();
  const [message, setMessage] = useState(""); // State to hold the form input
  const [loading, setLoading] = useState(false); // Loading state for submission
  const [success, setSuccess] = useState<string | null>(null); // Success message
  const [error, setError] = useState<string | null>(null); // Error message

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) {
      alert("Please enter a message to submit.");
      return;
    }

    setLoading(true); // Set loading to true during the process
    setError(null); // Clear any previous errors
    setSuccess(null); // Clear any previous success messages

    try {
      // Call your IPFS client API here
      const response = await fetch("/api/ipfs_upload_route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }), // Send the actual message to the backend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong.");
      }

      const data = await response.json();
      setSuccess(`Uploaded to IPFS: https://bronze-worried-mackerel-385.mypinata.cloud/ipfs/${data.hash}`); // Display the IPFS hash (CID)
      setMessage(""); // Clear the message input after successful submission
    } catch (error: any) {
      setError(error.message || "Failed to upload to IPFS.");
    } finally {
      setLoading(false); // Turn off loading after the request is done
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="card bg-base-200 shadow-md p-5 w-96">
        <h2 className="card-title text-center mb-4">Submit Text</h2>

        {/* Input field for message */}
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Your Message</span>
          </label>
          <input
            type="text"
            placeholder="Type your text"
            className="input input-bordered"
            value={message} // Bind input value to state
            onChange={e => setMessage(e.target.value)} // Update state when input changes
            disabled={loading} // Disable input when loading
          />
        </div>

        {/* Display loading indicator */}
        {loading && <div className="text-center text-gray-500 mb-4">Uploading to IPFS...</div>}

        {/* Display success message */}
        {success && <div className="text-center text-green-500 mb-4">{success}</div>}

        {/* Display error message */}
        {error && <div className="text-center text-red-500 mb-4">{error}</div>}

        {/* Submit button */}
        <div className="form-control">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Home;
