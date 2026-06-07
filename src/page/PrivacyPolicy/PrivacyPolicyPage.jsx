import { TbEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { useGetPrivacyQuery } from "../../redux/features/Terms&policy/terms-policy";

export default function PrivacyPolicyPage() {
  const { data, isLoading } = useGetPrivacyQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  const sections = (data?.sections || []).slice().sort((a, b) => a.order - b.order);

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-7">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2416]">
            {data?.page_title || "Privacy Policy"}
          </h1>
          <p className="text-sm text-[#9a8a77] mt-0.5">Review and manage your privacy policy</p>
        </div>
        <Link to="/settings/edit-privacy-policy/11">
          <button className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-semibold bg-[#2d2416] text-white hover:bg-[#1a160e] transition-colors">
            <TbEdit size={17} />
            Edit
          </button>
        </Link>
      </div>

      {sections.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 shadow-sm flex flex-col items-center justify-center text-[#9a8a77]">
          <TbEdit size={36} className="mb-3 opacity-30" />
          <p className="text-sm">No content yet. Click Edit to add sections.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              {section.title && (
                <h2 className="text-base font-semibold text-[#2d2416] mb-3">
                  {section.title}
                </h2>
              )}
              <p className="text-sm text-[#5c4a32] leading-relaxed whitespace-pre-wrap">
                {section.content}
              </p>
            </div>
          ))}

          {data?.footer_text && (
            <div className="bg-[#f5f0eb] rounded-2xl px-6 py-4">
              <p className="text-xs text-[#9a8a77] text-center">{data.footer_text}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
