import React from "react";
import { Button, Table, Tag } from "antd";
import { useGetNewOrderQuery } from "../../../redux/features/dashboard/dashboardApi";

const STATUS_STYLES = {
  Pending: "purple",
  Packing: "cyan",
  Processing: "orange",
  Shipping: "blue",
  Shipped: "green",
};

const newOrdersData = {
  data: [
    {
      _id: "68a1f3c2b4e5d6f7a8b9c0d1",
      user: {
        email: "john.doe@gmail.com",
      },
      items: [
        { productId: "p1", name: "Wireless Headphones", qty: 1, price: 59 },
        { productId: "p2", name: "Phone Case", qty: 2, price: 15 },
      ],
      total: 89,
      transactionID: "txn_abc123",
      paymentStatus: "paid",
      status: "Shipping",
    },
    {
      _id: "68a1f3c2b4e5d6f7a8b9c0d2",
      user: {
        email: "sara.khan@outlook.com",
      },
      items: [
        { productId: "p3", name: "Mechanical Keyboard", qty: 1, price: 120 },
      ],
      total: 120,
      transactionID: "txn_def456",
      paymentStatus: "unpaid",
      status: "Pending",
    },
    {
      _id: "68a1f3c2b4e5d6f7a8b9c0d3",
      user: {
        email: "mike.jones@yahoo.com",
      },
      items: [
        { productId: "p4", name: "USB-C Hub", qty: 1, price: 45 },
        { productId: "p5", name: "Mouse Pad XL", qty: 1, price: 20 },
        { productId: "p6", name: "Cable Organizer", qty: 3, price: 10 },
      ],
      total: 95,
      transactionID: "txn_ghi789",
      paymentStatus: "paid",
      status: "Packing",
    },
    {
      _id: "68a1f3c2b4e5d6f7a8b9c0d4",
      user: {
        email: "nina.patel@gmail.com",
      },
      items: [{ productId: "p7", name: "Smart Watch", qty: 1, price: 199 }],
      total: 199,
      transactionID: "txn_jkl012",
      paymentStatus: "paid",
      status: "Shipped",
    },
    {
      _id: "68a1f3c2b4e5d6f7a8b9c0d5",
      user: {
        email: "alex.brown@hotmail.com",
      },
      items: [
        { productId: "p8", name: "Laptop Stand", qty: 1, price: 35 },
        { productId: "p9", name: "Webcam HD", qty: 1, price: 75 },
      ],
      total: 110,
      transactionID: "txn_mno345",
      paymentStatus: "paid",
      status: "Processing",
    },
  ],
};

export default function NewOrdersTable() {
  const data = newOrdersData?.data.slice(0, 5) || [];

  const currency = (v) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const columns = [
    {
      title: "Order No",
      dataIndex: "_id",
      key: "orderNo",
      render: (text) => `#${text}`,
    },
    {
      title: "User Email",
      dataIndex: ["user", "email"],
      render: (email) => email,
      key: "email",
    },
    {
      title: "Total Items",
      dataIndex: "items",
      key: "items",
      render: (items) => items?.length || 0,
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "total",
      key: "price",
      render: (price) => currency(price),
      align: "right",
    },
    {
      title: "Tnx Status",
      dataIndex: "transactionID",
      key: "transactionID",
      render: (text, record) =>
        record.paymentStatus
          ? record.paymentStatus === "unpaid"
            ? "unpaid"
            : "paid"
          : "N/A",
    },
    {
      title: "Status",
      key: "status",
      render: (text, record) => {
        const currentStatus = record.status;
        return <Tag color={STATUS_STYLES[currentStatus]}>{currentStatus}</Tag>;
      },
      align: "center",
    },
  ];

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-base font-semibold">New Order</span>
        <Button href="/orders" type="link" className="text-sm text-gray-600">
          View all
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        pagination={false}
        className="border-t"
      />
    </div>
  );
}
