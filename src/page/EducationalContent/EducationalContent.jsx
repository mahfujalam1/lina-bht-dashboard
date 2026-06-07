import { useState } from "react";
import { Button, Select, Modal, Form, Input, Tag, Upload, message } from "antd";
import { FaEdit, FaTrash, FaEye, FaPlus, FaVideo, FaCloudUploadAlt, FaExclamationTriangle } from "react-icons/fa";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import {
  useGetArticlesQuery,
  useAddArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation
} from "../../redux/features/articles/articlesApi";

const catColors = {
  "Skin Health": "green",
  Lifestyle: "orange",
  Techniques: "blue",
  "Nutrition & Diet": "purple",
  "Product Ingredients": "cyan",
  "Health": "red",
  "National Song": "cyan",
  "Scalp Care": "blue",
  "Hair Care": "purple",
  "Nutrition": "green",
  "Hair Restoration": "orange",
};

export default function EducationalContent() {
  const { data: contentData, isLoading } = useGetArticlesQuery();
  const [addArticle] = useAddArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();
  const [deleteArticle] = useDeleteArticleMutation();

  const content = contentData || [];

  // Calculate dynamic categories based on fetched data
  const dynamicCategories = content.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = { name: curr.category, count: 0 };
    }
    acc[curr.category].count += 1;
    return acc;
  }, {});
  const catList = Object.values(dynamicCategories);

  const [filterCategory, setFilterCategory] = useState("All Categories");

  const filteredContent = filterCategory === "All Categories"
    ? content
    : content.filter(c => c.category === filterCategory);

  const [articleModal, setArticleModal] = useState(false);
  const [videoModal, setVideoModal] = useState(false);
  const [addCatModal, setAddCatModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [articleForm] = Form.useForm();
  const [videoForm] = Form.useForm();
  const [catForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const [imageFileList, setImageFileList] = useState([]);
  const [videoFileList, setVideoFileList] = useState([]);

  const handlePublishArticle = () => {
    articleForm.validateFields().then(async (vals) => {
      const formData = new FormData();
      formData.append("title", vals.title);
      formData.append("description", vals.description || "");
      formData.append("category", vals.category);
      formData.append("read_time", vals.read_time);
      formData.append("content", vals.content || "");

      if (imageFileList[0]?.originFileObj) {
        formData.append("image_file", imageFileList[0].originFileObj);
      }

      try {
        await addArticle(formData).unwrap();
        toast.success("Article published successfully!");
        articleForm.resetFields();
        setImageFileList([]);
        setArticleModal(false);
      } catch (error) {
        toast.error("Failed to publish article");
      }
    });
  };

  const handleUploadVideo = () => {
    videoForm.validateFields().then(async (vals) => {
      const formData = new FormData();
      formData.append("title", vals.title);
      formData.append("description", vals.description || "");
      formData.append("category", vals.category);
      formData.append("read_time", vals.read_time); // Used as duration
      formData.append("content", vals.content || "");

      if (imageFileList[0]?.originFileObj) {
        formData.append("image_file", imageFileList[0].originFileObj);
      }
      if (videoFileList[0]?.originFileObj) {
        formData.append("video_file", videoFileList[0].originFileObj);
      }

      try {
        await addArticle(formData).unwrap();
        toast.success("Video uploaded successfully!");
        videoForm.resetFields();
        setVideoFileList([]);
        setImageFileList([]);
        setVideoModal(false);
      } catch (error) {
        toast.error("Failed to upload video");
      }
    });
  };

  const handleAddCategory = () => {
    // Currently API does not have endpoint for adding category alone. 
    // Just closing the modal. In real app, we might need a category API.
    catForm.validateFields().then((vals) => {
      toast.info("Category will be created automatically when you add an article with it.");
      catForm.resetFields();
      setAddCatModal(false);
    });
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    editForm.setFieldsValue({
      title: item.title,
      description: item.description,
      category: item.category,
      read_time: item.read_time,
      content: item.content,
    });
    setImageFileList([]);
    setVideoFileList([]);
    setEditModal(true);
  };

  const handleViewClick = (item) => {
    setViewingItem(item);
    setDetailsModal(true);
  };

  const handleUpdateContent = () => {
    editForm.validateFields().then(async (vals) => {
      const formData = new FormData();
      formData.append("title", vals.title);
      formData.append("description", vals.description || "");
      formData.append("category", vals.category);
      formData.append("read_time", vals.read_time);
      formData.append("content", vals.content || "");

      if (imageFileList[0]?.originFileObj) {
        formData.append("image_file", imageFileList[0].originFileObj);
      }
      if (videoFileList[0]?.originFileObj) {
        formData.append("video_file", videoFileList[0].originFileObj);
      }

      try {
        await updateArticle({ id: editingItem.id, formData }).unwrap();
        toast.success("Content updated successfully!");
        editForm.resetFields();
        setEditModal(false);
        setEditingItem(null);
        setImageFileList([]);
        setVideoFileList([]);
      } catch (error) {
        toast.error("Failed to update content");
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteArticle(id).unwrap();
      toast.success("Content deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete content");
    }
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
              value={filterCategory}
              onChange={setFilterCategory}
              size="small"
              className="w-40"
              options={["All Categories", ...catList.map((c) => c.name)].map(
                (v) => ({ value: v, label: v }),
              )}
            />
          </div>

          <div className="divide-y divide-[#f5f0eb]">
            {isLoading && <p className="p-5 text-center text-gray-500">Loading content...</p>}
            {!isLoading && filteredContent.map((item) => {
              const isVideo = !!item.video_url;
              return (
                <div key={item.id} className="flex items-start gap-4 p-5">
                  <div className="w-14 h-14 rounded-xl bg-[#f5f0eb] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : isVideo ? (
                      <FaVideo size={20} className="text-[#9a8a77]" />
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
                      {item.read_time} • Published {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-[#9a8a77] mt-0.5 flex items-center gap-1">
                      <FaEye size={11} /> {item.views} views {isVideo && '• Video Guide'}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleViewClick(item)}
                      className="text-[#9a8a77] hover:text-[#2d2416] transition-colors"
                    >
                      <FaEye size={14} />
                    </button>
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
              );
            })}
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
            {/* <button
              onClick={() => setAddCatModal(true)}
              className="flex items-center justify-center gap-1 text-sm text-[#9a8a77] hover:text-[#2d2416] mt-2 py-2 rounded-xl hover:bg-[#f5f0eb] transition-colors"
            >
              <FaPlus size={12} /> Add Category
            </button> */}
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
          setImageFileList([]);
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
            <Input
              placeholder="e.g. Skin Health"
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
          <Form.Item
            name="read_time"
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
            name="description"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Description
              </span>
            }
          >
            <Input.TextArea
              placeholder="Brief description of the content..."
              rows={2}
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
          <Form.Item
            name="content"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Article Content
              </span>
            }
          >
            <Input.TextArea
              placeholder="Write the article content..."
              rows={4}
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
          <Form.Item label="Cover Image">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              fileList={imageFileList}
              onChange={({ fileList }) => setImageFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
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
          setVideoFileList([]);
          setImageFileList([]);
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
        <Form form={videoForm} layout="vertical" className="mt-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
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
            <Input
              placeholder="e.g. Techniques"
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
          <Form.Item
            name="read_time"
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
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Upload Video File <span className="text-red-400">*</span>
              </span>
            }
          >
            <Upload.Dragger
              accept="video/*"
              maxCount={1}
              fileList={videoFileList}
              beforeUpload={(file) => {
                const isVideo = file.type.startsWith("video/");
                if (!isVideo) {
                  message.error("Only video files are allowed!");
                }
                return false;
              }}
              onChange={({ fileList }) => setVideoFileList(fileList)}
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
            name="description"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Content Summary
              </span>
            }
          >
            <Input.TextArea
              placeholder="Brief description of the content..."
              rows={2}
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
          <Form.Item
            name="content"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Video Content
              </span>
            }
          >
            <Input.TextArea
              placeholder="Detailed content or transcript..."
              rows={4}
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
          <Form.Item label="Cover Image (Optional)">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              fileList={imageFileList}
              onChange={({ fileList }) => setImageFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Select Cover Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit/Update Content Modal */}
      <Modal
        title={
          <span className="text-[#2d2416] font-semibold">
            Update {editingItem?.video_url ? "Video" : "Article"}
          </span>
        }
        open={editModal}
        onCancel={() => {
          setEditModal(false);
          editForm.resetFields();
          setEditingItem(null);
          setImageFileList([]);
          setVideoFileList([]);
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
        <Form form={editForm} layout="vertical" className="mt-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
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
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" />
          </Form.Item>
          <Form.Item
            name="read_time"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                {editingItem?.video_url ? "Duration" : "Read Time"}{" "}
                <span className="text-red-400">*</span>
              </span>
            }
            rules={[{ required: true }]}
          >
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" />
          </Form.Item>
          <Form.Item
            name="description"
            label={
              <span className="text-sm font-medium text-[#5c4a32]">
                Description
              </span>
            }
          >
            <Input.TextArea
              rows={2}
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
            />
          </Form.Item>
          {!editingItem?.video_url && (
            <Form.Item
              name="content"
              label={
                <span className="text-sm font-medium text-[#5c4a32]">
                  Article Content
                </span>
              }
            >
              <Input.TextArea
                rows={4}
                className="!rounded-xl !bg-[#f5f0eb] !border-none"
              />
            </Form.Item>
          )}
          <Form.Item label="Update Cover Image">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              fileList={imageFileList}
              onChange={({ fileList }) => setImageFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Select New Image</Button>
            </Upload>
          </Form.Item>
          {editingItem?.video_url && (
            <Form.Item label="Update Video File">
              <Upload
                beforeUpload={() => false}
                accept="video/*"
                maxCount={1}
                fileList={videoFileList}
                onChange={({ fileList }) => setVideoFileList(fileList)}
              >
                <Button icon={<UploadOutlined />}>Select New Video</Button>
              </Upload>
            </Form.Item>
          )}
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
            Delete {deleteConfirm?.video_url ? "Video" : "Article"}?
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
              onClick={() => handleDelete(deleteConfirm?.id)}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        title={
          <span className="text-[#2d2416] font-semibold">
            {viewingItem?.video_url ? "Video Details" : "Article Details"}
          </span>
        }
        open={detailsModal}
        onCancel={() => {
          setDetailsModal(false);
          setViewingItem(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setDetailsModal(false);
              setViewingItem(null);
            }}
            className="!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32]"
          >
            Close
          </Button>
        ]}
        width={700}
      >
        {viewingItem && (
          <div className="mt-4 flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {viewingItem.image_url && (
              <img 
                src={viewingItem.image_url} 
                alt={viewingItem.title} 
                className="w-full h-64 object-cover rounded-xl"
              />
            )}
            {viewingItem.video_url && (
              <video 
                src={viewingItem.video_url} 
                controls 
                className="w-full rounded-xl"
              />
            )}
            <div>
              <h3 className="text-xl font-bold text-[#2d2416] mb-2">{viewingItem.title}</h3>
              <div className="flex gap-2 items-center text-xs text-[#9a8a77] mb-4">
                <Tag color={catColors[viewingItem.category] || "default"} className="!m-0">
                  {viewingItem.category}
                </Tag>
                <span>•</span>
                <span>{viewingItem.read_time}</span>
                <span>•</span>
                <span>{viewingItem.views} views</span>
              </div>
              {viewingItem.description && (
                <p className="text-sm text-[#5c4a32] mb-4 font-medium italic border-l-4 border-[#e3d9cc] pl-3 py-1">
                  {viewingItem.description}
                </p>
              )}
              {viewingItem.content && (
                <div 
                  className="text-sm text-[#5c4a32] whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: viewingItem.content }}
                />
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Category Modal */}
      {/* <Modal
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
      </Modal> */}
    </div>
  );
}
