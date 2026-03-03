import Image from "next/image";
import type { ChocolateState } from "./BuilderLayout";
import styles from "../../styles/preview.module.css";

interface ChocolatePreviewProps {
  state: ChocolateState;
}

export default function ChocolatePreview({ state }: ChocolatePreviewProps) {
  // Local asset path
  const placeholderImage = "/assets/sample-chocolate.jpeg";

  const typeLabels = {
    milk: "Milk Chocolate",
    dark: "Dark Chocolate",
    white: "White Chocolate",
    dark_sugar_free: "Dark Sugar Free Chocolate",
  };

  return (
    <div className={styles.container}>
      {/* 1. Visual Reference Preview */}
      <section className={styles.previewCard}>
        <h2 className={styles.title}>Your Chocolate Will Look Like This</h2>
        <div className={styles.imageWrapper}>
          <Image
            src={placeholderImage}
            alt="Sample Chocolate Bar"
            fill
            className={styles.image}
            priority
          />
        </div>
      </section>

      {/* 2. Configuration Summary */}
      <section className={styles.summaryCard}>
        <h2 className={styles.summaryTitle}>Order Summary</h2>
        <div className={styles.summaryList}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Chocolate Type:</span>
            <span className={styles.summaryValue}>{typeLabels[state.chocolateType]}</span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Custom Message:</span>
            <span className={styles.summaryValue}>
              {state.message.trim() || "---"}
            </span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Selected Toppings:</span>
            <span className={styles.summaryValue}>
              {state.toppings.length > 0 ? (
                state.toppings.join(", ")
              ) : (
                <span className={styles.toppingsText}>No toppings selected</span>
              )}
            </span>
          </div>

          <div className={styles.summaryDivider} />

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Receiver Name:</span>
            <span className={styles.summaryValue}>{state.receiverName || "---"}</span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Receiver Number:</span>
            <span className={styles.summaryValue}>{state.receiverNumber || "---"}</span>
          </div>

          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Shipping Address:</span>
            <span className={styles.summaryValue}>{state.shippingAddress || "---"}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
