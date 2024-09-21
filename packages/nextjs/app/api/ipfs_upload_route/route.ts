import { NextRequest, NextResponse } from "next/server";

// Pinata API credentials from environment variables
const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;

if (!pinataApiKey || !pinataApiSecret) {
  throw new Error("Pinata API credentials are not set in environment variables.");
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json(); // Extract the text from the request body

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Prepare the payload for Pinata
    const pinataPayload = {
      pinataOptions: {
        cidVersion: 1,
      },
      pinataContent: {
        text,
      },
    };

    // Make the API call to Pinata
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: pinataApiKey!,
        pinata_secret_api_key: pinataApiSecret!,
      },
      body: JSON.stringify(pinataPayload),
    });

    // Handle Pinata response
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "Failed to upload to Pinata", details: errorData },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({ hash: data.IpfsHash }, { status: 200 });
  } catch (error: any) {
    console.error("Error uploading text to Pinata:", error.message);
    return NextResponse.json({ error: "Failed to upload to IPFS", details: error.message }, { status: 500 });
  }
}
