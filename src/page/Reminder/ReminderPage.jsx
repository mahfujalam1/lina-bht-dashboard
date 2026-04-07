import { Button, message } from "antd";
import { FiSave } from "react-icons/fi";
import DefaultReminders from "../../component/Main/Reminder/DefaultReminders";
import DeliverySettings from "../../component/Main/Reminder/DeliverySettings";
import { toast } from "sonner";

export default function RemindersPage() {
  const [messageApi, contextHolder] = message.useMessage();

  const handleSave = () => {
    toast.success("Configuration saved successfully.");
  };

  return (
    <div className="flex-1 min-h-screen">
      {contextHolder}

      {/* hwllo */}

      {/* Page Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2416] tracking-tight mb-1">
            Notification Settings
          </h1>
          <p className="text-sm text-[#9a8a78]">
            Configure default push notifications and reminders for users.
          </p>
        </div>

        <Button
          type="primary"
          icon={<FiSave size={15} />}
          onClick={handleSave}
          className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold
            !bg-[#2d2416] !border-[#2d2416] hover:!bg-[#1a160e] hover:!border-[#1a160e]"
        >
          Save Configuration
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_300px] gap-6 items-start">
        <DefaultReminders />
        <DeliverySettings />
      </div>
    </div>
  );
}
