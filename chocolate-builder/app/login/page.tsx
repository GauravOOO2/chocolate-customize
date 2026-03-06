"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "../../styles/form.module.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured");
      }
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className={styles.container} style={{ maxWidth: "400px", margin: "100px auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ color: "#5d4037", fontWeight: "bold" }}>CHOCOFUEL - Feed the Feeling</h1>
      </div>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={styles.sectionTitle} style={{ textAlign: "center", marginBottom: "20px" }}>Welcome Back</h2>
        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>{error}</p>}
        
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>Login</button>
        
        <p style={{ marginTop: "15px", textAlign: "center", color: "#795548" }}>
          Don't have an account? <Link href="/signup" style={{ color: "#795548", fontWeight: "bold" }}>Sign up here</Link>
        </p>
      </form>
    </div>
  );
}
