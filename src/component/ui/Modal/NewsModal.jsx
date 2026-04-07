// src/component/ui/Modal/NewsModal.jsx
import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Image as ImageIcon } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";

// Props:
// - editingItem: { id, name, description, image }
// - onSave({ name, description, imageFile })
const NewsModal = ({ open, onClose, onSave, editingItem }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || "");
      setDesc(editingItem.description || "");
      setPreviewUrl(editingItem.image || "");
      setImageFile(null); // keep null until user selects a new file
    } else {
      setName("");
      setDesc("");
      setPreviewUrl("");
      setImageFile(null);
    }
  }, [editingItem, open]);

  const handleSubmit = () => {
    if (!name) {
      toast.warning("Please provide a title.");
      return;
    }
    // image optional for edit. for create, you may enforce it here if needed.
    onSave({
      name, // will be mapped to title on parent
      description: desc, // will be mapped to content on parent
      imageFile, // File or null
    });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files && e.target.files[0];
    if (selected) {
      setImageFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
      title={editingItem ? "Edit News" : "Create News"}
      bodyStyle={{ padding: "2rem" }}
      destroyOnClose
    >
      {/* Upload Image */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Upload Image</label>
        <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200 transition relative overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="h-8 w-8 text-gray-500" />
              <span className="text-sm text-gray-700 mt-2">Browse Image</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
        </label>
        {/* If you want image mandatory for create, uncomment: */}
        {/* {!editingItem && !imageFile && <p className="text-xs text-red-500 mt-1">Image is required.</p>} */}
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="News title..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-gray-500 outline-none"
      />

      {/* Content */}
      <ReactQuill
        theme="snow"
        value={desc}
        onChange={setDesc}
        placeholder="Write content..."
        className="mb-6"
      />

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleSubmit}
          className="rounded-md bg-gray-800 px-8 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
        >
          {editingItem ? "Update" : "Save"}
        </button>
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 px-8 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default NewsModal;
