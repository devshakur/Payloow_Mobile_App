// Utility for normalizing Nigerian phone numbers to canonical format: 234XXXXXXXXXX
// Accepts inputs like 08012345678, +2348012345678, 2348012345678, 8012345678
// Returns canonical 2348012345678 or null if it cannot confidently normalize.
export const normalizeNigerianPhone = (input: string): string | null => {
  if (!input) return null;
  let digits = input.replace(/[^0-9]/g, "");

  // Remove leading country code if present
  if (digits.startsWith("234")) {
    digits = digits.slice(3);
  }
  // Remove leading zero for local 11-digit formats
  if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }
  // If user entered only local 10 digits (common) we're fine
  if (digits.length === 10) {
    return `234${digits}`;
  }
  return null; // Can't normalize reliably
};

export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

// Export normalizeNigerianPhone as default for routing compatibility
export default normalizeNigerianPhone;