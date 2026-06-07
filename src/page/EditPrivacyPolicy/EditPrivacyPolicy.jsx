import { useEffect, useState } from "react";
import { Button, Input, Spin } from "antd";
import { FiSave, FiPlus, FiTrash2 } from "react-icons/fi";
import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  useGetPrivacyQuery,
  useUpdatePrivacyMutation,
} from "../../redux/features/Terms&policy/terms-policy";

const { TextArea } = Input;

export default function EditPrivacyPolicy() {
  const { data, isLoading } = useGetPrivacyQuery();
  const [updatePrivacy, { isLoading: isSaving }] = useUpdatePrivacyMutation();

  const [pageTitle, setPageTitle] = useState("");
  const [footerText, setFooterText] = useState("");
  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (data) {
      setPageTitle(data.page_title || "");
      setFooterText(data.footer_text || "");
      setSections(
        (data.sections || []).slice().sort((a, b) => a.order - b.order)
      );
    }
  }, [data]);

  const handleAddSection = () => {
    setSections((prev) => [
      ...prev,
      { order: prev.length + 1, title: "", content: "" },
    ]);
  };

  const handleRemoveSection = (index) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSectionChange = (index, field, value) => {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = async () => {
    const payload = {
      page_title: pageTitle,
      footer_text: footerText,
      sections: sections.map((s, i) => ({ ...s, order: i + 1 })),
    };
    try {
      await updatePrivacy(payload).unwrap();
      toast.success("Privacy Policy updated successfully!");
    } catch (err) {
      toast.error("Failed to update Privacy Policy.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-3">
          <Link to="/settings/privacy-policy">
            <button className="w-9 h-9 rounded-xl bg-[#f5f0eb] flex items-center justify-center text-[#5c4a32] hover:bg-[#e8e0d8] transition-colors">
              <IoChevronBack size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#2d2416]">Edit Privacy Policy</h1>
            <p className="text-sm text-[#9a8a77] mt-0.5">Update your privacy policy content</p>
          </div>
        </div>
        <Button
          type="primary"
          icon={<FiSave size={15} />}
          loading={isSaving}
          onClick={handleSubmit}
          className="flex items-center gap-2 !bg-[#2d2416] !border-[#2d2416] !rounded-xl !h-10 !px-5 !font-semibold"
        >
          Save Changes
        </Button>
      </div>

      <div className="flex flex-col gap-5">
        {/* Page Title */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <label className="text-sm font-semibold text-[#5c4a32] block mb-2">Page Title</label>
          <Input
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            placeholder="e.g. Privacy and Policy"
            className="!rounded-xl !bg-[#f5f0eb] !border-none !py-2.5 !text-[#2d2416]"
          />
        </div>

        {/* Sections */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-[#2d2416]">Sections</h2>
            <button
              onClick={handleAddSection}
              className="flex items-center gap-1.5 text-sm font-medium text-[#8b6914] hover:text-[#6d5310] transition-colors"
            >
              <FiPlus size={16} />
              Add Section
            </button>
          </div>

          {sections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-[#9a8a77]">
              <p className="text-sm">No sections yet. Click "Add Section" to get started.</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-[#faf8f5] rounded-xl border border-[#ede6db] p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#9a8a77] uppercase tracking-wide">
                    Section {index + 1}
                  </span>
                  <button
                    onClick={() => handleRemoveSection(index)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#c97d2a] hover:bg-[#fdf1e5] transition-colors"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#5c4a32] block mb-1">Title</label>
                    <Input
                      value={section.title}
                      onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                      placeholder="Section title..."
                      className="!rounded-xl !bg-white !border-[#ede6db] !py-2 !text-[#2d2416]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5c4a32] block mb-1">Content</label>
                    <TextArea
                      value={section.content}
                      onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                      placeholder="Section content..."
                      rows={5}
                      className="!rounded-xl !bg-white !border-[#ede6db] !text-[#2d2416] !resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Text */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <label className="text-sm font-semibold text-[#5c4a32] block mb-2">Footer Text</label>
          <TextArea
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            placeholder="Footer note or copyright text..."
            rows={3}
            className="!rounded-xl !bg-[#f5f0eb] !border-none !text-[#2d2416] !resize-none"
          />
        </div>
      </div>
    </div>
  );
}
