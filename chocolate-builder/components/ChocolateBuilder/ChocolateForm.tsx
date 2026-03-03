import type { ChocolateState, ChocolateType } from "./BuilderLayout";
import styles from "../../styles/form.module.css";

interface ChocolateFormProps {
  state: ChocolateState;
  onTypeChange: (type: ChocolateType) => void;
  onMessageChange: (value: string) => void;
  onToppingToggle: (topping: string) => void;
  onInputChange: (field: keyof ChocolateState, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  maxMessageLength: number;
  toppingOptions: string[];
  isFormValid: boolean;
}

export default function ChocolateForm({
  state,
  onTypeChange,
  onMessageChange,
  onToppingToggle,
  onInputChange,
  onSubmit,
  maxMessageLength,
  toppingOptions,
  isFormValid,
}: ChocolateFormProps) {
  const chocolateTypes: { type: ChocolateType; label: string; hover: string }[] = [
    { type: "milk", label: "Milk Chocolate", hover: "Base will be in \"Brown\"" },
    { type: "dark", label: "Dark Chocolate", hover: "Base will be in \"Black\"" },
    { type: "white", label: "White Chocolate", hover: "Base will be in \"white\"" },
    { type: "dark_sugar_free", label: "Dark Sugar Free", hover: "Base will be in \"Black\"" },
  ];

  return (
    <form className={styles.card} onSubmit={onSubmit} noValidate>
      {/* 1. Chocolate Type Selection */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>1. Chocolate Type</h2>
        <div className={styles.typeGrid}>
          {chocolateTypes.map((item) => (
            <button
              key={item.type}
              type="button"
              title={item.hover}
              className={`${styles.typeButton} ${styles[`${item.type}Button`]} ${
                state.chocolateType === item.type ? styles.selected : ""
              }`}
              onClick={() => onTypeChange(item.type)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Message Input */}
      <section className={styles.section}>
        <div className={styles.messageHeader}>
          <h2 className={styles.sectionTitle}>2. Custom Message *</h2>
          <span className={styles.counter}>
            {state.message.length} / {maxMessageLength}
          </span>
        </div>
        <input
          type="text"
          className={styles.input}
          placeholder="ENTER MESSAGE"
          value={state.message}
          onChange={(e) => onMessageChange(e.target.value)}
          maxLength={maxMessageLength}
          required
        />
        <p className={styles.help}>Message will be automatically capitalized</p>
      </section>

      {/* 3. Toppings Selection */}
      <section className={styles.section}>
        <div className={styles.messageHeader}>
          <h2 className={styles.sectionTitle}>3. Select Toppings</h2>
          <span className={styles.counter}>
            {state.toppings.length} / 5
          </span>
        </div>
        <div className={styles.toppingGrid}>
          {toppingOptions.map((topping) => (
            <button
              key={topping}
              type="button"
              className={`${styles.chip} ${
                state.toppings.includes(topping) ? styles.chipSelected : ""
              }`}
              onClick={() => onToppingToggle(topping)}
            >
              {topping}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Shipping Details */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4. Shipping Information</h2>
        
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Please Enter your shipping address *</label>
          <textarea
            className={styles.textarea}
            value={state.shippingAddress}
            onChange={(e) => onInputChange("shippingAddress", e.target.value)}
            required
            rows={3}
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Please enter receivers name *</label>
          <input
            type="text"
            className={styles.input}
            value={state.receiverName}
            onChange={(e) => onInputChange("receiverName", e.target.value)}
            required
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Please enter receivers number *</label>
          <input
            type="tel"
            className={styles.input}
            value={state.receiverNumber}
            onChange={(e) => onInputChange("receiverNumber", e.target.value)}
            required
          />
        </div>
      </section>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={!isFormValid}
      >
        Complete Selection
      </button>
    </form>
  );
}
