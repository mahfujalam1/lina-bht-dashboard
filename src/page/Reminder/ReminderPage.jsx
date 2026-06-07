import { useState, useEffect } from "react";
import { Button, message, Spin } from "antd";
import { FiSave } from "react-icons/fi";
import DefaultReminders from "../../component/Main/Reminder/DefaultReminders";
import DeliverySettings from "../../component/Main/Reminder/DeliverySettings";
import { toast } from "sonner";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "../../redux/features/notification/notificationApi";

export default function RemindersPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const { data, isLoading } = useGetNotificationSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateNotificationSettingsMutation();

  const [reminders, setReminders] = useState([]);
  const [deliverySettings, setDeliverySettings] = useState({ smart_timing: true, timezone_handling: "user_local_time" });

  useEffect(() => {
    if (data?.settings) {
      setReminders(data.settings.reminders || []);
      setDeliverySettings(data.settings.delivery_settings || { smart_timing: true, timezone_handling: "user_local_time" });
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await updateSettings({ reminders, delivery_settings: deliverySettings }).unwrap();
      toast.success("Configuration saved successfully.");
    } catch (error) {
      toast.error("Failed to save configuration.");
    }
  };

  return (
    <div className="flex-1 min-h-screen">
      {contextHolder}

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
          loading={isUpdating}
          onClick={handleSave}
          className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold
            !bg-[#2d2416] !border-[#2d2416] hover:!bg-[#1a160e] hover:!border-[#1a160e]"
        >
          Save Configuration
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
          <DefaultReminders reminders={reminders} setReminders={setReminders} />
          <DeliverySettings deliverySettings={deliverySettings} setDeliverySettings={setDeliverySettings} />
        </div>
      )}
    </div>
  );
}
