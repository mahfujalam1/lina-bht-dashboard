export const ROLES = ["Admin", "Lagit Checker"];

export const ROLE_COLOR = {
  Admin: "volcano",
  "Lagit Checker": "geekblue",
};

export const STATUS_COLOR = {
  Active: "green",
  Inactive: "red",
  Pending: "orange",
};

export const initialUsers = [
  {
    _id: "user-001",
    name: "Arif Hossain",
    email: "arif@example.com",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=11",
    status: "Active",
  },
  {
    _id: "user-002",
    name: "Sadia Islam",
    email: "sadia@example.com",
    role: "Lagit Checker",
    avatar: "https://i.pravatar.cc/150?img=47",
    status: "Active",
  },
  {
    _id: "user-003",
    name: "Rahim Uddin",
    email: "rahim@example.com",
    role: "Lagit Checker",
    avatar: "https://i.pravatar.cc/150?img=53",
    status: "Pending",
  },
  {
    _id: "user-004",
    name: "Nasrin Akter",
    email: "nasrin@example.com",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=32",
    status: "Inactive",
  },
];
