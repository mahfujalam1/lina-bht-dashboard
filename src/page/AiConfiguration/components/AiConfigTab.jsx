/* eslint-disable react/prop-types */
import AiArchitectureCard from "./AiArchitectureCard";

export default function AiConfigTab({
  configData,
  onCheckUpdates,
  isCheckingUpdates,
  checkUpdatesResult,
  onOpenKeyModal,
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Personality & Tone card is hidden as requested */}
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
