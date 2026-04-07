import { useState } from "react";
import { Table, Tag, Button, Input, Modal, Form, Select } from "antd";
import { FaPlus, FaFilter, FaEdit, FaTrash } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

const initialProducts = [
  {
    id: 1,
    name: "Calm & Restore Serum",
    brand: "Waxi Essentials",
    type: "Serum",
    ingredients: ["Centella Asia", "Niacinamide"],
    status: "Active",
  },
  {
    id: 2,
    name: "Barrier Repair Cream",
    brand: "Waxi Essentials",
    type: "Moisturizer",
    ingredients: ["Ceramides", "Squalene"],
    status: "Active",
  },
  {
    id: 3,
    name: "Hydrating Toner 1",
    brand: "Waxi Essentials",
    type: "Toner",
    ingredients: ["Glycerin"],
    status: "Active",
  },
  {
    id: 4,
    name: "Hydrating Toner 2",
    brand: "Waxi Essentials",
    type: "Toner",
    ingredients: ["Glycerin"],
    status: "Active",
  },
  {
    id: 5,
    name: "Hydrating Toner 3",
    brand: "Waxi Essentials",
    type: "Toner",
    ingredients: ["Glycerin"],
    status: "Active",
  },
];

const typeColors = { Serum: "blue", Moisturizer: "purple", Toner: "cyan" };

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = () => {
    form.validateFields().then((vals) => {
      const newProduct = {
        id: products.length + 1,
        name: vals.name,
        brand: vals.brand,
        type: vals.type,
        ingredients: vals.ingredients
          ? vals.ingredients.split(",").map((i) => i.trim())
          : [],
        status: "Active",
      };
      setProducts([...products, newProduct]);
      form.resetFields();
      setModalOpen(false);
    });
  };

  const handleDelete = (id) => setProducts(products.filter((p) => p.id !== id));

  const columns = [
    {
      title: (
        <span className="text-xs text-[#9a8a77] font-medium">Product Name</span>
      ),
      dataIndex: "name",
      render: (text, row) => (
        <div>
          <p className="text-sm font-semibold text-[#2d2416]">{text}</p>
          <p className="text-xs text-[#9a8a77]">ID: {row.id}</p>
        </div>
      ),
    },
    {
      title: <span className="text-xs text-[#9a8a77] font-medium">Brand</span>,
      dataIndex: "brand",
      render: (text) => <span className="text-sm text-[#5c4a32]">{text}</span>,
    },
    {
      title: <span className="text-xs text-[#9a8a77] font-medium">Type</span>,
      dataIndex: "type",
      render: (type) => (
        <Tag
          color={typeColors[type] || "default"}
          className="!rounded-full !text-xs"
        >
          {type}
        </Tag>
      ),
    },
    {
      title: (
        <span className="text-xs text-[#9a8a77] font-medium">
          Key Ingredients
        </span>
      ),
      dataIndex: "ingredients",
      render: (ings) => (
        <div className="flex flex-wrap gap-1">
          {ings.slice(0, 2).map((ing, i) => (
            <Tag
              key={i}
              className="!bg-[#f5f0eb] !border-none !text-[#5c4a32] !rounded-full !text-xs"
            >
              {ing}
            </Tag>
          ))}
          {ings.length > 2 && (
            <Tag className="!bg-[#f5f0eb] !border-none !text-[#9a8a77] !rounded-full !text-xs">
              +{ings.length - 2}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: <span className="text-xs text-[#9a8a77] font-medium">Status</span>,
      dataIndex: "status",
      render: () => (
        <Tag color="green" className="!rounded-full !text-xs">
          Active
        </Tag>
      ),
    },
    {
      title: (
        <span className="text-xs text-[#9a8a77] font-medium">Actions</span>
      ),
      render: (_, row) => (
        <div className="flex gap-2">
          <button className="text-[#9a8a77] hover:text-[#2d2416] transition-colors">
            <FaEdit size={15} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="text-[#9a8a77] hover:text-red-500 transition-colors"
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
          <h1 className="text-2xl font-bold text-[#2d2416]">
            Product Database
          </h1>
          <p className="text-sm text-[#9a8a77] mt-0.5">
            Manage skincare products, Ingredients, and AI compatibility rules.
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
        <div className="flex items-center gap-3 p-4 border-b border-[#f0ebe4]">
          <Input
            placeholder="Search products by name, brand, or ingredient..."
            prefix={<FiSearch className="text-[#9a8a77]" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 !bg-[#f5f0eb] !border-none !rounded-xl"
          />
          <Button
            icon={<FaFilter />}
            className="flex items-center gap-2 !bg-[#f5f0eb] !border-none !rounded-xl !text-[#5c4a32]"
          >
            Filter
          </Button>
        </div>

        <Table
          dataSource={filtered}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 5,
            showTotal: (total) => `Showing 1-5 of ${total} products`,
          }}
          className="waxi-table"
          size="middle"
        />
      </div>

      <Modal
        title={
          <span className="text-[#2d2416] font-semibold">Add New Product</span>
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={handleAdd}
        okText="Add Product"
        okButtonProps={{
          className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl",
        }}
        cancelButtonProps={{
          className:
            "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32]",
        }}
        className="waxi-modal"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true }]}
          >
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" />
          </Form.Item>
          <Form.Item name="brand" label="Brand" rules={[{ required: true }]}>
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select
              className="w-full"
              options={["Serum", "Moisturizer", "Toner", "Cleanser", "SPF"].map(
                (v) => ({ value: v, label: v }),
              )}
            />
          </Form.Item>
          <Form.Item
            name="ingredients"
            label="Key Ingredients (comma separated)"
          >
            <Input
              className="!rounded-xl !bg-[#f5f0eb] !border-none"
              placeholder="e.g. Niacinamide, Ceramides"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
