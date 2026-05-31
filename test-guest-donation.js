// test-guest-donation.js
// Automated Integration QA Script for Guest Payment Flow

async function testGuestDonation() {
  console.log("=== STARTING GUEST DONATION INTEGRATION TEST ===");
  try {
    const donationPayload = {
      amount: 500,
      donorName: "Jane Doe (Guest Test)",
      donorEmail: "guest-test@example.com",
      message: "Keep up the excellent work!",
      eventId: null,
      donorPan: "ABCDE1234F",
      donorAddress: "123 Guest Way, AP, India"
    };

    console.log("1. Creating Guest Donation Record via POST /api/donations...");
    const donRes = await fetch("http://localhost:8080/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(donationPayload)
    });

    if (!donRes.ok) {
      const text = await donRes.text();
      throw new Error(`Donation initiation failed (Status: ${donRes.status}): ${text}`);
    }

    const donData = await donRes.json();
    console.log("   Success! Donation Record Created:", JSON.stringify(donData.data, null, 2));
    const donationId = donData.data.id;

    console.log(`2. Requesting Razorpay Payment Order via POST /api/payments/create-order/${donationId}...`);
    const orderRes = await fetch(`http://localhost:8080/api/payments/create-order/${donationId}`, {
      method: "POST"
    });

    if (!orderRes.ok) {
      const text = await orderRes.text();
      throw new Error(`Order creation failed (Status: ${orderRes.status}): ${text}`);
    }

    const orderData = await orderRes.json();
    console.log("   Success! Razorpay Order Created:", JSON.stringify(orderData.data, null, 2));
    const orderId = orderData.data.orderId;

    console.log("3. Verifying Mock Payment via POST /api/payments/verify...");
    const verifyPayload = {
      donationId: donationId,
      razorpayOrderId: orderId,
      razorpayPaymentId: "pay_test_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
      razorpaySignature: "sig_test_" + Math.random().toString(36).substring(2, 15)
    };

    const verifyRes = await fetch("http://localhost:8080/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(verifyPayload)
    });

    if (!verifyRes.ok) {
      const text = await verifyRes.text();
      throw new Error(`Payment verification failed (Status: ${verifyRes.status}): ${text}`);
    }

    const verifyData = await verifyRes.json();
    console.log("   Success! Payment Verified:", JSON.stringify(verifyData, null, 2));

    console.log(`4. Downloading 80G Tax Exemption PDF Receipt via GET /api/donations/${donationId}/receipt...`);
    const receiptRes = await fetch(`http://localhost:8080/api/donations/${donationId}/receipt`);
    if (!receiptRes.ok) {
      const text = await receiptRes.text();
      throw new Error(`Receipt download failed (Status: ${receiptRes.status}): ${text}`);
    }

    console.log("   Success! Receipt PDF bytes retrieved:", receiptRes.headers.get("content-type"), receiptRes.headers.get("content-disposition"));
    console.log("=== GUEST DONATION SYSTEM FULLY VERIFIED AND WORKING! ===");
  } catch (err) {
    console.error("Verification error:", err);
    process.exit(1);
  }
}

testGuestDonation();
