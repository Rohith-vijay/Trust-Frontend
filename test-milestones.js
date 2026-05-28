async function testMilestones() {
  console.log("1. Logging in as admin...");
  try {
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@trust.org', password: 'admin123' })
    });
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
    const loginData = await loginRes.json();
    const token = loginData.data?.token || loginData.token;
    console.log("   Login Successful!");

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/plain'
    };

    console.log("2. Fetching existing page content...");
    const getRes = await fetch('http://localhost:8080/api/admin/pages/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!getRes.ok) throw new Error(`Fetch failed: ${getRes.status}`);
    const responseObj = await getRes.json();
    const actualData = responseObj.data || responseObj;
    console.log("   Current HISTORY_MILESTONES:", actualData.HISTORY_MILESTONES);

    console.log("3. Attempting to save new HISTORY_MILESTONES...");
    const milestones = [
      { date: "2015", event: "Founding", description: "Our NGO trust was established with a focus on education.", imageUrl: "" },
      { date: "2018", event: "1000 Lives Impacted", description: "Expanded outreach to cover over 5 villages.", imageUrl: "" },
      { date: "2024", event: "National Recognition", description: "Awarded as the most transparent local trust.", imageUrl: "" }
    ];
    const milestonesStr = JSON.stringify(milestones);

    const saveRes = await fetch('http://localhost:8080/api/admin/pages/HISTORY_MILESTONES', {
      method: 'PUT',
      headers,
      body: milestonesStr
    });
    
    console.log("   Save status:", saveRes.status);
    const bodyText = await saveRes.text();
    console.log("   Save response body:", bodyText);

    if (saveRes.ok) {
      console.log("   SUCCESS: Milestones saved successfully!");
    } else {
      console.error("   FAILURE: Could not save milestones!");
    }
  } catch (err) {
    console.error("Error in milestone test:", err);
  }
}

testMilestones();
