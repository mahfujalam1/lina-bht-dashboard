import { useState } from "react";
import { Select, Button, Progress, Tag } from "antd";
import { FaSave, FaKey, FaSync } from "react-icons/fa";
import { MdOutlineChat } from "react-icons/md";
import { TbSettings2 } from "react-icons/tb";

const models = [
  { name: "Face Scan Model v2.4", accuracy: "94.2%", active: true },
  { name: "Scalp & Hair Model v1.1", accuracy: "89.5%", active: true },
  { name: "Ingredient Parser v3.0", accuracy: "99.1%", active: true },
];

export default function AIConfiguration() {
  const [prompt, setPrompt] = useState(
    "You are Waxi, a premium AI skincare assistant. Always prioritize barrier health and gentle ingredients. If a user reports severe pain or cystic acne, advise them to consult a dermatologist.",
  );
  const [tone, setTone] = useState("Professional & Empathetic");

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2416]">
            AI Configuration
          </h1>
          <p className="text-sm text-[#9a8a77] mt-0.5">
            Manage the behavior and tone of the SkinSense AI assistant.
          </p>
        </div>
        <Button
          type="primary"
          icon={<FaSave />}
          className="flex items-center gap-2 !bg-[#2d2416] !border-[#2d2416] !rounded-xl !h-10 !px-5 !font-semibold"
        >
          Save Changes
        </Button>
      </div>

      <div className="flex gap-5 flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Personality & Tone */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <MdOutlineChat size={20} className="text-[#8b9e7a]" />
              <h2 className="text-base font-semibold text-[#2d2416]">
                Personality &amp; Tone
              </h2>
            </div>

            <div className="mb-4">
              <label className="text-sm text-[#5c4a32] font-medium mb-2 block">
                Primary Tone
              </label>
              <Select
                value={tone}
                onChange={setTone}
                className="w-full"
                size="large"
                options={[
                  {
                    value: "Professional & Empathetic",
                    label: "Professional & Empathetic",
                  },
                  { value: "Friendly & Casual", label: "Friendly & Casual" },
                  { value: "Clinical & Precise", label: "Clinical & Precise" },
                  { value: "Warm & Nurturing", label: "Warm & Nurturing" },
                ]}
                style={{ borderRadius: 12 }}
              />
            </div>

            <div>
              <label className="text-sm text-[#5c4a32] font-medium mb-2 block">
                System Prompt Override
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-[#f5f0eb] text-sm text-[#2d2416] rounded-xl p-4 border-none outline-none resize-none leading-relaxed"
                rows={5}
              />
            </div>
          </div>

          {/* Diagnostic Models */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <TbSettings2 size={20} className="text-[#8b9e7a]" />
              <h2 className="text-base font-semibold text-[#2d2416]">
                Diagnostic Models
              </h2>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              {models.map((m, i) => (
                <div
                  key={i}
                  className="bg-[#f5f0eb] rounded-xl px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#2d2416]">
                      {m.name}
                    </p>
                    <p className="text-xs text-[#9a8a77] mt-0.5">
                      Accuracy: {m.accuracy}
                    </p>
                  </div>
                  <Tag
                    color="green"
                    className="!rounded-full !text-xs !font-semibold !px-3 !py-0.5"
                  >
                    Active
                  </Tag>
                </div>
              ))}
            </div>

            <Button
              icon={<FaSync />}
              className="flex items-center gap-2 !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32] !rounded-xl !h-10 !font-medium hover:!bg-[#e8e0d8]"
            >
              Check for Model Updates
            </Button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-64 flex flex-col gap-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-[#2d2416] mb-4">
              API Usage
            </h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9a8a77]">Monthly Quota</span>
              <span className="text-xs font-semibold text-[#2d2416]">84%</span>
            </div>
            <Progress
              percent={84}
              showInfo={false}
              strokeColor="#a0845c"
              trailColor="#f0ebe4"
              strokeWidth={8}
            />
            <p className="text-xs text-[#9a8a77] mt-2 mb-4">
              840k / 1M requests used
            </p>
            <Button
              icon={<FaKey />}
              className="w-full flex items-center justify-center gap-2 !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32] !rounded-xl !h-10 !font-medium hover:!bg-[#e8e0d8]"
            >
              Manage API Keys
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
