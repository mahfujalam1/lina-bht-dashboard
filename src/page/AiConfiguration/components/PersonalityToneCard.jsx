/* eslint-disable react/prop-types */
import { Select } from "antd";
import { MdOutlineChat } from "react-icons/md";

const TONE_OPTIONS = [
  { value: "Professional & Empathetic", label: "Professional & Empathetic" },
  { value: "Friendly & Casual", label: "Friendly & Casual" },
  { value: "Clinical & Precise", label: "Clinical & Precise" },
  { value: "Warm & Nurturing", label: "Warm & Nurturing" },
];

export default function PersonalityToneCard({ tone, setTone, prompt, setPrompt }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#eee9e2]">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#f0f4ee] flex items-center justify-center text-[#8b9e7a]">
          <MdOutlineChat size={18} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#2d2416]">
            Personality &amp; Tone
          </h2>
          <p className="text-xs text-[#9a8a77]">
            Defines the voice and clinical communication guidelines of the Gixy Skincare Coach
          </p>
        </div>
      </div>

      <div className="mb-5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#5c4a32] mb-2 block">
          Primary Tone Preset
        </label>
        <Select
          value={tone}
          onChange={setTone}
          className="w-full"
          size="large"
          options={TONE_OPTIONS}
        />
        <p className="text-[11px] text-[#9a8a77] mt-1.5">
          Controls emotional resonance and response cadence during real-time chat interactions.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#5c4a32]">
            System Prompt Override
          </label>
          <span className="text-[11px] text-[#9a8a77]">
            {prompt?.length || 0} characters
          </span>
        </div>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Enter core guidance for skin barrier health, gentle non-comedogenic ingredients, and sun protection adherence..."
          className="w-full bg-[#f7f4f0] text-sm text-[#2d2416] rounded-xl p-4 border border-[#e8e2d9] outline-none resize-y min-h-[120px] focus:border-[#8b9e7a] focus:bg-white transition-all leading-relaxed"
          rows={4}
        />
        <p className="text-[11px] text-[#9a8a77] mt-1.5">
          Prepended to diagnostic scans and conversational prompts across all LLM inference engines.
        </p>
      </div>
    </div>
  );
}
