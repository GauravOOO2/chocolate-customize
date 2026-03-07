"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "../styles/form.module.css";
import BuilderLayout from "../components/ChocolateBuilder/BuilderLayout";

export default function Page() {
  const { isAuthenticated, login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("API URL is not configured");

      const response = await fetch(`${apiUrl}/auth/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
      } else {
        setError(data.message || "Failed to proceed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  if (isAuthenticated) {
    return <BuilderLayout />;
  }

  return (
    <div className={styles.container} style={{ maxWidth: "400px", margin: "100px auto" }}>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <img 
          src="/assets/CHOCOLATE LOGO 2_pages-to-jpg-0003.png" 
          alt="CHOCOFUEL - Feed the Feeling" 
          style={{ width: "85%", maxWidth: "400px", height: "auto" }}
        />
      </div>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.sectionTitle} style={{ textAlign: "center", marginBottom: "20px" }}>Chocofuel - feed the feeling</h2>
        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>{error}</p>}
        
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your Full Name"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Phone Number</label>
          <input
            className={styles.input}
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            placeholder="Your Phone Number"
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Your Email Address"
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? "Proceeding..." : "Customize your chocolate"}
        </button>
        
        <p style={{ marginTop: "15px", textAlign: "center", color: "#795548" }}>
          Are you an admin? <Link href="/login" style={{ color: "#795548", fontWeight: "bold" }}>Login here</Link>
        </p>
      </form>
    </div>
  );
}
