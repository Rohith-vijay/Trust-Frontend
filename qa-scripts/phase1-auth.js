import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const accounts = [
  { fullName: "Test Admin", email: "testadmin@trust.org", password: "password123", role: "ADMIN" },
  { fullName: "Test Donor", email: "testdonor@trust.org", password: "password123", role: "USER" },
  { fullName: "Test Volunteer", email: "testvolunteer@trust.org", password: "password123", role: "VOLUNTEER" },
  { fullName: "Test Normal User", email: "testuser@trust.org", password: "password123", role: "USER" },
];

async function runAuthQA() {
  console.log("=== PHASE 1: AUTHENTICATION & ROLE TESTING ===");
  const tokens = {};

  for (const acc of accounts) {
    console.log(`\nTesting account: ${acc.email} (${acc.role})`);
    try {
      // 1. Try to register
      try {
        await axios.post(`${API_BASE_URL}/auth/register`, acc);
        console.log(`[OK] Registered ${acc.email}`);
      } catch (e) {
        if (e.response && e.response.status === 409) {
          console.log(`[INFO] Account ${acc.email} already exists.`);
        } else {
          console.log(`[ERR] Failed to register ${acc.email}: ${e.message}`);
        }
      }

      // 2. Login
      const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: acc.email,
        password: acc.password,
      });
      tokens[acc.role] = loginRes.data.data ? loginRes.data.data.token : loginRes.data.token;
      console.log(`[OK] Logged in successfully. Token received.`);
    } catch (e) {
      console.error(`[ERR] Login failed for ${acc.email}`, e.response?.data || e.message);
    }
  }

  console.log("\n=== TESTING ROLE-BASED ROUTE PROTECTION ===");
  
  // Test Admin Route Access
  try {
    await axios.get(`${API_BASE_URL}/admin/settings`, {
      headers: { Authorization: `Bearer ${tokens.USER}` }
    });
    console.log("[ERR] Normal user was able to access /admin/settings!");
  } catch (e) {
    if (e.response && e.response.status === 403) {
      console.log("[OK] Normal user blocked from /admin/settings (403 Forbidden).");
    } else {
      console.log(`[ERR] Unexpected status for unauthorized access: ${e.response?.status}`);
    }
  }

  try {
    await axios.get(`${API_BASE_URL}/admin/settings`, {
      headers: { Authorization: `Bearer ${tokens.ADMIN}` }
    });
    console.log("[OK] Admin successfully accessed /admin/settings.");
  } catch (e) {
    console.log(`[ERR] Admin failed to access /admin/settings: ${e.message}`);
  }

  // Test Missing Token
  try {
    await axios.get(`${API_BASE_URL}/admin/settings`);
    console.log("[ERR] Unauthenticated user accessed protected route!");
  } catch (e) {
    if (e.response && e.response.status === 401) {
      console.log("[OK] Unauthenticated user blocked (401 Unauthorized).");
    } else {
      console.log(`[ERR] Unexpected status for unauthenticated access: ${e.response?.status}`);
    }
  }

  console.log("\n=== PHASE 1 ENDPOINT QA COMPLETE ===");
}

runAuthQA();
