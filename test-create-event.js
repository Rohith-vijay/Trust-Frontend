async function testCreateEvent() {
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
      'Content-Type': 'application/json'
    };

    console.log("2. Creating an Event...");
    const payload = {
      title: "Programmatic Test Event",
      description: "This is a programmatically created event to test stabilization.",
      location: "Community Hall",
      category: "Education",
      bannerUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
      eventDate: "2026-06-01T10:00:00",
      registrationDeadline: "2026-05-30T18:00:00",
      maxVolunteers: 25,
      coverImageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80",
      heroImageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80",
      subtitle: "Learning for all",
      instagramUrl: "https://instagram.com/test",
      youtubeUrl: "https://youtube.com/watch?v=test",
      facebookUrl: "https://facebook.com/test",
      externalMediaUrl: "https://example.com",
      faqs: [
        { question: "Is it free?", answer: "Yes.", displayOrder: 0 }
      ]
    };

    const res = await fetch('http://localhost:8080/api/events', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    console.log("Response status:", res.status);
    const bodyText = await res.text();
    console.log("Response body:", bodyText);
  } catch (err) {
    console.error("Error creating event:", err);
  }
}

testCreateEvent();
