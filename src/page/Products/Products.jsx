import { useState } from "react";
import { Table, Tag, Button, Input, Modal, Form, Select, Upload, InputNumber } from "antd";
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { 
  useGetAllProductsQuery, 
  useAddProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation 
} from "../../redux/features/product/productApi";

export default function Products() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTier, setFilterTier] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const { data, isLoading } = useGetAllProductsQuery({
    search,
    condition: filterStatus !== "All" ? filterStatus : undefined,
    category: filterType !== "All" ? filterType : undefined,
    price_tier: filterTier !== "All" ? filterTier : undefined,
    limit: 50,
    offset: 0
  });

  const products = data?.items || [];

  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleAdd = () => {
    form.validateFields().then(async (vals) => {
      const formData = new FormData();
      formData.append("name", vals.name);
      formData.append("categories", vals.categories);
      formData.append("detected_conditions", vals.detected_conditions || "");
      if (vals.brand) formData.append("brand", vals.brand);
      if (vals.price !== undefined && vals.price !== null) formData.append("price", vals.price);
      if (vals.price_tier && vals.price_tier !== "none") formData.append("price_tier", vals.price_tier);
      if (vals.barcode) formData.append("barcode", vals.barcode);
      if (vals.key_ingredients) formData.append("key_ingredients", vals.key_ingredients);

      if (fileList[0]?.originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }

      try {
        await addProduct(formData).unwrap();
        toast.success("Product added successfully");
        form.resetFields();
        setFileList([]);
        setModalOpen(false);
      } catch (error) {
        toast.error("Failed to add product");
      }
    });
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    editForm.setFieldsValue({
      name: record.name,
      brand: record.brand,
      price: record.price,
      price_tier: record.price_tier || "none",
      barcode: record.barcode,
      key_ingredients: Array.isArray(record.key_ingredients) ? record.key_ingredients.join(", ") : record.key_ingredients,
      categories: record.categories?.join(", "),
      detected_conditions: record.detected_conditions?.join(", "),
    });
    setFileList([]);
    setEditModal(true);
  };

  const handleUpdate = () => {
    editForm.validateFields().then(async (vals) => {
      const formData = new FormData();
      formData.append("name", vals.name);
      formData.append("categories", vals.categories);
      formData.append("detected_conditions", vals.detected_conditions || "");
      if (vals.brand !== undefined) formData.append("brand", vals.brand || "");
      if (vals.price !== undefined && vals.price !== null) formData.append("price", vals.price);
      if (vals.price_tier && vals.price_tier !== "none") formData.append("price_tier", vals.price_tier);
      if (vals.barcode !== undefined) formData.append("barcode", vals.barcode || "");
      if (vals.key_ingredients !== undefined) formData.append("key_ingredients", vals.key_ingredients || "");

      if (fileList[0]?.originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }

      try {
        await updateProduct({ id: editingProduct.id, formdata: formData }).unwrap();
        toast.success("Product updated successfully");
        editForm.resetFields();
        setFileList([]);
        setEditModal(false);
        setEditingProduct(null);
      } catch (error) {
        toast.error("Failed to update product");
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
    setDeleteConfirm(null);
  };

  const renderTierTag = (tier) => {
    if (!tier) return <Tag className="!rounded-full !text-xs !bg-gray-100 !text-gray-500">Auto Match</Tag>;
    switch (tier.toLowerCase()) {
      case "best_value":
        return <Tag color="green" className="!rounded-full !text-xs font-semibold">Best Value</Tag>;
      case "best_match":
        return <Tag color="blue" className="!rounded-full !text-xs font-semibold">Best Match</Tag>;
      case "premium":
        return <Tag color="purple" className="!rounded-full !text-xs font-semibold">Premium</Tag>;
      default:
        return <Tag className="!rounded-full !text-xs">{tier}</Tag>;
    }
  };

  const columns = [
    {
      title: <span className="text-xs text-[#9a8a77] font-medium">Product & Brand</span>,
      dataIndex: "name",
      render: (text, row) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            <img src={row.image_url} alt={text} className="w-10 h-10 rounded-full object-cover border border-[#ede6db]" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
              {text?.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-[#2d2416]">{text}</p>
            <p className="text-xs text-[#9a8a77]">{row.brand ? `Brand: ${row.brand}` : `ID: ${row.id?.substring(0, 8)}`}</p>
          </div>
        </div>
      ),
    },
    {
      title: <span className="text-xs text-[#9a8a77] font-medium">Price & Tier</span>,
      key: "price_tier",
      render: (_, row) => (
        <div>
          <p className="text-sm font-bold text-[#2d2416]">
            {row.price !== null && row.price !== undefined ? `$${Number(row.price).toFixed(2)}` : "—"}
          </p>
          <div className="mt-0.5">{renderTierTag(row.price_tier)}</div>
        </div>
      ),
    },
    {
      title: <span className="text-xs text-[#9a8a77] font-medium">Categories</span>,
      dataIndex: "categories",
      render: (cats) => (
        <div className="flex flex-wrap gap-1">
          {cats?.map((type, i) => (
            <Tag key={i} color="blue" className="!rounded-full !text-xs">
              {type}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: <span className="text-xs text-[#9a8a77] font-medium">Active Ingredients</span>,
      dataIndex: "key_ingredients",
      render: (ings) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {ings && ings.length > 0 ? (
            ings.map((ing, i) => (
              <Tag key={i} color="cyan" className="!rounded-full !text-xs">
                {ing}
              </Tag>
            ))
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>
      ),
    },
    {
      title: <span className="text-xs text-[#9a8a77] font-medium">Target Conditions</span>,
      dataIndex: "detected_conditions",
      render: (conds) => (
        <div className="flex flex-wrap gap-1 max-w-[180px]">
          {conds?.map((c, i) => (
            <Tag key={i} color="orange" className="!rounded-full !text-xs">
              {c}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: <span className="text-xs text-[#9a8a77] font-medium">Actions</span>,
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-[#9a8a77] hover:text-[#2d2416] transition-colors p-1.5"
            title="Edit Product"
          >
            <FaEdit size={15} />
          </button>
          <button
            onClick={() => setDeleteConfirm(row)}
            className="text-[#9a8a77] hover:text-red-500 transition-colors p-1.5"
            title="Delete Product"
          >
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2416]">Product Database</h1>
          <p className="text-sm text-[#9a8a77] mt-0.5">
            Manage skincare products, 3-Option Tiers (Best Value, Best Match, Premium), and Active Ingredients.
          </p>
        </div>
        <Button
          type="primary"
          icon={<FaPlus />}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 !bg-[#2d2416] !border-[#2d2416] !rounded-xl !h-10 !px-5 !font-semibold"
        >
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-[#f0ebe4] flex-wrap">
          <Input
            placeholder="Search products by name..."
            prefix={<FiSearch className="text-[#9a8a77]" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 !bg-[#f5f0eb] !border-none !rounded-xl min-w-[200px]"
          />
          <Select
            value={filterTier}
            onChange={setFilterTier}
            className="w-36"
            options={[
              { value: "All", label: "All Tiers" },
              { value: "best_value", label: "Best Value" },
              { value: "best_match", label: "Best Match" },
              { value: "premium", label: "Premium" },
            ]}
          />
          <Select
            value={filterType}
            onChange={setFilterType}
            className="w-36"
            options={[
              { value: "All", label: "All Categories" },
              { value: "cleanser", label: "Cleanser" },
              { value: "serum", label: "Serum" },
              { value: "moisturizer", label: "Moisturizer" },
              { value: "sunscreen", label: "Sunscreen / SPF" },
              { value: "mask", label: "Mask / Treatment" },
              { value: "scalp_serum", label: "Scalp Serum" },
            ]}
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            className="w-36"
            options={[
              { value: "All", label: "All Conditions" },
              { value: "oiliness", label: "Oiliness" },
              { value: "dryness", label: "Dryness" },
              { value: "acne", label: "Acne" },
              { value: "pigmentation", label: "Pigmentation" },
              { value: "fine_lines", label: "Fine Lines" },
            ]}
          />
        </div>

        <Table
          dataSource={products}
          loading={isLoading}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 50 }}
          className="waxi-table"
          size="middle"
        />
      </div>

      {/* Add Product Modal */}
      <Modal
        title={<span className="text-[#2d2416] font-semibold">Add New Product</span>}
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setFileList([]);
        }}
        onOk={handleAdd}
        okText="Add Product"
        okButtonProps={{ className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl" }}
        cancelButtonProps={{ className: "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32]" }}
        width={580}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="name" label="Product Name" rules={[{ required: true, message: "Required" }]}>
              <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. Ceramide Barrier Cream" />
            </Form.Item>
            <Form.Item name="brand" label="Brand Name">
              <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. CeraVe / La Roche-Posay" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="price" label="Price ($ USD / EUR)" rules={[{ required: true, message: "Required" }]}>
              <InputNumber className="!w-full !rounded-xl !bg-[#f5f0eb] !border-none" min={0} step={0.5} placeholder="e.g. 18.50" />
            </Form.Item>
            <Form.Item name="price_tier" label="Price Tier (For 3-Option Engine)" initialValue="none">
              <Select
                className="w-full"
                options={[
                  { value: "none", label: "Auto (AI Categorized)" },
                  { value: "best_value", label: "Best Value" },
                  { value: "best_match", label: "Best Match" },
                  { value: "premium", label: "Premium" },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item name="categories" label="Categories (comma separated)" rules={[{ required: true, message: "Required" }]}>
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. cleanser, serum, moisturizer" />
          </Form.Item>

          <Form.Item name="key_ingredients" label="Key Active Ingredients (comma separated)">
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. Niacinamide, Hyaluronic Acid, Zinc PCA" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="detected_conditions" label="Target Conditions (comma separated)">
              <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. acne, redness, oiliness" />
            </Form.Item>
            <Form.Item name="barcode" label="Barcode / UPC (Optional)">
              <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. 3600523457441" />
            </Form.Item>
          </div>

          <Form.Item label="Product Image">
            <Upload beforeUpload={() => false} maxCount={1} fileList={fileList} onChange={({ fileList }) => setFileList(fileList)}>
              <Button icon={<UploadOutlined />}>Select Product Photo</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit/Update Product Modal */}
      <Modal
        title={<span className="text-[#2d2416] font-semibold">Update Product</span>}
        open={editModal}
        onCancel={() => {
          setEditModal(false);
          editForm.resetFields();
          setFileList([]);
          setEditingProduct(null);
        }}
        onOk={handleUpdate}
        okText="Update Product"
        okButtonProps={{ className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl" }}
        cancelButtonProps={{ className: "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32]" }}
        width={580}
      >
        <Form form={editForm} layout="vertical" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="name" label="Product Name" rules={[{ required: true, message: "Required" }]}>
              <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" />
            </Form.Item>
            <Form.Item name="brand" label="Brand Name">
              <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="price" label="Price ($ USD / EUR)">
              <InputNumber className="!w-full !rounded-xl !bg-[#f5f0eb] !border-none" min={0} step={0.5} />
            </Form.Item>
            <Form.Item name="price_tier" label="Price Tier (For 3-Option Engine)">
              <Select
                className="w-full"
                options={[
                  { value: "none", label: "Auto (AI Categorized)" },
                  { value: "best_value", label: "Best Value" },
                  { value: "best_match", label: "Best Match" },
                  { value: "premium", label: "Premium" },
                ]}
              />
            </Form.Item>
          </div>

          <Form.Item name="categories" label="Categories (comma separated)" rules={[{ required: true, message: "Required" }]}>
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" />
          </Form.Item>

          <Form.Item name="key_ingredients" label="Key Active Ingredients (comma separated)">
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. Niacinamide, Hyaluronic Acid" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item name="detected_conditions" label="Target Conditions (comma separated)">
              <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" />
            </Form.Item>
            <Form.Item name="barcode" label="Barcode / UPC">
              <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" />
            </Form.Item>
          </div>

          <Form.Item label="Product Image">
            <Upload beforeUpload={() => false} maxCount={1} fileList={fileList} onChange={({ fileList }) => setFileList(fileList)}>
              <Button icon={<UploadOutlined />}>Select File (Leave empty to keep existing)</Button>
            </Upload>
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
          <h3 className="text-lg font-semibold text-[#2d2416] mb-1">Delete Product?</h3>
          <p className="text-sm text-[#9a8a77] text-center mb-5">
            Are you sure you want to delete <span className="font-semibold text-[#2d2416]">"{deleteConfirm?.name}"</span>?
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
    </div>
  );
}
