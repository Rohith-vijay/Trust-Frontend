import React from "react";
import SmartImageUploader from "../../components/SmartImageUploader";

const SettingsPanel = ({ settingInputs, setSettingInputs, onSaveSetting }) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-brand-navy-dark mb-4">Site Layout Settings — Hero Section</h3>
      <div className="border border-gray-100 rounded-3xl p-6 bg-white space-y-6 shadow-sm">
        
        {/* 1. Hero Background Image */}
        <div className="space-y-2">
          <SmartImageUploader
            imageType="hero"
            label="Upload & Crop Hero Background Image"
            value={settingInputs.HOME_HERO_IMAGE}
            onUploadSuccess={(metadata) => {
              setSettingInputs((p) => ({ ...p, HOME_HERO_IMAGE: metadata.secure_url }));
            }}
          />
          <label className="block text-[10px] font-semibold text-gray-500 pt-1">Or Hero Background Image URL</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={settingInputs.HOME_HERO_IMAGE}
              onChange={(e) =>
                setSettingInputs((p) => ({ ...p, HOME_HERO_IMAGE: e.target.value }))
              }
              placeholder="e.g. /hero-bg-clean.jpg"
              className="flex-grow border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
            <button
              onClick={() => onSaveSetting("HOME_HERO_IMAGE")}
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition whitespace-nowrap w-full sm:w-auto"
            >
              Save Image
            </button>
          </div>
          {settingInputs.HOME_HERO_IMAGE && (
            <div className="mt-4 bg-gray-50 p-2.5 rounded-2xl border border-gray-100 inline-block">
              <p className="text-xs font-bold text-gray-400 mb-2">Live Canvas Preview:</p>
              <img
                src={settingInputs.HOME_HERO_IMAGE}
                alt="Hero background preview"
                className="max-h-40 rounded-xl object-cover border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* 2. Hero Overlay Opacity */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Overlay Opacity (0.0 to 1.0)</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={settingInputs.HOME_HERO_OPACITY}
              onChange={(e) =>
                setSettingInputs((p) => ({ ...p, HOME_HERO_OPACITY: e.target.value }))
              }
              placeholder="e.g. 0.35"
              className="flex-grow border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
            <button
              onClick={() => onSaveSetting("HOME_HERO_OPACITY")}
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition whitespace-nowrap w-full sm:w-auto"
            >
              Save Opacity
            </button>
          </div>
        </div>

        {/* 3. Hero Headline Title */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Hero Headline Title</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={settingInputs.HOME_HERO_TITLE}
              onChange={(e) =>
                setSettingInputs((p) => ({ ...p, HOME_HERO_TITLE: e.target.value }))
              }
              placeholder="e.g. TOGETHER, WE CAN BUILD A BETTER TOMORROW"
              className="flex-grow border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
            <button
              onClick={() => onSaveSetting("HOME_HERO_TITLE")}
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition whitespace-nowrap w-full sm:w-auto"
            >
              Save Title
            </button>
          </div>
        </div>

        {/* 4. Hero Headline Highlight Phrase */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Headline Highlight Phrase (Gold Gradient)</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={settingInputs.HOME_HERO_HIGHLIGHT}
              onChange={(e) =>
                setSettingInputs((p) => ({ ...p, HOME_HERO_HIGHLIGHT: e.target.value }))
              }
              placeholder="e.g. A BETTER TOMORROW"
              className="flex-grow border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            />
            <button
              onClick={() => onSaveSetting("HOME_HERO_HIGHLIGHT")}
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition whitespace-nowrap w-full sm:w-auto"
            >
              Save Highlight
            </button>
          </div>
          <p className="text-[10px] text-gray-400">Specify a phrase within the title to highlight it with the golden theme color.</p>
        </div>

        {/* 5. Hero Subtitle/Description Paragraph */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">Hero Description Paragraph</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <textarea
              value={settingInputs.HOME_HERO_SUBTITLE}
              onChange={(e) =>
                setSettingInputs((p) => ({ ...p, HOME_HERO_SUBTITLE: e.target.value }))
              }
              placeholder="e.g. Empowering vulnerable communities across clean water, education, and health camps."
              rows={3}
              className="flex-grow border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white resize-none"
            />
            <button
              onClick={() => onSaveSetting("HOME_HERO_SUBTITLE")}
              className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition self-start whitespace-nowrap w-full sm:w-auto"
            >
              Save Desc
            </button>
          </div>
        </div>

        {/* 6. Primary CTA Buttons Config */}
        <div className="grid sm:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Primary CTA Button Text</label>
            <div className="flex flex-col sm:flex-row gap-3">
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
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition whitespace-nowrap w-full sm:w-auto"
              >
                Save
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Primary CTA Redirect Path</label>
            <div className="flex flex-col sm:flex-row gap-3">
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
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition whitespace-nowrap w-full sm:w-auto"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* 7. Secondary CTA Buttons Config */}
        <div className="grid sm:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Secondary CTA Button Text</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={settingInputs.HOME_HERO_SECONDARY_TEXT}
                onChange={(e) =>
                  setSettingInputs((p) => ({ ...p, HOME_HERO_SECONDARY_TEXT: e.target.value }))
                }
                placeholder="e.g. JOIN US IN MAKING A DIFFERENCE"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
              <button
                onClick={() => onSaveSetting("HOME_HERO_SECONDARY_TEXT")}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition whitespace-nowrap w-full sm:w-auto"
              >
                Save
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Secondary CTA Redirect Path</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={settingInputs.HOME_HERO_SECONDARY_LINK}
                onChange={(e) =>
                  setSettingInputs((p) => ({ ...p, HOME_HERO_SECONDARY_LINK: e.target.value }))
                }
                placeholder="e.g. /volunteer"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              />
              <button
                onClick={() => onSaveSetting("HOME_HERO_SECONDARY_LINK")}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:brightness-95 transition whitespace-nowrap w-full sm:w-auto"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* 8. Bottom Stats Bar Config */}
        <div className="border-t border-gray-100 pt-4 space-y-4">
          <label className="block text-sm font-bold text-gray-700">Bottom Stats Bar Indicators</label>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Lives Impacted */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500">Lives Impacted Count</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settingInputs.HOME_HERO_STATS_LIVES}
                  onChange={(e) =>
                    setSettingInputs((p) => ({ ...p, HOME_HERO_STATS_LIVES: e.target.value }))
                  }
                  className="flex-grow border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white"
                />
                <button
                  onClick={() => onSaveSetting("HOME_HERO_STATS_LIVES")}
                  className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  Save
                </button>
              </div>
            </div>
            {/* Projects Count */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500">Projects Count</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settingInputs.HOME_HERO_STATS_PROJECTS}
                  onChange={(e) =>
                    setSettingInputs((p) => ({ ...p, HOME_HERO_STATS_PROJECTS: e.target.value }))
                  }
                  className="flex-grow border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white"
                />
                <button
                  onClick={() => onSaveSetting("HOME_HERO_STATS_PROJECTS")}
                  className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  Save
                </button>
              </div>
            </div>
            {/* Education Sublabel */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500">Education Sublabel</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settingInputs.HOME_HERO_STATS_EDUCATION}
                  onChange={(e) =>
                    setSettingInputs((p) => ({ ...p, HOME_HERO_STATS_EDUCATION: e.target.value }))
                  }
                  className="flex-grow border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white"
                />
                <button
                  onClick={() => onSaveSetting("HOME_HERO_STATS_EDUCATION")}
                  className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  Save
                </button>
              </div>
            </div>
            {/* Vision Sublabel */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500">Vision Sublabel</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settingInputs.HOME_HERO_STATS_VISION}
                  onChange={(e) =>
                    setSettingInputs((p) => ({ ...p, HOME_HERO_STATS_VISION: e.target.value }))
                  }
                  className="flex-grow border border-gray-200 rounded-lg px-3 py-1.5 text-xs bg-white"
                />
                <button
                  onClick={() => onSaveSetting("HOME_HERO_STATS_VISION")}
                  className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  Save
                </button>
              </div>
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
