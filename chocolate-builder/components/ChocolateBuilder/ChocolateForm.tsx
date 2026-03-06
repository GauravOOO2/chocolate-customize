import React, { useState } from "react";
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

const MESSAGE_IDEAS = [
  {
    category: "❤️ Love Messages (Romantic)",
    ideas: ["I Love You", "Forever Yours", "My Sweetheart", "You Are My World", "Love You Always", "My Forever Person", "You + Me = Forever", "You Melt My Heart", "Love At First Bite", "Sweet Like You", "You’re My Happiness", "My Heart Is Yours", "My Favorite Human", "Love You To The Moon", "My Sweet Love"]
  },
  {
    category: "💍 Proposal Messages",
    ideas: ["Will You Marry Me?", "Be Mine Forever", "Say Yes ❤️", "Forever Starts Today", "Let’s Grow Old Together", "Marry Me My Love", "You Are My Forever", "Our Forever Begins", "My Life My Love", "Be My Forever"]
  },
  {
    category: "😍 Cute & Flirty Messages",
    ideas: ["You Are Sweet", "Cutie Pie", "My Chocolate Lover", "Sweetest Crush", "Love You More", "You Are Irresistible", "Stole My Heart", "My Sweet Addiction", "Can't Stop Loving You", "You Are My Candy"]
  },
  {
    category: "🎂 Birthday Messages",
    ideas: ["Happy Birthday", "Sweet Birthday Wishes", "Another Sweet Year", "Birthday Sweetness", "Celebrate Sweetly", "Cheers To You", "Make A Wish", "Birthday Bliss", "Party Time 🎉", "Sweet Birthday Surprise"]
  },
  {
    category: "🎉 Celebration Messages",
    ideas: ["Congratulations", "Proud Of You", "You Did It", "Celebrate The Win", "Sweet Success", "Big Achievement", "Cheers To Success", "Well Done Champ", "Victory Sweetness", "Dream Big"]
  },
  {
    category: "😔 Apology Messages",
    ideas: ["I’m Sorry", "Forgive Me", "My Mistake", "Please Forgive Me", "I Miss You", "Let’s Fix This", "Sorry My Love", "Can We Talk?", "I Was Wrong", "Friends Again?"]
  },
  {
    category: "👯 Friendship Messages",
    ideas: ["Best Friends Forever", "My Bestie", "Partners In Crime", "Friends Forever", "Sweet Friendship", "My Crazy Friend", "Lucky To Have You", "Best Buddy", "Always Together", "You’re Amazing"]
  },
  {
    category: "💌 Long Distance / Missing Someone",
    ideas: ["Miss You", "Thinking Of You", "Wish You Were Here", "Counting Days", "Come Back Soon", "Love Across Miles", "Always With You", "Distance Means Nothing", "Missing Your Smile", "Can't Wait To See You"]
  },
  {
    category: "👨‍👩‍👧 Family Messages",
    ideas: ["Best Mom Ever", "Best Dad Ever", "Love You Mom", "Love You Dad", "Super Mom", "Super Dad", "Family Love", "My Hero Dad", "My Lovely Mom", "Home Is You"]
  },
  {
    category: "🌟 Motivational Messages",
    ideas: ["Believe In Yourself", "You Got This", "Keep Going", "Dream Big", "Shine Bright"]
  }
];

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
  const [showIdeas, setShowIdeas] = useState(false);

  const chocolateTypes: { type: ChocolateType; label: string; hover: string }[] = [
    { type: "milk", label: "Milk Chocolate", hover: "Base will be in \"Brown\"" },
    { type: "dark", label: "Dark Chocolate", hover: "Base will be in \"Black\"" },
    { type: "white", label: "White Chocolate", hover: "Base will be in \"white\"" },
    { type: "dark_sugar_free", label: "Dark Sugar Free", hover: "Base will be in \"Black\"" },
  ];

  const handleIdeaClick = (idea: string) => {
    onMessageChange(idea);
    setShowIdeas(false);
  };

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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 className={styles.sectionTitle}>2. Custom Message *</h2>
            <button 
              type="button" 
              className={styles.ideasButton}
              onClick={() => setShowIdeas(true)}
            >
              Message Ideas
            </button>
          </div>
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

      {/* Ideas Modal */}
      {showIdeas && (
        <div className={styles.modalOverlay} onClick={() => setShowIdeas(false)}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Message Ideas</h3>
              <button className={styles.closeButton} onClick={() => setShowIdeas(false)}>×</button>
            </div>
            <div className={styles.modalContent}>
              {MESSAGE_IDEAS.map((cat, idx) => (
                <div key={idx} className={styles.categorySection}>
                  <h4 className={styles.categoryTitle}>{cat.category}</h4>
                  <ul className={styles.ideasList}>
                    {cat.ideas.map((idea, i) => (
                      <li 
                        key={i} 
                        className={styles.ideaItem}
                        onClick={() => handleIdeaClick(idea)}
                      >
                        {idx * 10 + i + 1}. {idea}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
