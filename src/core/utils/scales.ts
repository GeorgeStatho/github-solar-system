export function scaleSqrt(value: number, minValue: number, maxValue: number, minSize: number, maxSize: number) {
  if (maxValue <= minValue) return minSize;

  const safeValue = Math.max(value, minValue);

  const normalized =
    (Math.sqrt(safeValue) - Math.sqrt(minValue)) /
    (Math.sqrt(maxValue) - Math.sqrt(minValue));

  const clamped = Math.max(0, Math.min(1, normalized));

  return minSize + clamped * (maxSize - minSize);
}

export function scaleLog(value: number, minValue: number, maxValue: number, minSize: number, maxSize: number) {
  if (maxValue <= minValue) return minSize;
  const normalized = (Math.log(value + 1) - Math.log(minValue + 1)) / (Math.log(maxValue + 1) - Math.log(minValue + 1));
  return minSize + normalized * (maxSize - minSize);
}