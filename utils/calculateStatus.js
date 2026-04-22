module.exports = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);

  const diffTime = expiry - today;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return "expired";
  if (diffDays <= 3) return "expiring-soon";
  return "fresh";
};