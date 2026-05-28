
async function testAdmin() {
  console.log("1. Testing Admin Login...");
  try {
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@trust.org', password: 'admin123' })
    });
    
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
    const loginData = await loginRes.json();
    const token = loginData.data?.token || loginData.token;
    console.log("   Login Successful! Token acquired.");

    const headers = { 'Authorization': `Bearer ${token}` };

    console.log("2. Testing Admin Dashboard Metrics...");
    const statsRes = await fetch('http://localhost:8080/api/dashboard', { headers });
    if (statsRes.ok) {
      const statsData = await statsRes.json();
      console.log("   Metrics API Response:", JSON.stringify(statsData, null, 2));
    } else {
      console.error("   Metrics API: FAILED", statsRes.status);
    }

    console.log("2b. Testing Advanced Analytics Metrics...");
    const analyticsRes = await fetch('http://localhost:8080/api/admin/analytics', { headers });
    if (analyticsRes.ok) {
      const analyticsData = await analyticsRes.json();
      console.log("   Analytics API Response:", JSON.stringify(analyticsData, null, 2));
    } else {
      console.error("   Analytics API: FAILED", analyticsRes.status);
    }

    console.log("3. Testing Admin Page Content Settings...");
    const contentRes = await fetch('http://localhost:8080/api/admin/pages/all', { headers });
    if (contentRes.ok) console.log("   Page Content API: OK");
    else console.error("   Page Content API: FAILED", contentRes.status);
    
    console.log("4. Testing Admin Messages...");
    const messagesRes = await fetch('http://localhost:8080/api/messages', { headers });
    if (messagesRes.ok) console.log("   Messages API: OK");
    else console.error("   Messages API: FAILED", messagesRes.status);

    console.log("5. Testing Donations My Endpoint...");
    const myDonsRes = await fetch('http://localhost:8080/api/donations/my', { headers });
    if (myDonsRes.ok) {
      const myDonsData = await myDonsRes.json();
      console.log("   My Donations API Response:", JSON.stringify(myDonsData, null, 2));
    } else {
      console.error("   My Donations API: FAILED", myDonsRes.status);
    }

    console.log("All programmatic API tests completed.");
  } catch (err) {
    console.error("Test error:", err);
  }
}

testAdmin();
