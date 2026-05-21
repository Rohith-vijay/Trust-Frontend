import React from "react";

const SettingsPanel = ({ settingInputs, setSettingInputs, onSaveSetting }) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-brand-navy-dark mb-4">Site Layout Settings — Hero Section</h3>
      <div className="border border-gray-100 rounded-3xl p-6 bg-white space-y-6 shadow-sm">
        {/* Hero Image */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Hero Background Image URL</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={settingInputs.HOME_HERO_IMAGE}
              onChange={(e) =>
                setSettingInputs((p) => ({ ...p, HOME_HERO_IMAGE: e.target.value }))
              }
              placeholder="e.g. https://images.unsplash.com/photo-..."
              className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
            <button
              onClick={() => onSaveSetting("HOME_HERO_IMAGE")}
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition whitespace-nowrap"
            >
              Save Key
            </button>
          </div>
          {settingInputs.HOME_HERO_IMAGE && (
            <div className="mt-4 bg-gray-50 p-2.5 rounded-2xl border border-gray-100 inline-block">
              <p className="text-xs font-bold text-gray-400 mb-2">Live Canvas Preview:</p>
              <img
                src={settingInputs.HOME_HERO_IMAGE}
                alt="Hero banner preview"
                className="max-h-40 rounded-xl object-cover border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Hero Title */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Hero Headline Title</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={settingInputs.HOME_HERO_TITLE}
              onChange={(e) =>
                setSettingInputs((p) => ({ ...p, HOME_HERO_TITLE: e.target.value }))
              }
              placeholder="e.g. Bringing Hope and Relieving Distress."
              className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
            <button
              onClick={() => onSaveSetting("HOME_HERO_TITLE")}
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition whitespace-nowrap"
            >
              Save Key
            </button>
          </div>
        </div>

        {/* Hero Subtitle */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Hero Subtitle Paragraph</label>
          <div className="flex gap-3">
            <textarea
              value={settingInputs.HOME_HERO_SUBTITLE}
              onChange={(e) =>
                setSettingInputs((p) => ({ ...p, HOME_HERO_SUBTITLE: e.target.value }))
              }
              placeholder="e.g. Empowering vulnerable communities across clean water, education, and health camps."
              rows={2}
              className="flex-1 border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white resize-none"
            />
            <button
              onClick={() => onSaveSetting("HOME_HERO_SUBTITLE")}
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition self-start whitespace-nowrap"
            >
              Save Key
            </button>
          </div>
        </div>

        {/* CTA Button Config */}
        <div className="grid sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Hero Call to Action Text</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={settingInputs.HOME_HERO_CTA_TEXT}
                onChange={(e) =>
                  setSettingInputs((p) => ({ ...p, HOME_HERO_CTA_TEXT: e.target.value }))
                }
                placeholder="e.g. Support Our Mission"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
              <button
                onClick={() => onSaveSetting("HOME_HERO_CTA_TEXT")}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition whitespace-nowrap"
              >
                Save
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Hero Call to Action Redirect Path</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={settingInputs.HOME_HERO_CTA_LINK}
                onChange={(e) =>
                  setSettingInputs((p) => ({ ...p, HOME_HERO_CTA_LINK: e.target.value }))
                }
                placeholder="e.g. /donation"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
              <button
                onClick={() => onSaveSetting("HOME_HERO_CTA_LINK")}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition whitespace-nowrap"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 pt-3 border-t border-gray-100 font-medium">
          Note: Changes take effect on the public landing page immediately after saving keys. Refresh the home page to audit live changes.
        </p>
      </div>
    </div>
  );
};

export default SettingsPanel;
