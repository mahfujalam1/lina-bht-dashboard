/* eslint-disable react/prop-types */
import PersonalityToneCard from "./PersonalityToneCard";
import AiArchitectureCard from "./AiArchitectureCard";

export default function AiConfigTab({
  tone,
  setTone,
  prompt,
  setPrompt,
  configData,
  onCheckUpdates,
  isCheckingUpdates,
  checkUpdatesResult,
  onOpenKeyModal,
}) {
  return (
    <div className="flex flex-col gap-5">
      <PersonalityToneCard
        tone={tone}
        setTone={setTone}
        prompt={prompt}
        setPrompt={setPrompt}
      />

      <AiArchitectureCard
        configData={configData}
        onCheckUpdates={onCheckUpdates}
        isCheckingUpdates={isCheckingUpdates}
        checkUpdatesResult={checkUpdatesResult}
        onOpenKeyModal={onOpenKeyModal}
      />
    </div>
  );
}
