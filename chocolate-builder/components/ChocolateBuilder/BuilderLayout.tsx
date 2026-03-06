"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ChocolateForm from "./ChocolateForm";
import ChocolatePreview from "./ChocolatePreview";
import styles from "../../styles/builder.module.css";

export type ChocolateType = "milk" | "dark" | "white" | "dark_sugar_free";

export interface ChocolateState {
  chocolateType: ChocolateType;
  message: string;
  toppings: string[];
  shippingAddress: string;
  receiverName: string;
  receiverNumber: string;
}

const TOPPING_OPTIONS = [
  "Almond toppings",
  "Cashew toppings",
  "Pistachio toppings",
  "Walnut toppings",
  "pumpkin seeds",
  "Blue berry",
  "Raisins",
  "Cranberry",
];

const MAX_MESSAGE_LENGTH = 26;

export default function BuilderLayout() {
  const { user, token, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [state, setState] = useState<ChocolateState>({
    chocolateType: "milk",
    message: "",
    toppings: [],
    shippingAddress: "",
    receiverName: "",
    receiverNumber: "",
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleTypeChange = (type: ChocolateType) => {
    setState((prev) => ({ ...prev, chocolateType: type }));
  };

  const handleMessageChange = (value: string) => {
    const nextMessage = value.toUpperCase().slice(0, MAX_MESSAGE_LENGTH);
    setState((prev) => ({ ...prev, message: nextMessage }));
  };

  const handleToppingToggle = (topping: string) => {
    const isSelected = state.toppings.includes(topping);
    
    if (!isSelected && state.toppings.length >= 5) {
      alert("You can select up to 5 toppings only.");
      return;
    }

    setState((prev) => {
      const nextToppings = isSelected
        ? prev.toppings.filter((t) => t !== topping)
        : [...prev.toppings, topping];
      return { ...prev, toppings: nextToppings };
    });
  };

  const handleInputChange = (field: keyof ChocolateState, value: string) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = 
    state.message.trim().length > 0 &&
    state.shippingAddress.trim().length > 0 &&
    state.receiverName.trim().length > 0 &&
    state.receiverNumber.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please login to place an order");
      router.push("/login");
      return;
    }

    if (isFormValid) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          throw new Error("API URL is not configured");
        }
        const response = await fetch(`${apiUrl}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token || "",
          },
          body: JSON.stringify({
            ...state,
            message: state.message.trim(),
            shippingAddress: state.shippingAddress.trim(),
            receiverName: state.receiverName.trim(),
            receiverNumber: state.receiverNumber.trim(),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Order saved successfully:", data);
          alert("Order placed successfully! We'll start preparing your custom chocolate.");
          // Reset form or redirect
          setState({
            chocolateType: "milk",
            message: "",
            toppings: [],
            shippingAddress: "",
            receiverName: "",
            receiverNumber: "",
          });
        } else {
          const errorData = await response.json();
          if (response.status === 401) {
            alert("Session expired. Please login again.");
            logout();
          } else {
            alert(`Error: ${errorData.message || "Failed to place order"}`);
          }
        }
      } catch (error) {
        console.error("Submission error:", error);
        alert("Something went wrong. Please check if the server is running.");
      }
    }
  };

  if (isLoading || !isAuthenticated) {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</div>;
  }

  return (
    <main className={styles.page}>
      <div style={{ textAlign: "center", paddingTop: "2rem", marginBottom: "0rem" }}>
        <img 
          src="/assets/CHOCOLATE LOGO 2_pages-to-jpg-0002.png" 
          alt="CHOCOFUEL - Feed the Feeling" 
          style={{ width: "90%", maxWidth: "450px", height: "auto" }}
        />
      </div>
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "1rem 2rem",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "2rem",
        marginTop: "1rem"
      }}>
        <div>
          <h2 style={{ margin: 0, color: "#5d4037" }}>Hello, {user?.name}</h2>
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
      <div className={styles.container}>
        <h1 className={`${styles.title} heading-font`}>Chocolate Bar Customizer</h1>
        <div className={styles.layout}>
          <div className={styles.formColumn}>
            <ChocolateForm
              state={state}
              onTypeChange={handleTypeChange}
              onMessageChange={handleMessageChange}
              onToppingToggle={handleToppingToggle}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              maxMessageLength={MAX_MESSAGE_LENGTH}
              toppingOptions={TOPPING_OPTIONS}
              isFormValid={isFormValid}
            />
          </div>
          <div className={styles.previewColumn}>
            <ChocolatePreview state={state} />
          </div>
        </div>
      </div>
    </main>
  );
}
