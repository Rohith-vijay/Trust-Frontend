async function testSave() {
  console.log("1. Logging in as admin...");
  try {
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@trust.org', password: 'admin123' })
    });
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log("   Login Successful!");

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/plain'
    };

    console.log("2. Saving Vision Hero Title...");
    const saveRes = await fetch('http://localhost:8080/api/admin/pages/VISION_HERO_TITLE', {
      method: 'PUT',
      headers,
      body: "Empowering Communities Worldwide"
    });
    if (saveRes.ok) {
      console.log("   Saved successfully! Response text:", await saveRes.text());
    } else {
      console.error("   Failed to save!", saveRes.status);
      return;
    }

    console.log("3. Fetching all page contents to verify persistence...");
    const getRes = await fetch('http://localhost:8080/api/admin/pages/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (getRes.ok) {
      const data = await getRes.json();
      console.log("   Retrieved value:", data.VISION_HERO_TITLE);
      if (data.VISION_HERO_TITLE === "Empowering Communities Worldwide") {
        console.log("   SUCCESS: Value persisted and verified in database!");
      } else {
        console.error("   FAILURE: Expected 'Empowering Communities Worldwide' but got:", data.VISION_HERO_TITLE);
      }
    } else {
      console.error("   Failed to retrieve page contents!", getRes.status);
    }
  } catch (err) {
    console.error("Error running save test:", err);
  }
}

testSave();
