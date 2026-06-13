import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Modal,
  Form,
  Select,
  Upload,
  Avatar,
  Drawer,
} from "antd";
import { FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { FiSearch, FiEye } from "react-icons/fi";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import {
  useGetAllNutritionQuery,
  useAddNutritionMutation,
  useUpdateNutritionMutation,
  useDeleteNutritionMutation,
  useGetAllFoodQuery,
  useAddFoodMutation,
  useUpdateFoodMutation,
  useDeleteFoodMutation,
  useGetAllRecipeQuery,
  useAddRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} from "../../redux/features/nutrition/nutritionApi";

const CATEGORY_OPTIONS = [
  { value: "nutrition", label: "Nutrition" },
  { value: "food", label: "Food" },
  { value: "recipe", label: "Recipe" },
];

export default function NutritionPage() {
  const [activeCategory, setActiveCategory] = useState("nutrition");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [detailDrawer, setDetailDrawer] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // ─── Queries ───
  const { data: nutritionData, isLoading: loadingNutrition } =
    useGetAllNutritionQuery({ limit: 100, skip: 0 });
  const { data: foodData, isLoading: loadingFood } = useGetAllFoodQuery({
    limit: 100,
    skip: 0,
  });
  const { data: recipeData, isLoading: loadingRecipe } = useGetAllRecipeQuery({
    limit: 100,
    skip: 0,
  });

  // ─── Mutations ───
  const [addNutrition] = useAddNutritionMutation();
  const [updateNutrition] = useUpdateNutritionMutation();
  const [deleteNutrition] = useDeleteNutritionMutation();

  const [addFood] = useAddFoodMutation();
  const [updateFood] = useUpdateFoodMutation();
  const [deleteFood] = useDeleteFoodMutation();

  const [addRecipe] = useAddRecipeMutation();
  const [updateRecipe] = useUpdateRecipeMutation();
  const [deleteRecipe] = useDeleteRecipeMutation();

  // ─── Data resolution ───
  const resolveData = () => {
    if (activeCategory === "nutrition") return nutritionData || [];
    if (activeCategory === "food") return foodData || [];
    return recipeData || [];
  };

  const rawItems = resolveData();
  const items = Array.isArray(rawItems) ? rawItems : rawItems?.data || rawItems?.items || [];

  const isLoading =
    activeCategory === "nutrition"
      ? loadingNutrition
      : activeCategory === "food"
      ? loadingFood
      : loadingRecipe;

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ─── CRUD helpers ───
  const getAddMutation = () => {
    if (activeCategory === "nutrition") return addNutrition;
    if (activeCategory === "food") return addFood;
    return addRecipe;
  };

  const getUpdateMutation = () => {
    if (activeCategory === "nutrition") return updateNutrition;
    if (activeCategory === "food") return updateFood;
    return updateRecipe;
  };

  const getDeleteMutation = () => {
    if (activeCategory === "nutrition") return deleteNutrition;
    if (activeCategory === "food") return deleteFood;
    return deleteRecipe;
  };

  // ─── Create handler ───
  const handleAdd = () => {
    form.validateFields().then(async (vals) => {
      const formData = new FormData();
      formData.append("name", vals.name);

      if (activeCategory === "nutrition") {
        formData.append("main_ingredient", vals.main_ingredient || "");
        formData.append("detected_condition", vals.detected_condition || "");
        formData.append("how_it_improves", vals.how_it_improves || "");
      } else if (activeCategory === "food") {
        formData.append("ingredients", vals.ingredients || "");
        formData.append("detected_condition", vals.detected_condition || "");
        formData.append("benefits", vals.benefits || "");
      } else {
        formData.append("main_ingredients", vals.main_ingredients || "");
        formData.append("detected_condition", vals.detected_condition || "");
        formData.append("how_it_improves", vals.how_it_improves || "");
        formData.append("tags", vals.tags || "");
      }

      if (fileList[0]?.originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }

      try {
        const mutationFn = getAddMutation();
        await mutationFn(formData).unwrap();
        toast.success(`${activeCategory} added successfully`);
        form.resetFields();
        setFileList([]);
        setModalOpen(false);
      } catch (error) {
        toast.error(error?.data?.message || `Failed to add ${activeCategory}`);
      }
    });
  };

  // ─── Edit handler ───
  const handleEdit = (record) => {
    setEditingItem(record);
    if (activeCategory === "nutrition") {
      editForm.setFieldsValue({
        name: record.name,
        main_ingredient: record["main ingredient"] || record.main_ingredient,
        detected_condition: Array.isArray(record.detected_condition)
          ? record.detected_condition.join(", ")
          : record.detected_condition,
        how_it_improves: record["how to improves"] || record.how_it_improves,
      });
    } else if (activeCategory === "food") {
      editForm.setFieldsValue({
        name: record.name,
        ingredients: Array.isArray(record.ingredients)
          ? record.ingredients.join(", ")
          : record.ingredients,
        detected_condition: Array.isArray(record.detected_condition)
          ? record.detected_condition.join(", ")
          : record.detected_condition,
        benefits: record.benefits,
      });
    } else {
      editForm.setFieldsValue({
        name: record.name,
        main_ingredients: Array.isArray(record.main_ingredients)
          ? record.main_ingredients.join(", ")
          : record.main_ingredients,
        detected_condition: Array.isArray(record.detected_condition)
          ? record.detected_condition.join(", ")
          : record.detected_condition,
        how_it_improves: record.how_it_improves,
        tags: Array.isArray(record.tags) ? record.tags.join(", ") : record.tags,
      });
    }
    setFileList([]);
    setEditModal(true);
  };

  const handleUpdate = () => {
    editForm.validateFields().then(async (vals) => {
      const formData = new FormData();

      if (activeCategory === "nutrition") {
        if (vals.name) formData.append("name", vals.name);
        if (vals.main_ingredient) formData.append("main_ingredient", vals.main_ingredient);
        if (vals.detected_condition) formData.append("detected_condition", vals.detected_condition);
        if (vals.how_it_improves) formData.append("how_it_improves", vals.how_it_improves);
      } else if (activeCategory === "food") {
        if (vals.name) formData.append("name", vals.name);
        if (vals.ingredients) formData.append("ingredients", vals.ingredients);
        if (vals.detected_condition) formData.append("detected_condition", vals.detected_condition);
        if (vals.benefits) formData.append("benefits", vals.benefits);
      } else {
        if (vals.name) formData.append("name", vals.name);
        if (vals.main_ingredients) formData.append("main_ingredients", vals.main_ingredients);
        if (vals.detected_condition) formData.append("detected_condition", vals.detected_condition);
        if (vals.how_it_improves) formData.append("how_it_improves", vals.how_it_improves);
        if (vals.tags) formData.append("tags", vals.tags);
      }

      if (fileList[0]?.originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }

      try {
        const mutationFn = getUpdateMutation();
        await mutationFn({ id: editingItem.id, formdata: formData }).unwrap();
        toast.success(`${activeCategory} updated successfully`);
        editForm.resetFields();
        setFileList([]);
        setEditModal(false);
        setEditingItem(null);
      } catch (error) {
        toast.error(error?.data?.message || `Failed to update ${activeCategory}`);
      }
    });
  };

  // ─── Delete handler ───
  const handleDelete = async (id) => {
    try {
      const mutationFn = getDeleteMutation();
      await mutationFn(id).unwrap();
      toast.success(`${activeCategory} deleted successfully`);
    } catch (error) {
      toast.error(error?.data?.message || `Failed to delete ${activeCategory}`);
    }
    setDeleteConfirm(null);
  };

  // ─── Image helper ───
  const getImageUrl = (row) =>
    row.image_url || row["image url"] || row.icon_url || null;

  // ─── Table columns ───
  const columns = [
    {
      title: (
        <span className="text-xs text-[#9a8a77] font-medium">Name</span>
      ),
      dataIndex: "name",
      render: (text, row) => (
        <div className="flex items-center gap-3">
          {getImageUrl(row) ? (
            <img
              src={getImageUrl(row)}
              alt={text}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#f0ebe4] flex items-center justify-center text-[#9a8a77] text-sm font-bold">
              {text?.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-[#2d2416]">{text}</p>
            <p className="text-xs text-[#9a8a77]">
              ID: {row.id?.substring(0, 10)}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: (
        <span className="text-xs text-[#9a8a77] font-medium">
          Detected Conditions
        </span>
      ),
      dataIndex: "detected_condition",
      render: (conds) => (
        <div className="flex flex-wrap gap-1">
          {(Array.isArray(conds) ? conds : [])?.map((c, i) => (
            <Tag key={i} color="orange" className="!rounded-full !text-xs">
              {c}
            </Tag>
          ))}
        </div>
      ),
    },
    ...(activeCategory === "nutrition"
      ? [
          {
            title: (
              <span className="text-xs text-[#9a8a77] font-medium">
                Main Ingredient
              </span>
            ),
            render: (_, row) => (
              <span className="text-sm text-[#2d2416]">
                {row["main ingredient"] || row.main_ingredient || "-"}
              </span>
            ),
          },
        ]
      : []),
    ...(activeCategory === "food"
      ? [
          {
            title: (
              <span className="text-xs text-[#9a8a77] font-medium">
                Ingredients
              </span>
            ),
            dataIndex: "ingredients",
            render: (ings) => (
              <div className="flex flex-wrap gap-1">
                {(Array.isArray(ings) ? ings : [])?.map((ing, i) => (
                  <Tag
                    key={i}
                    color="blue"
                    className="!rounded-full !text-xs"
                  >
                    {ing}
                  </Tag>
                ))}
              </div>
            ),
          },
        ]
      : []),
    ...(activeCategory === "recipe"
      ? [
          {
            title: (
              <span className="text-xs text-[#9a8a77] font-medium">
                Main Ingredients
              </span>
            ),
            dataIndex: "main_ingredients",
            render: (ings) => (
              <div className="flex flex-wrap gap-1">
                {(Array.isArray(ings) ? ings : [])?.map((ing, i) => (
                  <Tag
                    key={i}
                    color="green"
                    className="!rounded-full !text-xs"
                  >
                    {ing}
                  </Tag>
                ))}
              </div>
            ),
          },
        ]
      : []),
    {
      title: (
        <span className="text-xs text-[#9a8a77] font-medium">Actions</span>
      ),
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => setDetailDrawer(row)}
            className="text-[#9a8a77] hover:text-blue-500 transition-colors"
          >
            <FiEye size={16} />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="text-[#9a8a77] hover:text-[#2d2416] transition-colors"
          >
            <FaEdit size={15} />
          </button>
          <button
            onClick={() => setDeleteConfirm(row)}
            className="text-[#9a8a77] hover:text-red-500 transition-colors"
          >
            <FaTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  // ─── Dynamic form fields ───
  const renderFormFields = (isEdit = false) => {
    if (activeCategory === "nutrition") {
      return (
        <>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: !isEdit, message: "Please enter a name" }]}
          >
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. Selenium" />
          </Form.Item>
          <Form.Item
            name="main_ingredient"
            label="Main Ingredient"
            rules={[{ required: !isEdit }]}
          >
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. Brazil Nuts" />
          </Form.Item>
          <Form.Item
            name="detected_condition"
            label="Detected Condition (comma separated)"
            rules={[{ required: !isEdit }]}
          >
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. dandruff, inflammation" />
          </Form.Item>
          <Form.Item
            name="how_it_improves"
            label="How It Improves"
            rules={[{ required: !isEdit }]}
          >
            <Input.TextArea className="!rounded-xl !bg-[#f5f0eb] !border-none" rows={3} placeholder="How this nutrition improves skin health" />
          </Form.Item>
        </>
      );
    }
    if (activeCategory === "food") {
      return (
        <>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: !isEdit, message: "Please enter a name" }]}
          >
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. Salmon" />
          </Form.Item>
          <Form.Item
            name="ingredients"
            label="Ingredients (comma separated)"
            rules={[{ required: !isEdit }]}
          >
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. Omega-3, Protein" />
          </Form.Item>
          <Form.Item
            name="detected_condition"
            label="Detected Condition (comma separated)"
            rules={[{ required: !isEdit }]}
          >
            <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. acne, inflammation" />
          </Form.Item>
          <Form.Item
            name="benefits"
            label="Benefits"
            rules={[{ required: !isEdit }]}
          >
            <Input.TextArea className="!rounded-xl !bg-[#f5f0eb] !border-none" rows={3} placeholder="e.g. Supports skin repair and hydration" />
          </Form.Item>
        </>
      );
    }
    // recipe
    return (
      <>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: !isEdit, message: "Please enter a name" }]}
        >
          <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. Salmon Avocado Salad" />
        </Form.Item>
        <Form.Item
          name="main_ingredients"
          label="Main Ingredients (comma separated)"
          rules={[{ required: !isEdit }]}
        >
          <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. Salmon, Avocado" />
        </Form.Item>
        <Form.Item
          name="detected_condition"
          label="Detected Condition (comma separated)"
          rules={[{ required: !isEdit }]}
        >
          <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. acne, dryness" />
        </Form.Item>
        <Form.Item
          name="how_it_improves"
          label="How It Improves"
          rules={[{ required: !isEdit }]}
        >
          <Input.TextArea className="!rounded-xl !bg-[#f5f0eb] !border-none" rows={3} placeholder="How this recipe improves skin" />
        </Form.Item>
        <Form.Item name="tags" label="Tags (comma separated)">
          <Input className="!rounded-xl !bg-[#f5f0eb] !border-none" placeholder="e.g. #acne #dryness #omega3" />
        </Form.Item>
      </>
    );
  };

  // ─── Detail Drawer content ───
  const renderDetailContent = () => {
    if (!detailDrawer) return null;
    const row = detailDrawer;
    const imgUrl = getImageUrl(row);

    return (
      <div className="space-y-5">
        {imgUrl && (
          <div className="flex justify-center">
            <img
              src={imgUrl}
              alt={row.name}
              className="w-32 h-32 rounded-2xl object-cover shadow-md"
            />
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-[#2d2416]">{row.name}</h3>
          <p className="text-xs text-[#9a8a77] mt-0.5">ID: {row.id}</p>
        </div>

        {/* Conditions */}
        {row.detected_condition && (
          <div>
            <p className="text-xs font-semibold text-[#9a8a77] mb-1.5">
              Detected Conditions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(row.detected_condition)
                ? row.detected_condition
                : []
              ).map((c, i) => (
                <Tag key={i} color="orange" className="!rounded-full !text-xs">
                  {c}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Category-specific */}
        {activeCategory === "nutrition" && (
          <>
            <div>
              <p className="text-xs font-semibold text-[#9a8a77] mb-0.5">
                Main Ingredient
              </p>
              <p className="text-sm text-[#2d2416]">
                {row["main ingredient"] || row.main_ingredient || "-"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#9a8a77] mb-0.5">
                How It Improves
              </p>
              <p className="text-sm text-[#2d2416]">
                {row["how to improves"] || row.how_it_improves || "-"}
              </p>
            </div>
          </>
        )}

        {activeCategory === "food" && (
          <>
            <div>
              <p className="text-xs font-semibold text-[#9a8a77] mb-1.5">
                Ingredients
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(row.ingredients) ? row.ingredients : []).map(
                  (c, i) => (
                    <Tag
                      key={i}
                      color="blue"
                      className="!rounded-full !text-xs"
                    >
                      {c}
                    </Tag>
                  )
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#9a8a77] mb-0.5">
                Benefits
              </p>
              <p className="text-sm text-[#2d2416]">{row.benefits || "-"}</p>
            </div>
          </>
        )}

        {activeCategory === "recipe" && (
          <>
            <div>
              <p className="text-xs font-semibold text-[#9a8a77] mb-1.5">
                Main Ingredients
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(row.main_ingredients)
                  ? row.main_ingredients
                  : []
                ).map((c, i) => (
                  <Tag
                    key={i}
                    color="green"
                    className="!rounded-full !text-xs"
                  >
                    {c}
                  </Tag>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#9a8a77] mb-0.5">
                How It Improves
              </p>
              <p className="text-sm text-[#2d2416]">
                {row.how_it_improves || "-"}
              </p>
            </div>
            {row.tags && (
              <div>
                <p className="text-xs font-semibold text-[#9a8a77] mb-1.5">
                  Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(row.tags) ? row.tags : []).map((t, i) => (
                    <Tag
                      key={i}
                      color="purple"
                      className="!rounded-full !text-xs"
                    >
                      {t}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const categoryLabel =
    activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1);

  return (
    <div>
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-[#2d2416]">
            Nutrition Database
          </h1>
          <p className="text-sm text-[#9a8a77] mt-0.5">
            Manage nutrition, food, and recipe items for skin health
            recommendations.
          </p>
        </div>
        <Button
          type="primary"
          icon={<FaPlus />}
          onClick={() => {
            form.resetFields();
            setFileList([]);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 !bg-[#2d2416] !border-[#2d2416] !rounded-xl !h-10 !px-5 !font-semibold"
        >
          Add {categoryLabel}
        </Button>
      </div>

      {/* ─── Table card ─── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-[#f0ebe4] flex-wrap">
          <Input
            placeholder={`Search ${categoryLabel} by name...`}
            prefix={<FiSearch className="text-[#9a8a77]" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 !bg-[#f5f0eb] !border-none !rounded-xl min-w-[200px]"
          />
          <Select
            value={activeCategory}
            onChange={(val) => {
              setActiveCategory(val);
              setSearch("");
            }}
            className="w-40"
            options={CATEGORY_OPTIONS}
          />
        </div>

        <Table
          dataSource={filteredItems}
          loading={isLoading}
          columns={columns}
          rowKey={(r) => r._id || r.id}
          pagination={{ pageSize: 20 }}
          className="waxi-table"
          size="middle"
        />
      </div>

      {/* ─── Add Modal ─── */}
      <Modal
        title={
          <span className="text-[#2d2416] font-semibold">
            Add New {categoryLabel}
          </span>
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setFileList([]);
        }}
        onOk={handleAdd}
        okText={`Add ${categoryLabel}`}
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
          {renderFormFields(false)}
          <Form.Item label="Image">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* ─── Edit Modal ─── */}
      <Modal
        title={
          <span className="text-[#2d2416] font-semibold">
            Update {categoryLabel}
          </span>
        }
        open={editModal}
        onCancel={() => {
          setEditModal(false);
          editForm.resetFields();
          setFileList([]);
          setEditingItem(null);
        }}
        onOk={handleUpdate}
        okText={`Update ${categoryLabel}`}
        okButtonProps={{
          className: "!bg-[#2d2416] !border-[#2d2416] !rounded-xl",
        }}
        cancelButtonProps={{
          className:
            "!rounded-xl !bg-[#f5f0eb] !border-[#f5f0eb] !text-[#5c4a32]",
        }}
        className="waxi-modal"
      >
        <Form form={editForm} layout="vertical" className="mt-4">
          {renderFormFields(true)}
          <Form.Item label="Image">
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>
                Select File (Leave empty to keep existing)
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* ─── Delete Confirm ─── */}
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
            Delete {categoryLabel}?
          </h3>
          <p className="text-sm text-[#9a8a77] text-center mb-5">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#2d2416]">
              &quot;{deleteConfirm?.name}&quot;
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

      {/* ─── Detail Drawer ─── */}
      <Drawer
        title={
          <span className="text-[#2d2416] font-semibold">
            {categoryLabel} Details
          </span>
        }
        open={!!detailDrawer}
        onClose={() => setDetailDrawer(null)}
        width={400}
      >
        {renderDetailContent()}
      </Drawer>
    </div>
  );
}
