/**
 * Parse a price string like 'Bs1,437.50' into a number (1437.50).
 * Handles 'Bs' prefix, commas as thousands separators, and edge cases (empty, null).
 *
 * @param {string|null|undefined} str
 * @returns {number}
 */
export function parsePrice(str) {
  if (!str) return 0;
  const cleaned = str.replace(/[Bs,]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Format a number like 1437.50 into a price string 'Bs1,437.50'.
 * Handles decimals and thousands separator.
 *
 * @param {number} num
 * @returns {string}
 */
export function formatPrice(num) {
  if (num === null || num === undefined || isNaN(num)) return 'Bs0.00';
  const fixed = num.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `Bs${withCommas}.${decPart}`;
}

/**
 * Calculate the selling price from cost price and margin percentage.
 * marginFormula = 'markup' (sobre el costo) | 'margin' (sobre el precio venta).
 *
 * @param {number} costPrice - Precio de compra/costo
 * @param {number} marginPercent - Porcentaje de margen (ej: 30 para 30%)
 * @param {'markup'|'margin'} formula - Tipo de cálculo
 * @returns {number}
 */
export function calcSellingPrice(costPrice, marginPercent = 0, formula = 'markup') {
  const cost = parseFloat(costPrice) || 0;
  const pct = parseFloat(marginPercent) || 0;
  if (formula === 'margin') {
    // Margen sobre precio de venta: precio = costo / (1 - margin%)
    if (pct >= 100) return cost;
    return cost / (1 - pct / 100);
  }
  // Markup sobre costo: precio = costo * (1 + margin%)
  return cost * (1 + pct / 100);
}

/**
 * Apply a discount percentage to a price.
 *
 * @param {number} price - Precio original
 * @param {number} discountPercent - Descuento en porcentaje (ej: 10 para 10%)
 * @returns {number}
 */
export function applyDiscount(price, discountPercent = 0) {
  const p = parseFloat(price) || 0;
  const d = parseFloat(discountPercent) || 0;
  return p * (1 - d / 100);
}

/**
 * Calculate IVA (tax) amount from a subtotal.
 *
 * @param {number} subtotal
 * @param {number} rate - Tasa de IVA en porcentaje (default: 13 para Bolivia)
 * @returns {number}
 */
export function calcIVA(subtotal, rate = 13) {
  return (parseFloat(subtotal) || 0) * (parseFloat(rate) / 100);
}

/**
 * Calculate the total margin (profit) between cost and selling price.
 *
 * @param {number} sellingPrice
 * @param {number} costPrice
 * @returns {{ amount: number, percent: number }}
 */
export function calcMargin(sellingPrice, costPrice) {
  const sell = parseFloat(sellingPrice) || 0;
  const cost = parseFloat(costPrice) || 0;
  const profit = sell - cost;
  const percent = sell > 0 ? (profit / sell) * 100 : 0;
  return { amount: profit, percent: Math.round(percent * 100) / 100 };
}

/**
 * Format a subtotal + IVA breakdown.
 *
 * @param {number} subtotal
 * @param {number} ivaRate - Tasa de IVA (default 13)
 * @returns {{ subtotal: number, iva: number, total: number }}
 */
export function calcTotalWithIVA(subtotal, ivaRate = 13) {
  const sub = parseFloat(subtotal) || 0;
  const iva = calcIVA(sub, ivaRate);
  return {
    subtotal: sub,
    iva: iva,
    total: sub + iva,
  };
}
