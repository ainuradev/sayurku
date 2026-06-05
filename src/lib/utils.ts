export function calculatePrice(basePrice: number | undefined | null, selectedUnit: string, unit_type: "weight" | "unit"): number {
  if (!basePrice) return 0;
  
  if (unit_type === "weight") {
    if (selectedUnit.includes("250gr")) return basePrice * 0.25;
    if (selectedUnit.includes("500gr")) return basePrice * 0.5;
    if (selectedUnit.includes("750gr")) return basePrice * 0.75;
    if (selectedUnit.includes("kg")) {
      const kg = parseFloat(selectedUnit);
      if (!isNaN(kg)) return basePrice * kg;
    }
  } else if (unit_type === "unit") {
    // For unit type, try to extract a number from the selectedUnit (e.g., "2 ikat" -> 2)
    const match = selectedUnit.match(/^(\d+(?:\.\d+)?)/);
    if (match && match[1]) {
      const num = parseFloat(match[1]);
      if (!isNaN(num)) return basePrice * num;
    }
  }
  
  return basePrice;
}
