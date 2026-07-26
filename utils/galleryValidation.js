export const sanitizeText = (value) => {
  if (value === undefined || value === null) return '';
  return String(value).trim().replace(/<[^>]*>/g, '');
};

export const parseNumber = (value, fallback = undefined) => {
  if (value === undefined || value === null || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
