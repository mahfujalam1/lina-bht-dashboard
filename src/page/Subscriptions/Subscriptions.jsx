import { useState } from "react";
import { Button, Modal, Form, Input, Select, Tag } from "antd";
import {
  FiTrendingUp,
  FiUsers,
  FiAlertCircle,
  FiCreditCard,
} from "react-icons/fi";
import { FaCheck } from "react-icons/fa";

export default function Subscriptions() {
  const [premiumModal, setPremiumModal] = useState(false);
  const [basicModal, setBasicModal] = useState(false);
  const [form] = Form.useForm();

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2416]">
            Subscription &amp; Revenue
          </h1>
          <p className="text-sm text-[#9a8a77] mt-0.5">
            Manage pricing plans, Stripe integration, and track MRR.
          </p>
        </div>
        <Button
          icon={<FiCreditCard />}
          className="flex items-center gap-2 !bg-[#f5f0eb] !border-[#e3d9cc] !rounded-xl !h-10 !px-5 !font-medium !text-[#5c4a32]"
        >
          Stripe Dashboard
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-5 mb-6 flex-wrap">
        <div className="bg-white rounded-2xl p-5 flex-1 min-w-[160px] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="text-[#8b9e7a]" size={16} />
            <span className="text-sm text-[#9a8a77]">
              Monthly Recurring Revenue
            </span>
          </div>
          <p className="text-3xl font-bold text-[#2d2416]">$114,600</p>
          <p className="text-xs text-green-500 font-semibold mt-1">
            +15.2% from last month
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 flex-1 min-w-[160px] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FiUsers className="text-[#8b9e7a]" size={16} />
            <span className="text-sm text-[#9a8a77]">Active Subscribers</span>
          </div>
          <p className="text-3xl font-bold text-[#2d2416]">3,820</p>
          <p className="text-xs text-green-500 font-semibold mt-1">
            +8.4% from last month
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 flex-1 min-w-[160px] shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FiAlertCircle className="text-amber-500" size={16} />
            <span className="text-sm text-[#9a8a77]">Churn Rate</span>
          </div>
          <p className="text-3xl font-bold text-[#2d2416]">2.4%</p>
          <p className="text-xs text-amber-500 font-semibold mt-1">
            +0.2% from last month
          </p>
        </div>
      </div>

      {/* Plans */}
      <h2 className="text-base font-semibold text-[#2d2416] mb-4">
        Pricing Plans
      </h2>
      <div className="flex gap-5 flex-col md:flex-row">
        {/* Basic */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-[#2d2416]">Basic (Free)</h3>
            <Tag className="!bg-[#f5f0eb] !border-none !text-[#9a8a77] !rounded-full !text-xs">
              8,630 Users
            </Tag>
          </div>
          <p className="text-xs text-[#9a8a77] mb-4">
            Default plan for all users
          </p>
          <p className="text-3xl font-bold text-[#2d2416] mb-5">
            $0<span className="text-base font-normal text-[#9a8a77]">/mo</span>
          </p>
          <div className="flex flex-col gap-3 mb-6 text-sm">
            {[
              ["Scans per month", "3"],
              ["Product Analysis", "Basic"],
              ["AI Coaching", "None"],
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
          <Button
            onClick={() => setBasicModal(true)}
            className="w-full !rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32] !font-medium !h-10"
          >
            Edit Plan Limits
          </Button>
        </div>

        {/* Premium */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 border-2 border-[#a0845c] relative">
          <div className="absolute -top-3 right-4">
            <Tag className="!bg-[#a0845c] !border-none !text-white !rounded-full !text-xs !font-bold !px-3">
              PREMIUM
            </Tag>
          </div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-[#2d2416]">Waxi Premium</h3>
            <Tag className="!bg-[#f5f0eb] !border-none !text-[#9a8a77] !rounded-full !text-xs">
              3,820 Users
            </Tag>
          </div>
          <p className="text-xs text-[#9a8a77] mb-4">
            Full access to all AI features
          </p>
          <div className="flex items-end gap-4 mb-5">
            <div>
              <p className="text-3xl font-bold text-[#2d2416]">
                $12.99
                <span className="text-base font-normal text-[#9a8a77]">
                  /mo
                </span>
              </p>
              <p className="text-xs text-[#9a8a77]">Monthly Billing</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#2d2416]">
                $9.99
                <span className="text-base font-normal text-[#9a8a77]">
                  /mo
                </span>
              </p>
              <p className="text-xs text-[#9a8a77]">Yearly Billing</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 mb-6 text-sm">
            {[
              ["Scans per month", "Unlimited"],
              ["Product Analysis", "Full Compatibility"],
              ["AI Coaching", "Unlimited"],
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
          <Button
            onClick={() => setPremiumModal(true)}
            className="w-full !rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32] !font-medium !h-10"
          >
            Edit Pricing &amp; Features
          </Button>
        </div>
      </div>

      {/* Edit Premium Modal */}
      <Modal
        title={
          <span className="text-[#2d2416] font-semibold">
            Edit Premium Plan
          </span>
        }
        open={premiumModal}
        onCancel={() => setPremiumModal(false)}
        onOk={() => setPremiumModal(false)}
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
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#5c4a32] font-medium mb-1 block">
              Monthly Price ($) *
            </label>
            <Input
              defaultValue="12.99"
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </div>
          <div>
            <label className="text-xs text-[#5c4a32] font-medium mb-1 block">
              Yearly Price ($/mo) *
            </label>
            <Input
              defaultValue="9.99"
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs text-[#5c4a32] font-medium mb-1 block">
            Scans per Month *
          </label>
          <Select
            defaultValue="Unlimited"
            className="w-full"
            options={["Unlimited", "100", "50"].map((v) => ({
              value: v,
              label: v,
            }))}
          />
        </div>
        <div className="mt-4">
          <label className="text-xs text-[#5c4a32] font-medium mb-1 block">
            Product Analysis Level *
          </label>
          <Select
            defaultValue="Full Compatibility"
            className="w-full"
            options={["Full Compatibility", "Basic", "Standard"].map((v) => ({
              value: v,
              label: v,
            }))}
          />
        </div>
        <div className="mt-4">
          <label className="text-xs text-[#5c4a32] font-medium mb-1 block">
            AI Coaching *
          </label>
          <Select
            defaultValue="Unlimited"
            className="w-full"
            options={["Unlimited", "Limited", "None"].map((v) => ({
              value: v,
              label: v,
            }))}
          />
        </div>
      </Modal>

      {/* Edit Basic Modal */}
      <Modal
        title={
          <span className="text-[#2d2416] font-semibold">
            Edit Basic Plan Limits
          </span>
        }
        open={basicModal}
        onCancel={() => setBasicModal(false)}
        onOk={() => setBasicModal(false)}
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
        <div className="mt-4">
          <label className="text-xs text-[#5c4a32] font-medium mb-1 block">
            Scans per Month *
          </label>
          <Select
            defaultValue="3"
            className="w-full"
            options={["3", "5", "10"].map((v) => ({ value: v, label: v }))}
          />
        </div>
        <div className="mt-4">
          <label className="text-xs text-[#5c4a32] font-medium mb-1 block">
            Product Analysis *
          </label>
          <Select
            defaultValue="Basic"
            className="w-full"
            options={["Basic", "None"].map((v) => ({ value: v, label: v }))}
          />
        </div>
        <div className="mt-4">
          <label className="text-xs text-[#5c4a32] font-medium mb-1 block">
            AI Coaching *
          </label>
          <Select
            defaultValue="None"
            className="w-full"
            options={["None", "Limited"].map((v) => ({ value: v, label: v }))}
          />
        </div>
      </Modal>
    </div>
  );
}
