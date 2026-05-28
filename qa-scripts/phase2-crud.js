import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

async function runCRUDTest() {
  console.log("=== PHASE 2: STRICT CRUD VERIFICATION ===");
  
  // Login as admin
  const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
    email: "testadmin@trust.org",
    password: "password123",
  });
  const token = loginRes.data.data ? loginRes.data.data.token : loginRes.data.token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  console.log("\n--- TESTING SUCCESS STORY (Relational Integrity) ---");
  // 1. Create Story
  const storyPayload = {
    title: "QA Test Story",
    description: "Testing CRUD",
    published: true,
    timeline: [
      { date: "2024-01-01", title: "Day 1", description: "Started", orderIndex: 1 },
      { date: "2024-01-02", title: "Day 2", description: "Completed", orderIndex: 2 }
    ],
    metrics: [
      { label: "People Helped", value: "100", displayOrder: 1 }
    ]
  };

  let storyId;
  try {
    const res = await axios.post(`${API_BASE_URL}/success-stories`, storyPayload, config);
    storyId = res.data.data ? res.data.data.id : res.data.id;
    console.log(`[OK] Created Story ID: ${storyId}`);
  } catch (e) {
    console.error("[ERR] Failed to create story:", e.response?.data || e.message);
    return;
  }

  // 2. Fetch and Verify Relational Integrity (Metrics & Timeline)
  try {
    const res = await axios.get(`${API_BASE_URL}/success-stories/${storyId}`);
    const story = res.data.data || res.data;
    if (story.timeline.length === 2 && story.metrics.length === 1) {
      console.log("[OK] Relational data persisted correctly.");
    } else {
      console.log("[ERR] Relational data mismatch.");
    }
  } catch (e) {
    console.error("[ERR] Failed to fetch story.");
  }

  // 3. Edit Story (Remove timeline, add metric)
  try {
    storyPayload.timeline = []; // orphan removal test
    storyPayload.metrics.push({ label: "Donations", value: "$500", displayOrder: 2 });
    
    await axios.put(`${API_BASE_URL}/success-stories/${storyId}`, storyPayload, config);
    console.log("[OK] Updated Story (Removed timeline elements, added metric).");

    const res = await axios.get(`${API_BASE_URL}/success-stories/${storyId}`);
    const updatedStory = res.data.data || res.data;
    if (updatedStory.timeline.length === 0 && updatedStory.metrics.length === 2) {
      console.log("[OK] Orphan removal works. Stale data deleted successfully.");
    } else {
      console.log("[ERR] Orphan removal failed.", updatedStory.timeline.length, updatedStory.metrics.length);
    }
  } catch (e) {
    console.error("[ERR] Failed to update story:", e.response?.data || e.message);
  }

  // 4. Delete Story
  try {
    await axios.delete(`${API_BASE_URL}/success-stories/${storyId}`, config);
    console.log("[OK] Deleted Story.");
    
    // Verify it's gone
    try {
      await axios.get(`${API_BASE_URL}/success-stories/${storyId}`);
      console.log("[ERR] Story still exists after deletion!");
    } catch (e) {
      if (e.response && e.response.status === 404) {
        console.log("[OK] Cascade delete confirmed (Story is 404).");
      } else {
        console.log(`[ERR] Unexpected status after deletion: ${e.response?.status}`);
      }
    }
  } catch (e) {
    console.error("[ERR] Failed to delete story:", e.response?.data || e.message);
  }

  console.log("\n=== PHASE 2 CRUD QA COMPLETE ===");
}

runCRUDTest();
