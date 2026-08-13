import React, { useState, useMemo } from "react";
import databaseService from "../../services/databaseService";
import RichTextEditor from "../components/RichTextEditor";
import defaultShowcaseConfig from "../../data/defaultShowcaseConfig";
import SmartImageUploader from "../../components/SmartImageUploader";

const PagesPanel = ({ settingInputs, setSettingInputs }) => {
  const [pageSaveStatus, setPageSaveStatus] = useState("");
  const [jsonErrors, setJsonErrors] = useState([]);
  const [showcaseSaveStatus, setShowcaseSaveStatus] = useState("");

  const [showcaseEditorTab, setShowcaseEditorTab] = useState("visual");
  const [visualSubTab, setVisualSubTab] = useState("hero");

  const [showcaseVersions, setShowcaseVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState("");

  const fetchShowcaseVersions = async () => {
    try {
      const data = await databaseService.getPageContentVersions("IMPACT_SHOWCASE_CONFIG");
      setShowcaseVersions(data || []);
    } catch (err) {
      console.error("[PagesPanel] Failed to load showcase config versions:", err);
    }
  };

  const parsedShowcaseConfig = useMemo(() => {
    try {
      const raw = settingInputs.IMPACT_SHOWCASE_CONFIG;
      if (!raw || raw.trim() === "" || raw.trim() === "{}") {
        return defaultShowcaseConfig;
      }
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }, [settingInputs.IMPACT_SHOWCASE_CONFIG]);

  const updateShowcasePart = (section, keyOrValue, value) => {
    try {
      let raw = settingInputs.IMPACT_SHOWCASE_CONFIG || "";
      if (!raw || raw.trim() === "" || raw.trim() === "{}") {
        raw = JSON.stringify(defaultShowcaseConfig, null, 2);
      }
      const configObj = JSON.parse(raw);
      if (keyOrValue === null) {
        configObj[section] = value;
      } else if (section) {
        if (!configObj[section]) configObj[section] = {};
        configObj[section][keyOrValue] = value;
      }
      setSettingInputs(p => ({
        ...p,
        IMPACT_SHOWCASE_CONFIG: JSON.stringify(configObj, null, 2)
      }));
      setJsonErrors([]);
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatItem = (index, key, value) => {
    try {
      let raw = settingInputs.IMPACT_SHOWCASE_CONFIG || "";
      if (!raw || raw.trim() === "" || raw.trim() === "{}") {
        raw = JSON.stringify(defaultShowcaseConfig, null, 2);
      }
      const configObj = JSON.parse(raw);
      if (!configObj.stats) configObj.stats = { items: [] };
      if (!configObj.stats.items) configObj.stats.items = [];
      if (!configObj.stats.items[index]) configObj.stats.items[index] = {};
      configObj.stats.items[index][key] = value;
      setSettingInputs(p => ({
        ...p,
        IMPACT_SHOWCASE_CONFIG: JSON.stringify(configObj, null, 2)
      }));
    } catch (e) {
      console.error(e);
    }
  };

  // ─── Database-driven Impact Showcase Cards CMS ───
  const [dbCards, setDbCards] = useState([]);
  const [deletedCardIds, setDeletedCardIds] = useState([]);

  // Fetch showcase cards and config versions on component mount
  React.useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await databaseService.getImpactShowcaseCards();
        setDbCards(data || []);
      } catch (err) {
        console.error("[PagesPanel] Failed to load database-backed showcase cards:", err);
      }
    };
    fetchCards();
    fetchShowcaseVersions();
  }, []);

  // Synchronize JSON card changes to visual dbCards state when switching back to visual mode or after template resets
  React.useEffect(() => {
    if (showcaseEditorTab === "visual") {
      try {
        const configObj = JSON.parse(settingInputs.IMPACT_SHOWCASE_CONFIG || "{}");
        if (configObj.cards && Array.isArray(configObj.cards)) {
          const mapped = configObj.cards.map((card, i) => {
            const matchedDbCard = dbCards.find(c => c.id?.toString() === card.id?.toString());
            return {
              id: matchedDbCard ? matchedDbCard.id : (card.id || "card_" + i),
              title: card.title || "",
              subtitle: card.subtitle || "Impact Initiative",
              description: card.description || "",
              baseImage: card.baseImage || "",
              revealImage: card.revealImage || "",
              metricCount: card.stat || card.metricCount || "",
              statLabel: card.statLabel || "",
              tags: Array.isArray(card.tags) ? card.tags.join(", ") : (card.tags || ""),
              accentColor: card.accentColor || "rgba(245, 158, 11, 0.18)",
              displayOrder: card.displayOrder !== undefined ? card.displayOrder : i,
              enabled: card.enabled !== false
            };
          });
          
          const serialize = (arr) => JSON.stringify(arr.map(c => ({ id: c.id?.toString(), title: c.title, subtitle: c.subtitle, description: c.description, baseImage: c.baseImage, revealImage: c.revealImage, metricCount: c.metricCount, statLabel: c.statLabel, tags: c.tags, accentColor: c.accentColor })));
          if (serialize(mapped) !== serialize(dbCards)) {
            setDbCards(mapped);
          }
        }
      } catch (e) {
        // Suppress parsing error since validateShowcaseConfig handles details
      }
    }
  }, [showcaseEditorTab, settingInputs.IMPACT_SHOWCASE_CONFIG]);

  const updateDbCardItem = (index, key, value) => {
    const copy = [...dbCards];
    if (!copy[index]) copy[index] = {};
    copy[index][key] = value;
    setDbCards(copy);
  };

  const addDbCardItem = () => {
    setDbCards([
      ...dbCards,
      {
        id: "card_temp_" + Date.now().toString(),
        title: "New Transformative Story",
        subtitle: "Impact Initiative",
        description: "How your support enabled lasting outcomes...",
        baseImage: "/impact-gallery/gallery_education_base_1779805934541.png",
        revealImage: "/impact-gallery/gallery_education_reveal_1779805956148.png",
        metricCount: "100+",
        statLabel: "Impact Reached",
        tags: "Education, Rural",
        accentColor: "rgba(245, 158, 11, 0.18)",
        displayOrder: dbCards.length,
        enabled: true
      }
    ]);
  };

  const deleteDbCardItem = (index) => {
    const cardToDelete = dbCards[index];
    if (cardToDelete && typeof cardToDelete.id === "number") {
      setDeletedCardIds([...deletedCardIds, cardToDelete.id]);
    }
    const copy = [...dbCards];
    copy.splice(index, 1);
    setDbCards(copy);
  };

  const handleSaveHistory = async () => {
    setPageSaveStatus("Saving History...");
    try {
      await databaseService.savePageContent("HISTORY_TITLE", settingInputs.HISTORY_TITLE || "");
      await databaseService.savePageContent("HISTORY_SUBTITLE", settingInputs.HISTORY_SUBTITLE || "");
      
      let milestonesData = settingInputs.HISTORY_MILESTONES || "[]";
      try {
        const parsed = JSON.parse(milestonesData);
        if (!Array.isArray(parsed)) throw new Error("Must be array");
      } catch (err) {
        console.warn("[PagesPanel] Invalid milestones JSON format. Repairing fallback...");
        milestonesData = JSON.stringify([]);
      }
      
      await databaseService.savePageContent("HISTORY_MILESTONES", milestonesData);
      setPageSaveStatus("History saved successfully!");
      setTimeout(() => setPageSaveStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setPageSaveStatus("Failed to save History.");
    }
  };

  const handleSaveVision = async () => {
    setPageSaveStatus("Saving Vision...");
    try {
      await databaseService.savePageContent("VISION_HERO_TITLE", settingInputs.VISION_HERO_TITLE || "");
      await databaseService.savePageContent("VISION_HERO_SUBTITLE", settingInputs.VISION_HERO_SUBTITLE || "");
      await databaseService.savePageContent("VISION_MISSION", settingInputs.VISION_MISSION || "");
      setPageSaveStatus("Vision & Mission saved successfully!");
      setTimeout(() => setPageSaveStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setPageSaveStatus("Failed to save Vision & Mission.");
    }
  };

  const handleSavePillars = async () => {
    try {
      let pillarsData = settingInputs.VISION_PILLARS || "[]";
      try {
        const parsed = JSON.parse(pillarsData);
        if (!Array.isArray(parsed)) throw new Error("Must be array");
      } catch (err) {
        console.warn("[PagesPanel] Invalid pillars JSON format. Repairing fallback...");
        pillarsData = JSON.stringify([]);
      }
      await databaseService.savePageContent("VISION_PILLARS", pillarsData);
      alert("Vision Pillars saved successfully!");
    } catch (e) {
      alert("Failed to save Vision Pillars.");
    }
  };

  const handleSaveRoadmap = async () => {
    try {
      await databaseService.savePageContent("VISION_ROADMAP", settingInputs.VISION_ROADMAP || "");
      alert("Vision Roadmap saved successfully!");
    } catch (e) {
      alert("Failed to save Vision Roadmap.");
    }
  };

  const handleSaveImpacts = async () => {
    try {
      let impactsData = settingInputs.VISION_IMPACTS || "[]";
      try {
        const parsed = JSON.parse(impactsData);
        if (!Array.isArray(parsed)) throw new Error("Must be array");
      } catch (err) {
        console.warn("[PagesPanel] Invalid impacts JSON format. Repairing fallback...");
        impactsData = JSON.stringify([]);
      }
      await databaseService.savePageContent("VISION_IMPACTS", impactsData);
      alert("Vision Impacts saved successfully!");
    } catch (e) {
      alert("Failed to save Vision Impacts.");
    }
  };

  // ─── Impact Showcase CMS JSON schema validator ───
  const validateShowcaseConfig = (jsonStr) => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== "object") {
        return ["Configuration must be a valid JSON object."];
      }
      const errors = [];
      const requiredKeys = ["hero", "stats", "galleryTitle", "cards", "footerCta"];
      requiredKeys.forEach(k => {
        if (!data[k]) {
          errors.push(`Missing root section key: "${k}"`);
        }
      });

      if (data.cards) {
        if (!Array.isArray(data.cards)) {
          errors.push('"cards" must be an array of objects.');
        } else {
          data.cards.forEach((card, i) => {
            if (!card.id) errors.push(`Card at index ${i} is missing "id".`);
            if (!card.title) errors.push(`Card at index ${i} ("${card.id || i}") is missing "title".`);
            if (!card.baseImage) errors.push(`Card at index ${i} ("${card.id || i}") is missing "baseImage" filepath.`);
            if (!card.revealImage) errors.push(`Card at index ${i} ("${card.id || i}") is missing "revealImage" filepath.`);
          });
        }
      }

      if (data.stats && data.stats.items) {
        if (!Array.isArray(data.stats.items)) {
          errors.push('"stats.items" must be an array of statistics.');
        }
      }

      return errors;
    } catch (err) {
      return [`JSON syntax error: ${err.message}`];
    }
  };

  const handleSaveShowcase = async () => {
    setShowcaseSaveStatus("Validating schema...");
    let configStr = settingInputs.IMPACT_SHOWCASE_CONFIG || "";
    if (!configStr || configStr.trim() === "" || configStr.trim() === "{}") {
      configStr = JSON.stringify(defaultShowcaseConfig, null, 2);
    }
    
    // In visual mode, we must first sync our local state cards back to the JSON payload before validation
    if (showcaseEditorTab === "visual") {
      try {
        const configObj = JSON.parse(configStr || "{}");
        configObj.cards = dbCards.map(card => ({
          id: card.id.toString(),
          title: card.title || "",
          subtitle: card.subtitle || "Impact Initiative",
          description: card.description || "",
          baseImage: card.baseImage || "",
          revealImage: card.revealImage || "",
          stat: card.metricCount || "",
          statLabel: card.statLabel || "",
          tags: typeof card.tags === "string" ? card.tags.split(",").map(t => t.trim()).filter(Boolean) : (Array.isArray(card.tags) ? card.tags : []),
          accentColor: card.accentColor || "rgba(245, 158, 11, 0.18)",
          enabled: card.enabled !== false && !card.deleted
        }));
        configStr = JSON.stringify(configObj, null, 2);
        setSettingInputs(p => ({
          ...p,
          IMPACT_SHOWCASE_CONFIG: configStr
        }));
      } catch (jsonErr) {
        console.error("[PagesPanel] Failed to serialize cards to JSON:", jsonErr);
      }
    }

    const errors = validateShowcaseConfig(configStr);

    if (errors.length > 0) {
      setJsonErrors(errors);
      setShowcaseSaveStatus("Validation failed. Check schema errors.");
      return;
    }

    setJsonErrors([]);
    setShowcaseSaveStatus("Saving showcase configuration and cards...");
    try {
      // 1. Determine final target cards list based on editing mode
      let finalCards = [];
      if (showcaseEditorTab === "visual") {
        finalCards = dbCards;
      } else {
        const configObj = JSON.parse(configStr);
        finalCards = (configObj.cards || []).map((card, i) => ({
          id: card.id,
          title: card.title,
          description: card.description,
          icon: card.icon || "",
          metricCount: card.stat || "",
          displayOrder: i,
          subtitle: card.subtitle || "Impact Initiative",
          baseImage: card.baseImage || "",
          revealImage: card.revealImage || "",
          statLabel: card.statLabel || "",
          tags: Array.isArray(card.tags) ? card.tags.join(", ") : (card.tags || ""),
          accentColor: card.accentColor || "rgba(245, 158, 11, 0.18)",
          enabled: card.enabled !== false && !card.deleted
        }));
      }

      // 2. Save general layout configuration settings to the page content table (with versioning)
      await databaseService.savePageContent("IMPACT_SHOWCASE_CONFIG", configStr);

      // 3. Delete deleted cards from database
      for (const id of deletedCardIds) {
        try {
          await databaseService.deleteImpactShowcaseCard(id);
        } catch (delErr) {
          console.error(`Failed to delete card #${id}:`, delErr);
        }
      }

      // 4. Create or update cards in the database
      const freshCardsList = [];
      for (let i = 0; i < finalCards.length; i++) {
        const card = finalCards[i];
        const cardData = {
          title: card.title || "",
          description: card.description || "",
          icon: card.icon || "",
          metricCount: card.metricCount || card.stat || "",
          displayOrder: i,
          subtitle: card.subtitle || "Impact Initiative",
          baseImage: card.baseImage || "",
          revealImage: card.revealImage || "",
          statLabel: card.statLabel || "",
          tags: Array.isArray(card.tags) ? card.tags.join(", ") : (card.tags || ""),
          accentColor: card.accentColor || "rgba(245, 158, 11, 0.18)",
          deleted: card.enabled === false || card.deleted === true
        };

        if (typeof card.id === "string" && (card.id.startsWith("card_temp_") || card.id.startsWith("card_"))) {
          // Create new card row
          const created = await databaseService.createImpactShowcaseCard(cardData);
          freshCardsList.push(created);
        } else {
          // Update existing card row
          const idVal = typeof card.id === "string" ? Number(card.id) : card.id;
          if (idVal && !isNaN(idVal)) {
            const updated = await databaseService.updateImpactShowcaseCard(idVal, cardData);
            freshCardsList.push(updated);
          } else {
            const created = await databaseService.createImpactShowcaseCard(cardData);
            freshCardsList.push(created);
          }
        }
      }

      // Sync state and empty delete cache
      setDbCards(freshCardsList);
      setDeletedCardIds([]);
      await fetchShowcaseVersions();

      setShowcaseSaveStatus("Showcase configuration and database cards published successfully!");
      setTimeout(() => setShowcaseSaveStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setShowcaseSaveStatus("Failed to save showcase settings or database cards.");
    }
  };

  const handleRollbackShowcase = async (versionId) => {
    if (!versionId) return;
    if (!window.confirm("Are you sure you want to roll back the showcase configuration to this version?")) return;

    setShowcaseSaveStatus("Rolling back showcase config...");
    try {
      const rolledBackValue = await databaseService.rollbackPageContent("IMPACT_SHOWCASE_CONFIG", versionId);
      setSettingInputs(p => ({
        ...p,
        IMPACT_SHOWCASE_CONFIG: rolledBackValue
      }));
      await fetchShowcaseVersions();
      setSelectedVersion("");
      setShowcaseSaveStatus("Showcase config successfully rolled back!");
      setTimeout(() => setShowcaseSaveStatus(""), 4000);
    } catch (err) {
      console.error(err);
      setShowcaseSaveStatus("Failed to roll back showcase config.");
    }
  };

  // Safe Parsing Helpers for Dynamic Form Builders
  const pillarsList = useMemo(() => {
    try {
      const parsed = JSON.parse(settingInputs.VISION_PILLARS || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }, [settingInputs.VISION_PILLARS]);

  const impactsList = useMemo(() => {
    try {
      const parsed = JSON.parse(settingInputs.VISION_IMPACTS || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }, [settingInputs.VISION_IMPACTS]);

  const roadmapList = useMemo(() => {
    return (settingInputs.VISION_ROADMAP || "")
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean);
  }, [settingInputs.VISION_ROADMAP]);

  return (
    <div>
      <h3 className="text-lg font-bold text-brand-navy-dark mb-4">Pages Content Management</h3>
      <div className="space-y-6">
        {/* Impact Showcase CMS Builder */}
        <div className="border border-amber-200 rounded-3xl p-6 bg-white shadow-premium-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] rounded-full blur-xl -mr-6 -mt-6"></div>
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4 mb-5 border-b border-gray-100 pb-4">
            <div>
              <h4 className="font-bold text-brand-navy-dark text-base flex items-center gap-2">
                <span>✨</span> Impact Showcase CMS Workspace
              </h4>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Manage your cinematic showcase sections, stats, and overlay cards visually or directly in JSON.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href="/impact-showcase" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-extrabold text-primary hover:underline bg-primary/5 hover:bg-primary/10 px-3.5 py-1.5 rounded-full transition-all"
              >
                View Live Page ↗
              </a>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl w-full max-w-sm mb-6 border border-gray-200/50">
            <button
              type="button"
              onClick={() => setShowcaseEditorTab("visual")}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all uppercase tracking-wider ${
                showcaseEditorTab === "visual"
                  ? "bg-white text-brand-navy-dark shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Visual Builder
            </button>
            <button
              type="button"
              onClick={() => setShowcaseEditorTab("json")}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all uppercase tracking-wider ${
                showcaseEditorTab === "json"
                  ? "bg-white text-brand-navy-dark shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              JSON Editor
            </button>
          </div>

          <div className="mt-4 space-y-4">
            
            {/* ── MODE 1: VISUAL BUILDER ── */}
            {showcaseEditorTab === "visual" && (
              <div className="space-y-6">
                {!parsedShowcaseConfig ? (
                  <div className="p-6 bg-rose-50 border border-rose-100 rounded-2xl text-rose-950 text-center">
                    <p className="text-sm font-black">Invalid JSON Structure Detected</p>
                    <p className="text-xs text-rose-800/80 mt-1">
                      The current configuration JSON contains syntax errors. Please switch to the **JSON Editor** tab to resolve syntax exceptions.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Sub-tabs */}
                    <div className="flex border-b border-gray-100 gap-6">
                      {[
                        { id: "hero", label: "Hero Banner" },
                        { id: "stats", label: "Statistics" },
                        { id: "cards", label: "Interactive Cards" },
                        { id: "footerCta", label: "Footer CTA" }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setVisualSubTab(t.id)}
                          className={`pb-3 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all ${
                            visualSubTab === t.id
                              ? "border-primary text-primary"
                              : "border-transparent text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* SUBTAB: HERO */}
                    {visualSubTab === "hero" && (
                      <div className="grid grid-cols-1 gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-150">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2">
                          <label className="text-xs font-black text-brand-navy-dark uppercase tracking-wider">Gating Visibility</label>
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={parsedShowcaseConfig.hero?.enabled !== false} 
                              onChange={(e) => updateShowcasePart("hero", "enabled", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                            <span className="ml-2.5 text-xs font-bold text-gray-600">{parsedShowcaseConfig.hero?.enabled !== false ? "Section Enabled" : "Section Hidden"}</span>
                          </label>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500">Eyebrow Tagline</label>
                            <input
                              type="text"
                              value={parsedShowcaseConfig.hero?.eyebrow || ""}
                              onChange={(e) => updateShowcasePart("hero", "eyebrow", e.target.value)}
                              className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500">Scroll Down Hint Label</label>
                            <input
                              type="text"
                              value={parsedShowcaseConfig.hero?.scrollLabel || ""}
                              onChange={(e) => updateShowcasePart("hero", "scrollLabel", e.target.value)}
                              className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500">Headline - Part 1 (Standard)</label>
                            <input
                              type="text"
                              value={parsedShowcaseConfig.hero?.titlePart1 || ""}
                              onChange={(e) => updateShowcasePart("hero", "titlePart1", e.target.value)}
                              className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500">Headline - Part 2 (Highlighted/Gold)</label>
                            <input
                              type="text"
                              value={parsedShowcaseConfig.hero?.titlePart2 || ""}
                              onChange={(e) => updateShowcasePart("hero", "titlePart2", e.target.value)}
                              className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-gray-500">Hero Narrative Description</label>
                          <textarea
                            value={parsedShowcaseConfig.hero?.description || ""}
                            onChange={(e) => updateShowcasePart("hero", "description", e.target.value)}
                            rows={3}
                            className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                    )}

                    {/* SUBTAB: STATS */}
                    {visualSubTab === "stats" && (
                      <div className="grid grid-cols-1 gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-150">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2">
                          <label className="text-xs font-black text-brand-navy-dark uppercase tracking-wider">Stats Section Visibility</label>
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={parsedShowcaseConfig.stats?.enabled !== false} 
                              onChange={(e) => updateShowcasePart("stats", "enabled", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                            <span className="ml-2.5 text-xs font-bold text-gray-600">{parsedShowcaseConfig.stats?.enabled !== false ? "Section Enabled" : "Section Hidden"}</span>
                          </label>
                        </div>

                        <div className="space-y-1 mb-4">
                          <label className="block text-xs font-bold text-gray-500">Stats Section Eyebrow (Tagline)</label>
                          <input
                            type="text"
                            value={parsedShowcaseConfig.stats?.eyebrow || ""}
                            onChange={(e) => updateShowcasePart("stats", "eyebrow", e.target.value)}
                            placeholder="e.g. Numbers that speak"
                            className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-400">Telemetry Numeric Indicators</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          {(parsedShowcaseConfig.stats?.items || []).map((item, idx) => (
                            <div key={idx} className="bg-white border rounded-xl p-4 space-y-2.5 shadow-sm">
                              <p className="text-[10px] font-black text-primary uppercase tracking-wider">Indicator #{idx + 1}</p>
                              
                              <div className="space-y-1">
                                <label className="block text-[9px] font-bold text-gray-400 uppercase">Label</label>
                                <input
                                  type="text"
                                  value={item.label || ""}
                                  onChange={(e) => updateStatItem(idx, "label", e.target.value)}
                                  className="w-full border rounded px-2 py-1 text-xs outline-none bg-gray-50 focus:ring-1 focus:ring-primary/50"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[9px] font-bold text-gray-400 uppercase">Value</label>
                                <input
                                  type="text"
                                  value={item.value || ""}
                                  onChange={(e) => updateStatItem(idx, "value", e.target.value)}
                                  className="w-full border rounded px-2 py-1 text-xs outline-none bg-gray-50 focus:ring-1 focus:ring-primary/50"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SUBTAB: CARDS */}
                    {visualSubTab === "cards" && (
                      <div className="grid grid-cols-1 gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-150">
                        
                        <div className="border-b border-gray-100 pb-4 mb-2 space-y-4">
                          <label className="text-xs font-black text-brand-navy-dark uppercase tracking-wider block">Gallery Typography Headers</label>
                          <div className="grid sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-gray-400 uppercase">Eyebrow Caption</label>
                              <input
                                type="text"
                                value={parsedShowcaseConfig.galleryTitle?.eyebrow || ""}
                                onChange={(e) => updateShowcasePart("galleryTitle", "eyebrow", e.target.value)}
                                className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-primary/50"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-gray-400 uppercase">Section Headline</label>
                              <input
                                type="text"
                                value={parsedShowcaseConfig.galleryTitle?.title || ""}
                                onChange={(e) => updateShowcasePart("galleryTitle", "title", e.target.value)}
                                className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-primary/50"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] font-bold text-gray-400 uppercase">Section Description</label>
                              <input
                                type="text"
                                value={parsedShowcaseConfig.galleryTitle?.description || ""}
                                onChange={(e) => updateShowcasePart("galleryTitle", "description", e.target.value)}
                                className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-primary/50"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-2 border-b border-gray-150 pb-2">
                          <label className="block text-xs font-extrabold uppercase tracking-widest text-slate-400">Interactive Overlay Cards list ({dbCards?.length || 0})</label>
                          <button
                            type="button"
                            onClick={addDbCardItem}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all"
                          >
                            ➕ Add Roster Card
                          </button>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                          {(dbCards || []).map((card, idx) => (
                            <div key={card.id || idx} className="relative p-5 border border-gray-200 rounded-2xl bg-white space-y-4 shadow-sm group">
                              <div className="absolute top-4 right-4 flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer select-none">
                                  <input 
                                    type="checkbox" 
                                    checked={card.enabled !== false && !card.deleted} 
                                    onChange={(e) => updateDbCardItem(idx, "enabled", e.target.checked)}
                                    className="sr-only peer"
                                  />
                                  <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm("Remove this showcase card permanently?")) {
                                      deleteDbCardItem(idx);
                                    }
                                  }}
                                  className="text-red-500 text-[10px] font-black hover:underline"
                                >
                                  Remove Card
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Card Identifier (id)</label>
                                  <input
                                    type="text"
                                    value={typeof card.id === "string" && card.id.startsWith("card_temp_") ? "New Card (Pending Save)" : card.id}
                                    disabled
                                    className="w-full border rounded px-3 py-1.5 text-xs outline-none bg-gray-100 text-gray-400 cursor-not-allowed focus:ring-1 focus:ring-primary/50"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Story Title</label>
                                  <input
                                    type="text"
                                    value={card.title || ""}
                                    onChange={(e) => updateDbCardItem(idx, "title", e.target.value)}
                                    className="w-full border rounded px-3 py-1.5 text-xs outline-none bg-gray-50 focus:ring-1 focus:ring-primary/50"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Subtitle / Initiative Category</label>
                                  <input
                                    type="text"
                                    value={card.subtitle || ""}
                                    onChange={(e) => updateDbCardItem(idx, "subtitle", e.target.value)}
                                    className="w-full border rounded px-3 py-1.5 text-xs outline-none bg-gray-50 focus:ring-1 focus:ring-primary/50"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Accent Color (Shading/Borders)</label>
                                  <input
                                    type="text"
                                    value={card.accentColor || ""}
                                    onChange={(e) => updateDbCardItem(idx, "accentColor", e.target.value)}
                                    placeholder="e.g. rgba(245, 158, 11, 0.18)"
                                    className="w-full border rounded px-3 py-1.5 text-xs outline-none bg-gray-50 focus:ring-1 focus:ring-primary/50"
                                  />
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase">Story Description</label>
                                <textarea
                                  value={card.description || ""}
                                  onChange={(e) => updateDbCardItem(idx, "description", e.target.value)}
                                  rows={2}
                                  className="w-full border rounded px-3 py-1.5 text-xs outline-none bg-gray-50 focus:ring-1 focus:ring-primary/50"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Badge Numeric Metric</label>
                                  <input
                                    type="text"
                                    value={card.metricCount || ""}
                                    onChange={(e) => updateDbCardItem(idx, "metricCount", e.target.value)}
                                    placeholder="e.g. 12,400+"
                                    className="w-full border rounded px-3 py-1.5 text-xs outline-none bg-gray-50 focus:ring-1 focus:ring-primary/50"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Badge Metric Label</label>
                                  <input
                                    type="text"
                                    value={card.statLabel || ""}
                                    onChange={(e) => updateDbCardItem(idx, "statLabel", e.target.value)}
                                    placeholder="e.g. Children Educated"
                                    className="w-full border rounded px-3 py-1.5 text-xs outline-none bg-gray-50 focus:ring-1 focus:ring-primary/50"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Tags (Comma-separated)</label>
                                  <input
                                    type="text"
                                    value={card.tags || ""}
                                    onChange={(e) => updateDbCardItem(idx, "tags", e.target.value)}
                                    placeholder="e.g. Education, Rural, Youth"
                                    className="w-full border rounded px-3 py-1.5 text-xs outline-none bg-gray-50 focus:ring-1 focus:ring-primary/50"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase">Display Order Index</label>
                                  <input
                                    type="number"
                                    value={card.displayOrder !== undefined ? card.displayOrder : idx}
                                    onChange={(e) => updateDbCardItem(idx, "displayOrder", Number(e.target.value))}
                                    className="w-full border rounded px-3 py-1.5 text-xs outline-none bg-gray-50 focus:ring-1 focus:ring-primary/50"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SmartImageUploader
                                  label="Base Image (Before reveal)"
                                  imageType="gallery"
                                  value={card.baseImage || ""}
                                  onUploadSuccess={(metadata) => updateDbCardItem(idx, "baseImage", metadata.secure_url)}
                                />
                                <SmartImageUploader
                                  label="Reveal Image (After hover)"
                                  imageType="gallery"
                                  value={card.revealImage || ""}
                                  onUploadSuccess={(metadata) => updateDbCardItem(idx, "revealImage", metadata.secure_url)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SUBTAB: FOOTER CTA */}
                    {visualSubTab === "footerCta" && (
                      <div className="grid grid-cols-1 gap-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-150">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2">
                          <label className="text-xs font-black text-brand-navy-dark uppercase tracking-wider">Footer CTA Section Visibility</label>
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={parsedShowcaseConfig.footerCta?.enabled !== false} 
                              onChange={(e) => updateShowcasePart("footerCta", "enabled", e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                            <span className="ml-2.5 text-xs font-bold text-gray-600">{parsedShowcaseConfig.footerCta?.enabled !== false ? "Section Enabled" : "Section Hidden"}</span>
                          </label>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500">Eyebrow / Subtitle</label>
                            <input
                              type="text"
                              value={parsedShowcaseConfig.footerCta?.subtitle || ""}
                              onChange={(e) => updateShowcasePart("footerCta", "subtitle", e.target.value)}
                              className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500">CTA Section Headline / Title</label>
                            <input
                              type="text"
                              value={parsedShowcaseConfig.footerCta?.title || ""}
                              onChange={(e) => updateShowcasePart("footerCta", "title", e.target.value)}
                              className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-gray-500">Section Description Narrative</label>
                          <textarea
                            value={parsedShowcaseConfig.footerCta?.description || ""}
                            onChange={(e) => updateShowcasePart("footerCta", "description", e.target.value)}
                            rows={3}
                            className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500">Button Text</label>
                            <input
                              type="text"
                              value={parsedShowcaseConfig.footerCta?.btnText || ""}
                              onChange={(e) => updateShowcasePart("footerCta", "btnText", e.target.value)}
                              className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-xs font-bold text-gray-500">Button Redirect Link</label>
                            <input
                              type="text"
                              value={parsedShowcaseConfig.footerCta?.btnLink || ""}
                              onChange={(e) => updateShowcasePart("footerCta", "btnLink", e.target.value)}
                              className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── MODE 2: RAW JSON EDITOR ── */}
            {showcaseEditorTab === "json" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-gray-500">Showcase Config JSON Payload</label>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Overwrite with the default template? Any unsaved edits will be lost.")) {
                          setSettingInputs(p => ({
                            ...p,
                            IMPACT_SHOWCASE_CONFIG: JSON.stringify(defaultShowcaseConfig, null, 2)
                          }));
                          setJsonErrors([]);
                        }
                      }}
                      className="text-[10px] font-black text-amber-600 hover:text-amber-800 uppercase tracking-wider"
                    >
                      Reset to Default Template
                    </button>
                  </div>

                  <textarea
                    value={settingInputs.IMPACT_SHOWCASE_CONFIG || ""}
                    onChange={(e) => {
                      setSettingInputs(p => ({ ...p, IMPACT_SHOWCASE_CONFIG: e.target.value }));
                      // Active real-time parsing to clear errors or alert
                      if (jsonErrors.length > 0) {
                        const errs = validateShowcaseConfig(e.target.value);
                        setJsonErrors(errs);
                      }
                    }}
                    placeholder="Paste or write showcase config JSON..."
                    rows={15}
                    className="w-full font-mono border border-gray-200 rounded-2xl px-4 py-3.5 text-xs outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 text-gray-800"
                  />
                </div>

                {/* Validation Errors Box */}
                {jsonErrors.length > 0 && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-950 space-y-1.5 animate-pulse">
                    <h5 className="text-xs font-black uppercase tracking-wider text-rose-700">Schema Validation Errors ({jsonErrors.length})</h5>
                    <ul className="list-disc list-inside text-[11px] font-medium space-y-0.5">
                      {jsonErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Persistent Action Save Bar */}
            <div className="border-t border-gray-150 pt-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  type="button"
                  onClick={handleSaveShowcase}
                  className="bg-primary hover:bg-amber-700 text-white px-7 py-3 rounded-xl text-xs font-black tracking-wider transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  Save & Live Publish Showcase Config
                </button>
                {showcaseSaveStatus && (
                  <span className="text-xs font-bold text-primary animate-pulse">{showcaseSaveStatus}</span>
                )}
              </div>

              {/* Version Rollback Dropdown */}
              {showcaseVersions.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-gray-500">Restore Snapshot:</label>
                  <select
                    value={selectedVersion}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedVersion(val);
                      if (val) {
                        handleRollbackShowcase(Number(val));
                      }
                    }}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none bg-white text-gray-700 font-semibold focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select past version...</option>
                    {showcaseVersions.map((v) => {
                      const date = new Date(v.createdAt).toLocaleString();
                      return (
                        <option key={v.id} value={v.id}>
                          Version {v.versionNumber} ({date})
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>

            {/* Visual Workspace Validation Errors Box */}
            {jsonErrors.length > 0 && (
              <div className="mt-5 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-950 space-y-1.5 animate-pulse">
                <h5 className="text-xs font-black uppercase tracking-wider text-rose-700">Schema Validation Errors ({jsonErrors.length})</h5>
                <ul className="list-disc list-inside text-[11px] font-medium space-y-0.5">
                  {jsonErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* History Milestones */}
        <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm">
          <h4 className="font-bold text-brand-navy-dark mb-4 text-base">History Settings</h4>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">History Section Headline</label>
              <input
                value={settingInputs.HISTORY_TITLE || ""}
                onChange={(e) =>
                  setSettingInputs((p) => ({ ...p, HISTORY_TITLE: e.target.value }))
                }
                className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">History Section Subtext</label>
              <input
                value={settingInputs.HISTORY_SUBTITLE || ""}
                onChange={(e) =>
                  setSettingInputs((p) => ({ ...p, HISTORY_SUBTITLE: e.target.value }))
                }
                className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <h5 className="font-bold text-brand-navy-dark mb-3 text-sm">Chronological Milestones</h5>
          <div className="space-y-4">
            {(() => {
              let ms = [];
              try {
                const parsed = JSON.parse(settingInputs.HISTORY_MILESTONES || "[]");
                if (Array.isArray(parsed)) ms = parsed;
              } catch (e) {
                ms = [];
              }
              return ms.map((item, idx) => (
                <div
                  key={idx}
                  className="relative p-5 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-3"
                >
                  <button
                    onClick={() => {
                      const newMs = ms.map((m) => ({ ...m }));
                      newMs.splice(idx, 1);
                      setSettingInputs((p) => ({
                        ...p,
                        HISTORY_MILESTONES: JSON.stringify(newMs),
                      }));
                    }}
                    className="absolute top-3 right-3 text-red-500 text-xs font-bold hover:underline"
                  >
                    Remove Milestone
                  </button>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500">Date/Year</label>
                      <input
                        value={item.date || ""}
                        onChange={(e) => {
                          const newMs = ms.map((m) => ({ ...m }));
                          newMs[idx].date = e.target.value;
                          setSettingInputs((p) => ({
                            ...p,
                            HISTORY_MILESTONES: JSON.stringify(newMs),
                          }));
                        }}
                        placeholder="e.g. 24 October 2025"
                        className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-gray-500">Event Title</label>
                      <input
                        value={item.event || ""}
                        onChange={(e) => {
                          const newMs = ms.map((m) => ({ ...m }));
                          newMs[idx].event = e.target.value;
                          setSettingInputs((p) => ({
                            ...p,
                            HISTORY_MILESTONES: JSON.stringify(newMs),
                          }));
                        }}
                        placeholder="e.g. Trust Founded"
                        className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500">Description Narrative</label>
                    <div className="bg-white border rounded-lg p-1">
                      <RichTextEditor
                        content={item.description || ""}
                        onChange={(html) => {
                          const newMs = ms.map((m) => ({ ...m }));
                          newMs[idx].description = html;
                          setSettingInputs((p) => ({
                            ...p,
                            HISTORY_MILESTONES: JSON.stringify(newMs),
                          }));
                        }}
                        placeholder="Milestone narrative..."
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500">Image URL (Optional)</label>
                    <input
                      value={item.imageUrl || ""}
                      onChange={(e) => {
                        const newMs = ms.map((m) => ({ ...m }));
                        newMs[idx].imageUrl = e.target.value;
                        setSettingInputs((p) => ({
                          ...p,
                          HISTORY_MILESTONES: JSON.stringify(newMs),
                        }));
                      }}
                      placeholder="https://..."
                      className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
          <button
            onClick={() => {
              let ms = [];
              try {
                const parsed = JSON.parse(settingInputs.HISTORY_MILESTONES || "[]");
                if (Array.isArray(parsed)) ms = parsed;
              } catch (e) {
                ms = [];
              }
              ms.push({ date: "", event: "", description: "", imageUrl: "" });
              setSettingInputs((p) => ({ ...p, HISTORY_MILESTONES: JSON.stringify(ms) }));
            }}
            className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition"
          >
            + Add New Milestone
          </button>
          <div className="mt-6 border-t border-gray-100 pt-4 flex items-center gap-4">
            <button
              onClick={handleSaveHistory}
              className="bg-primary text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:brightness-95 transition"
            >
              Save History Configuration
            </button>
            {pageSaveStatus && (
              <span className="text-xs font-bold text-primary animate-pulse">{pageSaveStatus}</span>
            )}
          </div>
        </div>

        {/* Vision & Mission Settings */}
        <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm">
          <h4 className="font-bold text-brand-navy-dark mb-4 text-base">Vision & Mission Settings</h4>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">Vision Hero Title</label>
              <input
                value={settingInputs.VISION_HERO_TITLE || ""}
                onChange={(e) =>
                  setSettingInputs((p) => ({ ...p, VISION_HERO_TITLE: e.target.value }))
                }
                className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">Vision Hero Subtitle</label>
              <input
                value={settingInputs.VISION_HERO_SUBTITLE || ""}
                onChange={(e) =>
                  setSettingInputs((p) => ({ ...p, VISION_HERO_SUBTITLE: e.target.value }))
                }
                className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="mb-4 space-y-1">
            <label className="block text-xs font-bold text-gray-500">Vision & Mission Statement Narrative</label>
            <RichTextEditor
              content={settingInputs.VISION_MISSION || ""}
              onChange={(html) => setSettingInputs((p) => ({ ...p, VISION_MISSION: html }))}
              placeholder="Detail your vision and mission here..."
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSaveVision}
              className="bg-primary text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:brightness-95 transition"
            >
              Save Vision & Mission
            </button>
            {pageSaveStatus && (
              <span className="text-xs font-bold text-primary animate-pulse">{pageSaveStatus}</span>
            )}
          </div>
        </div>

        {/* Vision Pillars CMS */}
        <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm">
          <h4 className="font-bold text-brand-navy-dark mb-1 text-base">Vision Pillars CMS</h4>
          <p className="text-xs text-gray-400 mb-4 font-medium">Add, configure, and maintain long-term organization pillars securely.</p>
          
          <div className="space-y-4">
            {pillarsList.map((item, idx) => (
              <div key={idx} className="relative p-5 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-3">
                <button
                  onClick={() => {
                    const newPillars = pillarsList.map(p => ({ ...p }));
                    newPillars.splice(idx, 1);
                    setSettingInputs(p => ({ ...p, VISION_PILLARS: JSON.stringify(newPillars) }));
                  }}
                  className="absolute top-3 right-3 text-red-500 text-xs font-bold hover:underline"
                >
                  Remove Pillar
                </button>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500">Pillar Title</label>
                    <input
                      value={item.title || ""}
                      onChange={(e) => {
                        const newPillars = pillarsList.map(p => ({ ...p }));
                        newPillars[idx].title = e.target.value;
                        setSettingInputs(p => ({ ...p, VISION_PILLARS: JSON.stringify(newPillars) }));
                      }}
                      placeholder="e.g. Healthcare Access"
                      className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-primary/50 font-bold text-brand-navy-dark"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500">Description Narrative</label>
                    <textarea
                      value={item.desc || ""}
                      onChange={(e) => {
                        const newPillars = pillarsList.map(p => ({ ...p }));
                        newPillars[idx].desc = e.target.value;
                        setSettingInputs(p => ({ ...p, VISION_PILLARS: JSON.stringify(newPillars) }));
                      }}
                      placeholder="Pillar descriptive narrative..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary/50 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              const newPillars = [...pillarsList, { title: "", desc: "" }];
              setSettingInputs(p => ({ ...p, VISION_PILLARS: JSON.stringify(newPillars) }));
            }}
            className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition"
          >
            + Add New Pillar
          </button>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <button
              onClick={handleSavePillars}
              className="bg-primary text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:brightness-95 transition"
            >
              Save Pillars Configuration
            </button>
          </div>
        </div>

        {/* Vision Roadmap CMS */}
        <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm">
          <h4 className="font-bold text-brand-navy-dark mb-1 text-base">Vision Roadmap CMS</h4>
          <p className="text-xs text-gray-400 mb-4 font-medium">Construct chronological checklist milestones for 5-Year roadmap stages.</p>

          <div className="space-y-3">
            {roadmapList.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-gray-50/50 p-3.5 border border-gray-200 rounded-2xl">
                <span className="text-xs font-black text-gray-400 select-none">#{idx + 1}</span>
                <input
                  value={item}
                  onChange={(e) => {
                    const newRoadmap = [...roadmapList];
                    newRoadmap[idx] = e.target.value;
                    setSettingInputs(p => ({ ...p, VISION_ROADMAP: newRoadmap.join("\n") }));
                  }}
                  placeholder="e.g. Year 1 – Expand outreach to 3 rural districts"
                  className="flex-grow border rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-primary/50 text-gray-700"
                />
                <button
                  onClick={() => {
                    const newRoadmap = [...roadmapList];
                    newRoadmap.splice(idx, 1);
                    setSettingInputs(p => ({ ...p, VISION_ROADMAP: newRoadmap.join("\n") }));
                  }}
                  className="text-red-500 text-xs font-bold hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              const newRoadmap = [...roadmapList, ""];
              setSettingInputs(p => ({ ...p, VISION_ROADMAP: newRoadmap.join("\n") }));
            }}
            className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition"
          >
            + Add Roadmap Stage
          </button>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <button
              onClick={handleSaveRoadmap}
              className="bg-primary text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:brightness-95 transition"
            >
              Save Roadmap Configuration
            </button>
          </div>
        </div>

        {/* Vision Projections CMS */}
        <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm">
          <h4 className="font-bold text-brand-navy-dark mb-1 text-base">Vision Projections CMS</h4>
          <p className="text-xs text-gray-400 mb-4 font-medium">Control the operational display stats and numeric metric target milestones.</p>

          <div className="space-y-4">
            {impactsList.map((item, idx) => (
              <div key={idx} className="relative p-5 border border-gray-200 rounded-2xl bg-gray-50/50 space-y-3">
                <button
                  onClick={() => {
                    const newImpacts = impactsList.map(i => ({ ...i }));
                    newImpacts.splice(idx, 1);
                    setSettingInputs(p => ({ ...p, VISION_IMPACTS: JSON.stringify(newImpacts) }));
                  }}
                  className="absolute top-3 right-3 text-red-500 text-xs font-bold hover:underline"
                >
                  Remove Projection
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500">Metric Value Target</label>
                    <input
                      value={item.value || ""}
                      onChange={(e) => {
                        const newImpacts = impactsList.map(i => ({ ...i }));
                        newImpacts[idx].value = e.target.value;
                        setSettingInputs(p => ({ ...p, VISION_IMPACTS: JSON.stringify(newImpacts) }));
                      }}
                      placeholder="e.g. 100k+ or ₹5Cr"
                      className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-primary/50 text-brand-navy-dark font-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-gray-500">Metric Label</label>
                    <input
                      value={item.label || ""}
                      onChange={(e) => {
                        const newImpacts = impactsList.map(i => ({ ...i }));
                        newImpacts[idx].label = e.target.value;
                        setSettingInputs(p => ({ ...p, VISION_IMPACTS: JSON.stringify(newImpacts) }));
                      }}
                      placeholder="e.g. Beneficiaries Supported"
                      className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none bg-white focus:ring-1 focus:ring-primary/50 text-gray-600 font-semibold"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              const newImpacts = [...impactsList, { label: "", value: "" }];
              setSettingInputs(p => ({ ...p, VISION_IMPACTS: JSON.stringify(newImpacts) }));
            }}
            className="mt-4 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 transition"
          >
            + Add Dynamic Projection
          </button>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <button
              onClick={handleSaveImpacts}
              className="bg-primary text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:brightness-95 transition"
            >
              Save Projections Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagesPanel;
