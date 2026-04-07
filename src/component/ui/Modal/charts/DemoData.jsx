// Generates realistic-looking demo data for a given year range
// Returns: { [year]: [{ month: 1..12, count/total: number }] }

function generateMonthlyData(baseVal, variance, field = "count") {
  const data = {};
  const currentYear = new Date().getFullYear();

  for (let y = 2024; y <= currentYear; y++) {
    data[y] = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      [field]: Math.max(
        0,
        Math.round(baseVal + (Math.random() - 0.38) * variance + i * 3),
      ),
    }));
  }
  return data;
}

export const userDemoData = generateMonthlyData(40, 25, "count");
export const sellerDemoData = generateMonthlyData(20, 18, "count");
export const earningDemoData = generateMonthlyData(5000, 3000, "total");
