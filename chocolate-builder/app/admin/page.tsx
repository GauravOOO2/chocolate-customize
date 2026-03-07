"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "../../styles/builder.module.css";

interface Order {
  _id: string;
  chocolateType: string;
  message: string;
  toppings: string[];
  shippingAddress: string;
  receiverName: string;
  receiverNumber: string;
  isReceived: boolean;
  isShipped: boolean;
  createdAt: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

interface UserWithOrders {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
  orders: Order[];
}

export default function AdminPage() {
  const { user, token, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [adminData, setAdminData] = useState<{ users: UserWithOrders[]; allOrders: Order[] } | null>(null);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [updatingOrders, setUpdatingOrders] = useState<Record<string, boolean>>({});

  const fetchAdminData = async () => {
    if (!token) return;
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/admin/data`, {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAdminData(data);
      } else {
        setError("Failed to fetch admin data");
        if (response.status === 401 || response.status === 403) {
          alert("Unauthorized access");
          router.push("/login");
        }
      }
    } catch (err) {
      setError("An error occurred while fetching data");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchAdminData();
    }
  }, [token, isAuthenticated, user, router]);

  const handleStatusUpdate = async (orderId: string, field: "isReceived" | "isShipped", value: boolean) => {
    setUpdatingOrders(prev => ({ ...prev, [orderId]: true }));
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        // Refresh data to show changes
        await fetchAdminData();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("An error occurred");
    } finally {
      setUpdatingOrders(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const renderOrderTable = (orders: Order[]) => (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <th style={{ padding: "10px" }}>Date</th>
            <th style={{ padding: "10px" }}>Type</th>
            <th style={{ padding: "10px" }}>Message</th>
            <th style={{ padding: "10px" }}>Toppings</th>
            <th style={{ padding: "10px" }}>Receiver</th>
            <th style={{ padding: "10px" }}>Status</th>
            <th style={{ padding: "10px" }}>Address</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} style={{ borderBottom: "1px solid #f9f9f9", backgroundColor: o.isShipped ? "#f1f8e9" : "transparent" }}>
              <td style={{ padding: "10px", fontSize: "0.9em" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td style={{ padding: "10px", textTransform: "capitalize" }}>{o.chocolateType.replace(/_/g, " ")}</td>
              <td style={{ padding: "10px", fontStyle: "italic" }}>"{o.message}"</td>
              <td style={{ padding: "10px", fontSize: "0.85em" }}>
                {o.toppings.length > 0 ? o.toppings.join(", ") : "None"}
              </td>
              <td style={{ padding: "10px" }}>{o.receiverName} ({o.receiverNumber})</td>
              <td style={{ padding: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <label style={{ fontSize: "0.85em", display: "flex", alignItems: "center", gap: "5px" }}>
                    <input 
                      type="checkbox" 
                      checked={o.isReceived} 
                      disabled={updatingOrders[o._id]}
                      onChange={(e) => handleStatusUpdate(o._id, "isReceived", e.target.checked)}
                    /> Received
                  </label>
                  <label style={{ fontSize: "0.85em", display: "flex", alignItems: "center", gap: "5px" }}>
                    <input 
                      type="checkbox" 
                      checked={o.isShipped} 
                      disabled={updatingOrders[o._id]}
                      onChange={(e) => handleStatusUpdate(o._id, "isShipped", e.target.checked)}
                    /> Shipped
                  </label>
                  {updatingOrders[o._id] && <span className="loader" style={{ width: "12px", height: "12px", border: "2px solid #795548", borderBottomColor: "transparent", margin: "5px 0 0 0" }}></span>}
                </div>
              </td>
              <td style={{ padding: "10px", fontSize: "0.9em" }}>{o.shippingAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (isLoading || loadingData) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading Admin Dashboard...</div>;
  }

  if (user?.role !== "admin") {
    return null;
  }

  return (
    <main className={styles.page}>
      <div style={{ textAlign: "center", paddingTop: "2rem", marginBottom: "-1rem" }}>
        <h1 className="heading-font" style={{ color: "#5d4037", margin: 0, fontWeight: "bold" }}>CHOCOFUEL - Admin Dashboard</h1>
      </div>
      
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "1rem 2rem",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "2rem",
        marginTop: "2rem"
      }}>
        <div>
          <h2 className="heading-font" style={{ margin: 0, color: "#5d4037" }}>Welcome, Admin {user?.name}</h2>
        </div>
        <button 
          onClick={logout}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#795548",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </header>

      <div style={{ padding: "0 2rem" }}>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        
        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ color: "#5d4037", borderBottom: "2px solid #795548", paddingBottom: "10px" }}>Users Orders</h2>
          
          <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
            {adminData?.users.map((u) => (
              u.orders.length > 0 && (
                <div key={u._id} style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                    <div>
                      <h3 style={{ margin: 0, color: "#5d4037" }}>{u.name} {u.role === "admin" && <span style={{ fontSize: "0.7em", backgroundColor: "#795548", color: "white", padding: "2px 6px", borderRadius: "4px", verticalAlign: "middle" }}>ADMIN</span>}</h3>
                      <p style={{ margin: "5px 0", color: "#666" }}>Email: {u.email} | Phone: {u.phoneNumber}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, color: "#888", fontSize: "0.9em" }}>Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
                      <p style={{ margin: "5px 0", fontWeight: "bold", color: "#795548" }}>Total Orders: {u.orders.length}</p>
                    </div>
                  </div>
                  {renderOrderTable(u.orders)}
                </div>
              )
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
