"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import styles from "../../styles/form.module.css";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not configured");
      }
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container} style={{ maxWidth: "400px", margin: "50px auto" }}>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <img 
          src="/assets/CHOCOLATE LOGO 2_pages-to-jpg-0003.png" 
          alt="CHOCOFUEL - Feed the Feeling" 
          style={{ width: "85%", maxWidth: "400px", height: "auto" }}
        />
      </div>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2 className={`${styles.sectionTitle} heading-font`} style={{ textAlign: "center", marginBottom: "20px" }}>Create Account</h2>
        {error && <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>{error}</p>}
        
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Full Name</label>
          <input
            className={styles.input}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>

        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Sign Up"}
          {isSubmitting && <span className="loader"></span>}
        </button>
        
        <p style={{ marginTop: "15px", textAlign: "center", color: "#795548" }}>
          Already have an account? <Link href="/login" style={{ color: "#795548", fontWeight: "bold" }}>Login here</Link>
        </p>
      </form>
    </div>
  );
}
