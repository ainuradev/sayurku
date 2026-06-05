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

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}
