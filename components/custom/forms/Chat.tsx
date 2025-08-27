import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { G, Circle } from "react-native-svg";

// Define categories
const categoryColors: string[] = [
  "#FF5733",
  "#33FF57",
  "#337BFF",
  "#F0B429",
  "#AA33FF",
];

// Function to generate spending breakdown (percentages of 75% income)
const generateData = (income: number) => {
  let categories = ["Food", "Education", "Rent", "Transport", "Entertainment"];
  let totalSpending = income * 0.75;
  let values: number[] = [];
  let sum = 0;

  for (let i = 0; i < categories.length - 1; i++) {
    let value = Math.floor(Math.random() * (totalSpending - sum) * 0.5);
    sum += value;
    values.push(value);
  }

  values.push(totalSpending - sum);
  let percentages: number[] = values.map((v) => (v / totalSpending) * 100);

  return { labels: categories, percentages, money: values };
};

const DonutChartWithCut: React.FC = () => {
  const income: number = 10000;
  const [chartData, setChartData] = useState(generateData(income));

  useEffect(() => {
    setChartData(generateData(income));
  }, []);

  const radius = 50;
  const strokeWidth = 14;
  const circleCircumference = 2 * Math.PI * radius;
  const gapSize = -290; // Increase the gap size (More visible)
  let startAngle = 30;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Spending Breakdown (75% of Income)</Text>

      <Svg height="140" width="140" viewBox="0 0 120 120">
        <G rotation={90 - gapSize / 2} origin="60, 60">
          {chartData.percentages.map((percentage, index) => {
            const dashArray = circleCircumference;
            const dashOffset = ((100 - percentage) / 100) * circleCircumference;

            const segment = (
              <Circle
                key={index}
                cx="60"
                cy="60"
                r={radius}
                stroke={categoryColors[index]}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${dashArray}, ${dashArray}`}
                strokeDashoffset={dashOffset}
                rotation={startAngle}
                origin="60, 60"
              />
            );

            startAngle += (percentage / 100) * (360 - gapSize); // Leave a larger gap
            return segment;
          })}
        </G>
      </Svg>

      {/* Labels & Money Breakdown */}
      <View style={styles.legendContainer}>
        {chartData.labels.map((label, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.colorBox,
                { backgroundColor: categoryColors[index] },
              ]}
            />
            <Text style={styles.legendText}>
              {label}: ${chartData.money[index].toLocaleString()} (
              {Math.round(chartData.percentages[index])}% of 75%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  legendContainer: {
    marginTop: 10,
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  colorBox: {
    width: 16,
    height: 16,
    marginRight: 5,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
  },
});

export default DonutChartWithCut;
