import { useState } from "react";
import { Button, Modal, Form, Input, InputNumber, Select, Tag, Spin } from "antd";
import {
  FiTrendingUp,
  FiUsers,
  FiAlertCircle,
  FiCreditCard,
} from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { toast } from "sonner";
import {
  useGetSubscriptionOverviewQuery,
  useGetPlansQuery,
  useUpdateBasicPlanMutation,
  useUpdatePremiumPlanMutation,
} from "../../redux/features/subscriptions/subscriptionsApi";

export default function Subscriptions() {
  const { data: overviewData, isLoading: isOverviewLoading } = useGetSubscriptionOverviewQuery();
  const { data: plansData, isLoading: isPlansLoading } = useGetPlansQuery();

  const [updateBasicPlan, { isLoading: isUpdatingBasic }] = useUpdateBasicPlanMutation();
  const [updatePremiumPlan, { isLoading: isUpdatingPremium }] = useUpdatePremiumPlanMutation();

  const [basicModal, setBasicModal] = useState(false);
  const [premiumModal, setPremiumModal] = useState(false);

  const [basicForm] = Form.useForm();
  const [premiumForm] = Form.useForm();

  // Open Edit Basic Plan Modal
  const handleOpenBasicModal = () => {
    basicForm.setFieldsValue({
      scans_per_month: String(plansData?.basic?.scans_per_month ?? 5),
      product_analysis: plansData?.basic?.product_analysis || "Basic",
      ai_coaching: plansData?.basic?.ai_coaching || "None",
    });
    setBasicModal(true);
  };

  // Submit Edit Basic Plan
  const handleSaveBasicPlan = async () => {
    try {
      const values = await basicForm.validateFields();
      const scans = values.scans_per_month === "Unlimited"
        ? "Unlimited"
        : Number(values.scans_per_month);

      await updateBasicPlan({
        scans_per_month: scans,
        product_analysis: values.product_analysis,
        ai_coaching: values.ai_coaching,
      }).unwrap();

      toast.success("Basic plan limits updated successfully!");
      setBasicModal(false);
    } catch (err) {
      if (err?.data?.detail) {
        toast.error(`Update failed: ${err.data.detail}`);
      } else if (!err?.errorFields) {
        toast.error("Failed to update basic plan limits.");
      }
    }
  };

  // Open Edit Premium Plan Modal
  const handleOpenPremiumModal = () => {
    premiumForm.setFieldsValue({
      display_name: plansData?.premium?.display_name || "SkinSense Premium",
      price_monthly: plansData?.premium?.price_monthly ?? 14.99,
      price_yearly: plansData?.premium?.price_yearly ?? 49.99,
      trial_days: plansData?.premium?.trial_days ?? 7,
      scans_per_month: String(plansData?.premium?.scans_per_month ?? "Unlimited"),
      product_analysis: plansData?.premium?.product_analysis || "Full Compatibility",
      ai_coaching: plansData?.premium?.ai_coaching || "Unlimited",
    });
    setPremiumModal(true);
  };

  // Submit Edit Premium Plan
  const handleSavePremiumPlan = async () => {
    try {
      const values = await premiumForm.validateFields();
      const scans = values.scans_per_month === "Unlimited"
        ? "Unlimited"
        : Number(values.scans_per_month);

      await updatePremiumPlan({
        display_name: values.display_name?.trim(),
        price_monthly: Number(values.price_monthly),
        price_yearly: Number(values.price_yearly),
        trial_days: Number(values.trial_days),
        scans_per_month: scans,
        product_analysis: values.product_analysis,
        ai_coaching: values.ai_coaching,
      }).unwrap();

      toast.success("Premium plan pricing & features updated successfully!");
      setPremiumModal(false);
    } catch (err) {
      if (err?.data?.detail) {
        toast.error(`Update failed: ${err.data.detail}`);
      } else if (!err?.errorFields) {
        toast.error("Failed to update premium plan.");
      }
    }
  };

  const basic = plansData?.basic;
  const premium = plansData?.premium;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2416]">
            Subscription &amp; Revenue
          </h1>
          <p className="text-sm text-[#9a8a77] mt-0.5">
            Manage pricing plans, RevenueCat synchronization, and track live MRR.
          </p>
        </div>
        <Button
          icon={<FiCreditCard />}
          onClick={() => {
            if (overviewData?.rc_dashboard_url) {
              window.open(overviewData.rc_dashboard_url, "_blank");
            }
          }}
          className="flex items-center gap-2 !bg-[#f5f0eb] !border-[#e3d9cc] !rounded-xl !h-10 !px-5 !font-medium !text-[#5c4a32] hover:!bg-[#ebdccb]"
        >
          RevenueCat Dashboard
        </Button>
      </div>

      {overviewData?.revenue_note && (
        <div className="mb-4 text-xs text-[#9a8a77] bg-[#f5f0eb] p-3 rounded-xl border border-[#ede5db]">
          {overviewData.revenue_note}
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="flex gap-5 mb-6 flex-wrap">
        {/* Monthly Recurring Revenue */}
        <div className="bg-white rounded-2xl p-5 flex-1 min-w-[200px] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="text-[#8b9e7a]" size={16} />
            <span className="text-sm text-[#9a8a77]">
              Monthly Recurring Revenue
            </span>
          </div>
          <p className="text-3xl font-bold text-[#2d2416]">
            {isOverviewLoading
              ? "..."
              : `$${(overviewData?.mrr?.value || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
          </p>
          <p
            className={`text-xs font-semibold mt-1 ${
              overviewData?.mrr?.direction === "up"
                ? "text-green-500"
                : overviewData?.mrr?.direction === "down"
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {overviewData?.mrr?.change_pct !== null &&
            overviewData?.mrr?.change_pct !== undefined
              ? `${overviewData?.mrr?.change_pct > 0 ? "+" : ""}${overviewData?.mrr?.change_pct}%`
              : "0%"}{" "}
            from last month
          </p>
        </div>

        {/* Active Subscribers */}
        <div className="bg-white rounded-2xl p-5 flex-1 min-w-[200px] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FiUsers className="text-[#8b9e7a]" size={16} />
            <span className="text-sm text-[#9a8a77]">Active Subscribers</span>
          </div>
          <p className="text-3xl font-bold text-[#2d2416]">
            {isOverviewLoading
              ? "..."
              : (overviewData?.active_subscribers?.value || 0).toLocaleString()}
          </p>
          <p
            className={`text-xs font-semibold mt-1 ${
              overviewData?.active_subscribers?.direction === "up"
                ? "text-green-500"
                : overviewData?.active_subscribers?.direction === "down"
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {overviewData?.active_subscribers?.change_pct !== null &&
            overviewData?.active_subscribers?.change_pct !== undefined
              ? `${overviewData?.active_subscribers?.change_pct > 0 ? "+" : ""}${overviewData?.active_subscribers?.change_pct}%`
              : "0%"}{" "}
            from last month
          </p>
        </div>

        {/* Churn Rate */}
        <div className="bg-white rounded-2xl p-5 flex-1 min-w-[200px] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FiAlertCircle className="text-amber-500" size={16} />
            <span className="text-sm text-[#9a8a77]">Churn Rate</span>
          </div>
          <p className="text-3xl font-bold text-[#2d2416]">
            {isOverviewLoading ? "..." : `${overviewData?.churn_rate?.value || 0}%`}
          </p>
          <p
            className={`text-xs font-semibold mt-1 ${
              overviewData?.churn_rate?.direction === "up"
                ? "text-red-500"
                : overviewData?.churn_rate?.direction === "down"
                ? "text-green-500"
                : "text-gray-500"
            }`}
          >
            {overviewData?.churn_rate?.change_pct !== null &&
            overviewData?.churn_rate?.change_pct !== undefined
              ? `${overviewData?.churn_rate?.change_pct > 0 ? "+" : ""}${overviewData?.churn_rate?.change_pct}%`
              : "0%"}{" "}
            from last month
          </p>
        </div>
      </div>

      {/* Plans Section */}
      <h2 className="text-base font-semibold text-[#2d2416] mb-4">
        Pricing Plans
      </h2>

      {isPlansLoading ? (
        <div className="flex justify-center items-center py-16 bg-white rounded-2xl">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex gap-5 flex-col md:flex-row">
          {/* Basic Plan Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-[#2d2416]">
                  {basic?.display_name || "Basic (Free)"}
                </h3>
                <Tag className="!bg-[#f5f0eb] !border-none !text-[#9a8a77] !rounded-full !text-xs font-medium">
                  {(basic?.user_count ?? 0).toLocaleString()} Users
                </Tag>
              </div>
              <p className="text-xs text-[#9a8a77] mb-4">
                Default plan for all users
              </p>
              <p className="text-3xl font-bold text-[#2d2416] mb-5">
                $0
                <span className="text-base font-normal text-[#9a8a77]">/mo</span>
              </p>
              <div className="flex flex-col gap-3 mb-6 text-sm">
                {[
                  ["Scans per month", String(basic?.scans_per_month ?? 5)],
                  ["Product Analysis", basic?.product_analysis || "Basic"],
                  ["AI Coaching", basic?.ai_coaching || "None"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between border-b border-[#f5f0eb] pb-2"
                  >
                    <span className="text-[#9a8a77]">{k}</span>
                    <span className="font-semibold text-[#2d2416]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={handleOpenBasicModal}
              className="w-full !rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32] !font-medium !h-10 hover:!bg-[#ebdccb]"
            >
              Edit Plan Limits
            </Button>
          </div>

          {/* Premium Plan Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 border-2 border-[#a0845c] relative flex flex-col justify-between">
            <div className="absolute -top-3 right-4">
              <Tag className="!bg-[#a0845c] !border-none !text-white !rounded-full !text-xs !font-bold !px-3">
                PREMIUM
              </Tag>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-[#2d2416]">
                  {premium?.display_name || "SkinSense Premium"}
                </h3>
                <Tag className="!bg-[#f5f0eb] !border-none !text-[#9a8a77] !rounded-full !text-xs font-medium">
                  {(premium?.user_count ?? 0).toLocaleString()} Users
                </Tag>
              </div>
              <p className="text-xs text-[#9a8a77] mb-4">
                Full access to all AI features
              </p>
              <div className="flex items-end gap-6 mb-5">
                <div>
                  <p className="text-3xl font-bold text-[#2d2416]">
                    ${(premium?.price_monthly ?? 14.99).toFixed(2)}
                    <span className="text-base font-normal text-[#9a8a77]">
                      /mo
                    </span>
                  </p>
                  <p className="text-xs text-[#9a8a77]">Monthly Billing</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#2d2416]">
                    ${((premium?.price_yearly ?? 49.99) / 12).toFixed(2)}
                    <span className="text-base font-normal text-[#9a8a77]">
                      /mo
                    </span>
                  </p>
                  <p className="text-xs text-[#9a8a77]">
                    Yearly (${(premium?.price_yearly ?? 49.99).toFixed(2)}/yr)
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 mb-6 text-sm">
                {[
                  ["Trial Period", `${premium?.trial_days ?? 7} Days Free Trial`],
                  ["Scans per month", String(premium?.scans_per_month ?? "Unlimited")],
                  ["Product Analysis", premium?.product_analysis || "Full Compatibility"],
                  ["AI Coaching", premium?.ai_coaching || "Unlimited"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between border-b border-[#f5f0eb] pb-2"
                  >
                    <span className="text-[#9a8a77]">{k}</span>
                    <span className="font-semibold text-[#2d2416]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={handleOpenPremiumModal}
              className="w-full !rounded-xl !bg-[#a0845c] !border-[#a0845c] !text-white !font-medium !h-10 hover:!bg-[#8c734f]"
            >
              Edit Pricing &amp; Features
            </Button>
          </div>
        </div>
      )}

      {/* Edit Basic Plan Modal */}
      <Modal
        title={
          <span className="text-[#2d2416] font-semibold">
            Edit Basic Plan Limits
          </span>
        }
        open={basicModal}
        onCancel={() => setBasicModal(false)}
        onOk={handleSaveBasicPlan}
        confirmLoading={isUpdatingBasic}
        okText={
          <span className="flex items-center gap-1">
            <FaCheck size={12} /> Save Changes
          </span>
        }
        okButtonProps={{
          className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl",
        }}
        cancelButtonProps={{
          className:
            "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32]",
        }}
      >
        <Form form={basicForm} layout="vertical" className="mt-4">
          <Form.Item
            name="scans_per_month"
            label={<span className="text-xs text-[#5c4a32] font-medium">Scans per Month</span>}
            rules={[{ required: true, message: "Please specify scan limit" }]}
          >
            <Select
              className="w-full"
              options={[
                { value: "1", label: "1 Scan / month" },
                { value: "3", label: "3 Scans / month" },
                { value: "5", label: "5 Scans / month" },
                { value: "10", label: "10 Scans / month" },
                { value: "Unlimited", label: "Unlimited" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="product_analysis"
            label={<span className="text-xs text-[#5c4a32] font-medium">Product Analysis</span>}
            rules={[{ required: true, message: "Please select product analysis level" }]}
          >
            <Select
              className="w-full"
              options={[
                { value: "Basic", label: "Basic" },
                { value: "Full Compatibility", label: "Full Compatibility" },
                { value: "None", label: "None" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="ai_coaching"
            label={<span className="text-xs text-[#5c4a32] font-medium">AI Coaching</span>}
            rules={[{ required: true, message: "Please select AI coaching availability" }]}
          >
            <Select
              className="w-full"
              options={[
                { value: "None", label: "None" },
                { value: "Limited", label: "Limited" },
                { value: "Unlimited", label: "Unlimited" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Premium Plan Modal */}
      <Modal
        title={
          <span className="text-[#2d2416] font-semibold">
            Edit Premium Plan
          </span>
        }
        open={premiumModal}
        onCancel={() => setPremiumModal(false)}
        onOk={handleSavePremiumPlan}
        confirmLoading={isUpdatingPremium}
        okText={
          <span className="flex items-center gap-1">
            <FaCheck size={12} /> Save Changes
          </span>
        }
        okButtonProps={{
          className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl",
        }}
        cancelButtonProps={{
          className:
            "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32]",
        }}
      >
        <Form form={premiumForm} layout="vertical" className="mt-4">
          <Form.Item
            name="display_name"
            label={<span className="text-xs text-[#5c4a32] font-medium">Plan Display Name *</span>}
            rules={[{ required: true, message: "Please enter plan display name" }]}
          >
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="price_monthly"
              label={<span className="text-xs text-[#5c4a32] font-medium">Monthly Price ($) *</span>}
              rules={[{ required: true, message: "Enter monthly price" }]}
            >
              <InputNumber
                min={0.99}
                step={0.5}
                precision={2}
                className="!w-full !rounded-xl !bg-[#f5f0eb] !border-none"
              />
            </Form.Item>
            <Form.Item
              name="price_yearly"
              label={<span className="text-xs text-[#5c4a32] font-medium">Yearly Price ($) *</span>}
              rules={[{ required: true, message: "Enter yearly price" }]}
            >
              <InputNumber
                min={1.99}
                step={1}
                precision={2}
                className="!w-full !rounded-xl !bg-[#f5f0eb] !border-none"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="trial_days"
            label={<span className="text-xs text-[#5c4a32] font-medium">Free Trial Days *</span>}
            rules={[{ required: true, message: "Enter free trial days" }]}
          >
            <InputNumber
              min={0}
              max={365}
              className="!w-full !rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>

          <Form.Item
            name="scans_per_month"
            label={<span className="text-xs text-[#5c4a32] font-medium">Scans per Month *</span>}
            rules={[{ required: true, message: "Select scan limit" }]}
          >
            <Select
              className="w-full"
              options={[
                { value: "Unlimited", label: "Unlimited" },
                { value: "100", label: "100 Scans / month" },
                { value: "50", label: "50 Scans / month" },
                { value: "20", label: "20 Scans / month" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="product_analysis"
            label={<span className="text-xs text-[#5c4a32] font-medium">Product Analysis Level *</span>}
            rules={[{ required: true, message: "Select analysis level" }]}
          >
            <Select
              className="w-full"
              options={[
                { value: "Full Compatibility", label: "Full Compatibility" },
                { value: "Standard", label: "Standard" },
                { value: "Basic", label: "Basic" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="ai_coaching"
            label={<span className="text-xs text-[#5c4a32] font-medium">AI Coaching *</span>}
            rules={[{ required: true, message: "Select coaching level" }]}
          >
            <Select
              className="w-full"
              options={[
                { value: "Unlimited", label: "Unlimited" },
                { value: "Limited", label: "Limited" },
                { value: "None", label: "None" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
