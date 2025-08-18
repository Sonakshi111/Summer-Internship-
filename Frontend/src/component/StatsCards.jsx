import React, { useEffect, useState } from "react";

function StatsCards() {
  const statsData = [
    { label: "Total Students", target: 0, color: "#ff6b81" },
    { label: "Total Batches", target: 0, color: "#1dd1a1" },
    { label: "Active Trainings", target: 0, color: "#feca57" },
    { label: "Reports Generated", target: 0, color: "#ff9f43" },
  ];

  const [counts, setCounts] = useState(statsData.map(() => 0));

  useEffect(() => {
    const intervals = statsData.map((stat, index) => {
      let current = 0;
      let step = Math.ceil(stat.target / 50);

      return setInterval(() => {
        current += step;
        if (current > stat.target) {
          current = 0; // वापस से शुरू
        }
        setCounts((prev) => {
          const updated = [...prev];
          updated[index] = current;
          return updated;
        });
      }, 50);
    });

    return () => intervals.forEach((id) => clearInterval(id));
  }, []);

  return (
    <section style={styles.stats}>
      {statsData.map((stat, index) => (
        <div
          key={index}
          style={{ ...styles.card, backgroundColor: stat.color }}
        >
          <span>{stat.label}</span>
          <strong style={styles.number}>{counts[index]}</strong>
        </div>
      ))}
    </section>
  );
}

const styles = {
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  card: {
    padding: "20px",
    borderRadius: "15px",
    color: "#fff",
    textAlign: "center",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    fontSize: "1.1rem",
    fontWeight: "500",
    transition: "transform 0.3s ease",
  },
  number: {
    display: "block",
    fontSize: "2rem",
    marginTop: "5px",
    fontWeight: "bold",
  },
};

export default StatsCards;
