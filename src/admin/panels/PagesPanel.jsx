import React, { useState } from "react";
import databaseService from "../../services/databaseService";

const PagesPanel = ({ settingInputs, setSettingInputs }) => {
  const [pageSaveStatus, setPageSaveStatus] = useState("");

  const handleSaveHistory = async () => {
    setPageSaveStatus("Saving History...");
    try {
      await databaseService.savePageContent("HISTORY_TITLE", settingInputs.HISTORY_TITLE);
      await databaseService.savePageContent("HISTORY_SUBTITLE", settingInputs.HISTORY_SUBTITLE);
      await databaseService.savePageContent("HISTORY_MILESTONES", settingInputs.HISTORY_MILESTONES);
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
      await databaseService.savePageContent("VISION_HERO_TITLE", settingInputs.VISION_HERO_TITLE);
      await databaseService.savePageContent("VISION_HERO_SUBTITLE", settingInputs.VISION_HERO_SUBTITLE);
      await databaseService.savePageContent("VISION_MISSION", settingInputs.VISION_MISSION);
      setPageSaveStatus("Vision & Mission saved successfully!");
      setTimeout(() => setPageSaveStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setPageSaveStatus("Failed to save Vision & Mission.");
    }
  };

  const handleSavePillars = async () => {
    try {
      await databaseService.savePageContent("VISION_PILLARS", settingInputs.VISION_PILLARS);
      alert("Vision Pillars saved successfully!");
    } catch (e) {
      alert("Failed to save Vision Pillars.");
    }
  };

  const handleSaveRoadmap = async () => {
    try {
      await databaseService.savePageContent("VISION_ROADMAP", settingInputs.VISION_ROADMAP);
      alert("Vision Roadmap saved successfully!");
    } catch (e) {
      alert("Failed to save Vision Roadmap.");
    }
  };

  const handleSaveImpacts = async () => {
    try {
      await databaseService.savePageContent("VISION_IMPACTS", settingInputs.VISION_IMPACTS);
      alert("Vision Impacts saved successfully!");
    } catch (e) {
      alert("Failed to save Vision Impacts.");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-brand-navy-dark mb-4">Pages Content Management</h3>
      <div className="space-y-6">
        {/* History Milestones */}
        <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm">
          <h4 className="font-bold text-brand-navy-dark mb-4 text-base">History Settings</h4>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">History Section Headline</label>
              <input
                value={settingInputs.HISTORY_TITLE}
                onChange={(e) =>
                  setSettingInputs((p) => ({ ...p, HISTORY_TITLE: e.target.value }))
                }
                className="w-full border rounded-lg px-3.5 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">History Section Subtext</label>
              <input
                value={settingInputs.HISTORY_SUBTITLE}
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
                ms = JSON.parse(settingInputs.HISTORY_MILESTONES || "[]");
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
                    <textarea
                      value={item.description || ""}
                      onChange={(e) => {
                        const newMs = ms.map((m) => ({ ...m }));
                        newMs[idx].description = e.target.value;
                        setSettingInputs((p) => ({
                          ...p,
                          HISTORY_MILESTONES: JSON.stringify(newMs),
                        }));
                      }}
                      rows={2}
                      className="w-full border rounded-lg px-3 py-1.5 text-xs outline-none bg-white resize-none focus:ring-1 focus:ring-primary/50"
                    />
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
                ms = JSON.parse(settingInputs.HISTORY_MILESTONES || "[]");
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
            <textarea
              value={settingInputs.VISION_MISSION || ""}
              onChange={(e) => setSettingInputs((p) => ({ ...p, VISION_MISSION: e.target.value }))}
              rows={3}
              className="w-full border rounded-lg px-3.5 py-2.5 text-sm outline-none bg-white resize-none focus:ring-2 focus:ring-primary/20"
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

        {/* Vision Pillars */}
        <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm">
          <h4 className="font-bold text-brand-navy-dark mb-1 text-base">Vision Pillars (JSON array structure)</h4>
          <p className="text-xs text-gray-400 mb-3 font-medium">Array format holding blocks of `title` and `desc` keys.</p>
          <textarea
            value={settingInputs.VISION_PILLARS}
            onChange={(e) => setSettingInputs((p) => ({ ...p, VISION_PILLARS: e.target.value }))}
            rows={6}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50/50 font-mono"
          />
          <button
            onClick={handleSavePillars}
            className="mt-3 bg-primary text-white px-4.5 py-2 rounded-lg text-xs font-bold hover:brightness-95 transition"
          >
            Save Pillars
          </button>
        </div>

        {/* Vision Roadmap */}
        <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm">
          <h4 className="font-bold text-brand-navy-dark mb-1 text-base">Vision Roadmap (One checklist milestone per line)</h4>
          <p className="text-xs text-gray-400 mb-3 font-medium">Enter simple plain text roadmap stages separated by standard line breaks.</p>
          <textarea
            value={settingInputs.VISION_ROADMAP}
            onChange={(e) => setSettingInputs((p) => ({ ...p, VISION_ROADMAP: e.target.value }))}
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50/50 font-mono"
          />
          <button
            onClick={handleSaveRoadmap}
            className="mt-3 bg-primary text-white px-4.5 py-2 rounded-lg text-xs font-bold hover:brightness-95 transition"
          >
            Save Roadmap
          </button>
        </div>

        {/* Vision Impacts */}
        <div className="border border-gray-100 rounded-3xl p-6 bg-white shadow-sm">
          <h4 className="font-bold text-brand-navy-dark mb-1 text-base">Vision Impacts (JSON array structure)</h4>
          <p className="text-xs text-gray-400 mb-3 font-medium">Array structure displaying `label` and `value` markers.</p>
          <textarea
            value={settingInputs.VISION_IMPACTS}
            onChange={(e) => setSettingInputs((p) => ({ ...p, VISION_IMPACTS: e.target.value }))}
            rows={5}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50/50 font-mono"
          />
          <button
            onClick={handleSaveImpacts}
            className="mt-3 bg-primary text-white px-4.5 py-2 rounded-lg text-xs font-bold hover:brightness-95 transition"
          >
            Save Impacts
          </button>
        </div>
      </div>
    </div>
  );
};

export default PagesPanel;
