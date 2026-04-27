import { useState } from "react";
import { Button, Select, Modal, Form, Input, Tag, Upload, message } from "antd";
import { FaEdit, FaTrash, FaEye, FaPlus, FaVideo, FaCloudUploadAlt, FaExclamationTriangle } from "react-icons/fa";

const categories = [
  { name: "Skin Health", count: 42 },
  { name: "Lifestyle & Stress", count: 18 },
  { name: "Nutrition & Diet", count: 24 },
  { name: "Product Ingredients", count: 35 },
  { name: "Routines & Techniques", count: 15 },
];

const initialContent = [
  {
    id: 1,
    type: "article",
    category: "Skin Health",
    title: "Understanding Your Skin Barrier",
    readTime: "3 min read",
    published: "Oct 12, 2023",
    views: "12.4k",
    rating: "98% helpful rating",
  },
  {
    id: 2,
    type: "article",
    category: "Lifestyle",
    title: "How Stress Impacts Breakouts",
    readTime: "4 min read",
    published: "Oct 12, 2023",
    views: "12.4k",
    rating: "98% helpful rating",
  },
  {
    id: 3,
    type: "video",
    category: "Techniques",
    title: "Facial Massage for Lymphatic Drainage",
    readTime: "4:20 Video",
    published: "Nov 05, 2023",
    views: "45.2k",
    rating: "99% helpful rating",
  },
];

const catColors = {
  "Skin Health": "green",
  Lifestyle: "orange",
  Techniques: "blue",
  "Nutrition & Diet": "purple",
  "Product Ingredients": "cyan",
};

export default function EducationalContent() {
  const [content, setContent] = useState(initialContent);
  const [articleModal, setArticleModal] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [addCatModal, setAddCatModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [catList, setCatList] = useState(categories);
  const [articleForm] = Form.useForm();
  const [videoForm] = Form.useForm();
  const [catForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const handlePublishArticle = () => {
    articleForm.validateFields().then((vals) => {
      setContent([
        ...content,
        {
          id: Date.now(),
          type: "article",
          ...vals,
          published: "Today",
          views: "0",
          rating: "N/A",
        },
      ]);
      articleForm.resetFields();
      setArticleModal(false);
    });
  };

  const handleUploadVideo = () => {
    videoForm.validateFields().then((vals) => {
      setContent([
        ...content,
        {
          id: Date.now(),
          type: "video",
          ...vals,
          published: "Today",
          views: "0",
          rating: "N/A",
        },
      ]);
      videoForm.resetFields();
      setVideoModal(false);
    });
  };

  const handleAddCategory = () => {
    catForm.validateFields().then((vals) => {
      setCatList([...catList, { name: vals.categoryName, count: 0 }]);
      catForm.resetFields();
      setAddCatModal(false);
    });
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    editForm.setFieldsValue({
      title: item.title,
      category: item.category,
      readTime: item.readTime,
      rating: item.rating,
    });
    setEditModal(true);
  };

  const handleUpdateContent = () => {
    editForm.validateFields().then((vals) => {
      setContent(
        content.map((c) =>
          c.id === editingItem.id ? { ...c, ...vals } : c
        )
      );
      editForm.resetFields();
      setEditModal(false);
      setEditingItem(null);
    });
  };

  const handleDelete = (id) => {
    setContent(content.filter((c) => c.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2416]">
            Educational Content
          </h1>
          <p className="text-sm text-[#9a8a77] mt-0.5">
            Manage micro-learning modules, articles, and video guides.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            icon={<FaVideo />}
            onClick={() => setVideoModal(true)}
            className="flex items-center gap-2 !bg-[#f5f0eb] !border-[#e3d9cc] !rounded-xl !h-10 !px-5 !font-medium !text-[#5c4a32]"
          >
            Upload Video
          </Button>
          <Button
            type="primary"
            icon={<FaPlus />}
            onClick={() => setArticleModal(true)}
            className="flex items-center gap-2 !bg-[#2d2416] !border-[#2d2416] !rounded-xl !h-10 !px-5 !font-semibold"
          >
            New Article
          </Button>
        </div>
      </div>

      <div className="flex gap-5 flex-col lg:flex-row">
        {/* Published Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0ebe4]">
            <h2 className="text-sm font-semibold text-[#2d2416]">
              Published Content
            </h2>
            <Select
              defaultValue="All Categories"
              size="small"
              className="w-40"
              options={["All Categories", ...catList.map((c) => c.name)].map(
                (v) => ({ value: v, label: v }),
              )}
            />
          </div>

          <div className="divide-y divide-[#f5f0eb]">
            {content.map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-5">
                <div className="w-14 h-14 rounded-xl bg-[#f5f0eb] flex items-center justify-center flex-shrink-0">
                  {item.type === "video" ? (
                    <img
                      src="https://placehold.co/56x56/d4c5b0/5c4a32?text=▶"
                      alt=""
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <FaEdit size={20} className="text-[#9a8a77]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Tag
                    color={catColors[item.category] || "default"}
                    className="!rounded-full !text-xs mb-1"
                  >
                    {item.category}
                  </Tag>
                  <p className="text-sm font-semibold text-[#2d2416] truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-[#9a8a77] mt-0.5">
                    {item.readTime} • Published {item.published}
                  </p>
                  <p className="text-xs text-[#9a8a77] mt-0.5 flex items-center gap-1">
                    <FaEye size={11} /> {item.views} views • {item.rating}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="text-[#9a8a77] hover:text-[#2d2416] transition-colors"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item)}
                    className="text-[#9a8a77] hover:text-red-500 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="w-full lg:w-60 bg-white rounded-2xl p-5 shadow-sm h-fit">
          <h2 className="text-sm font-semibold text-[#2d2416] mb-4">
            Content Categories
          </h2>
          <div className="flex flex-col gap-2">
            {catList.map((cat, i) => (
              <div
                key={i}
                className="bg-[#f5f0eb] rounded-xl px-4 py-2.5 flex items-center justify-between"
              >
                <span className="text-sm text-[#2d2416] font-medium">
                  {cat.name}
                </span>
                <span className="text-xs text-[#9a8a77] font-medium">
                  {cat.count}
                </span>
              </div>
            ))}
            <button
              onClick={() => setAddCatModal(true)}
              className="flex items-center justify-center gap-1 text-sm text-[#9a8a77] hover:text-[#2d2416] mt-2 py-2 rounded-xl hover:bg-[#f5f0eb] transition-colors"
            >
              <FaPlus size={12} /> Add Category
            </button>
          </div>
        </div>
      </div>

      {/* Article Modal */}
      <Modal
        title={
          <span className="text-[#2d2416] font-semibold">New Article</span>
        }
        open={articleModal}
        onCancel={() => {
          setArticleModal(false);
          articleForm.resetFields();
        }}
        onOk={handlePublishArticle}
        okText="Publish Article"
        okButtonProps={{
          className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl",
        }}
        cancelButtonProps={{
          className:
            "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32]",
        }}
      >
        <Form form={articleForm} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Title <span className="text-red-400">*</span>
              </span>
            }
            rules={[{ required: true }]}
          >
            <Input
              placeholder="e.g. Understanding Retinol"
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
          <Form.Item
            name="category"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Category <span className="text-red-400">*</span>
              </span>
            }
            rules={[{ required: true }]}
          >
            <Select
              options={catList.map((c) => ({ value: c.name, label: c.name }))}
              className="w-full"
            />
          </Form.Item>
          <Form.Item
            name="readTime"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Read Time <span className="text-red-400">*</span>
              </span>
            }
            rules={[{ required: true }]}
          >
            <Input
              placeholder="e.g. 5 min read"
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
          <Form.Item
            name="rating"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Content Summary
              </span>
            }
          >
            <Input.TextArea
              placeholder="Brief description of the content..."
              rows={3}
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Video Modal */}
      <Modal
        title={<span className="text-[#2d2416] font-semibold">New Video</span>}
        open={videoModal}
        onCancel={() => {
          setVideoModal(false);
          videoForm.resetFields();
        }}
        onOk={handleUploadVideo}
        okText="Upload Video"
        okButtonProps={{
          className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl",
        }}
        cancelButtonProps={{
          className:
            "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32]",
        }}
      >
        <Form form={videoForm} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Title <span className="text-red-400">*</span>
              </span>
            }
            rules={[{ required: true }]}
          >
            <Input
              placeholder="e.g. How to Apply Serum"
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
          <Form.Item
            name="category"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Category <span className="text-red-400">*</span>
              </span>
            }
            rules={[{ required: true }]}
          >
            <Select
              options={catList.map((c) => ({ value: c.name, label: c.name }))}
              className="w-full"
              defaultValue="Skin Health"
            />
          </Form.Item>
          <Form.Item
            name="readTime"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Duration <span className="text-red-400">*</span>
              </span>
            }
            rules={[{ required: true }]}
          >
            <Input
              placeholder="e.g. 4:20 Video"
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
          <Form.Item
            name="videoFile"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Upload Video File <span className="text-red-400">*</span>
              </span>
            }
            rules={[{ required: true, message: "Please upload a video file" }]}
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <Upload.Dragger
              accept="video/*"
              maxCount={1}
              beforeUpload={(file) => {
                const isVideo = file.type.startsWith("video/");
                if (!isVideo) {
                  message.error("Only video files are allowed!");
                }
                return false;
              }}
              className="!rounded-xl !bg-[#f5f0eb] !border-[#e3d9cc] hover:!border-[#c8a96e]"
              style={{ width: "100%" }}
            >
              <div className="flex flex-col items-center py-4">
                <FaCloudUploadAlt size={36} className="text-[#9a8a77] mb-2" />
                <p className="text-sm font-medium text-[#2d2416]">
                  Click or drag video file here
                </p>
                <p className="text-xs text-[#9a8a77] mt-1">
                  Supports MP4, MOV, AVI, WebM
                </p>
              </div>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item
            name="rating"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Content Summary
              </span>
            }
          >
            <Input.TextArea
              placeholder="Brief description of the content..."
              rows={3}
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit/Update Content Modal */}
      <Modal
        title={
          <span className="text-[#2d2416] font-semibold">
            Update {editingItem?.type === "video" ? "Video" : "Article"}
          </span>
        }
        open={editModal}
        onCancel={() => {
          setEditModal(false);
          editForm.resetFields();
          setEditingItem(null);
        }}
        onOk={handleUpdateContent}
        okText="Update"
        okButtonProps={{
          className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl",
        }}
        cancelButtonProps={{
          className:
            "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32]",
        }}
      >
        <Form form={editForm} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Title <span className="text-red-400">*</span>
              </span>
            }
            rules={[{ required: true }]}
          >
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" />
          </Form.Item>
          <Form.Item
            name="category"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Category <span className="text-red-400">*</span>
              </span>
            }
            rules={[{ required: true }]}
          >
            <Select
              options={catList.map((c) => ({ value: c.name, label: c.name }))}
              className="w-full"
            />
          </Form.Item>
          <Form.Item
            name="readTime"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                {editingItem?.type === "video" ? "Duration" : "Read Time"}{" "}
                <span className="text-red-400">*</span>
              </span>
            }
            rules={[{ required: true }]}
          >
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" />
          </Form.Item>
          <Form.Item
            name="rating"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Content Summary
              </span>
            }
          >
            <Input.TextArea
              rows={3}
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
        footer={null}
        closable={false}
        centered
        width={400}
      >
        <div className="flex flex-col items-center py-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <FaExclamationTriangle size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-[#2d2416] mb-1">
            Delete {deleteConfirm?.type === "video" ? "Video" : "Article"}?
          </h3>
          <p className="text-sm text-[#9a8a77] text-center mb-5">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#2d2416]">
              "{deleteConfirm?.title}"
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 py-2.5 rounded-xl bg-[#f5f0eb] text-[#5c4a32] font-medium text-sm hover:bg-[#e8e0d8] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm.id)}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Category Modal */}
      <Modal
        title={
          <span className="text-[#2d2416] font-semibold">Add Category</span>
        }
        open={addCatModal}
        onCancel={() => {
          setAddCatModal(false);
          catForm.resetFields();
        }}
        onOk={handleAddCategory}
        okText="Add Category"
        okButtonProps={{
          className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl",
        }}
        cancelButtonProps={{
          className:
            "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32]",
        }}
      >
        <Form form={catForm} layout="vertical" className="mt-4">
          <Form.Item
            name="categoryName"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Category Name
              </span>
            }
            rules={[{ required: true }]}
          >
            <Input
              placeholder="e.g. Advanced Techniques"
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
