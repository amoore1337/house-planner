export function round(num: number, places: number): number {
  const factor = Math.pow(10, places);
  let result = num * factor;
  result = Math.round(result);
  return result / factor;
}

export function formatDollar(amount: number): string {
  const rounded = round(amount, 2);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(rounded);
}

export function formatPercent(percent: number): string {
  const rounded = round(percent, 2);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "percent",
  });

  return formatter.format(rounded);
}

export function numberFromString(value: string) {
  const numChars: string[] = [];
  value.split("").forEach((c) => {
    if (/[.]|\d/g.test(c)) {
      numChars.push(c);
    }
  });

  const decimalIndex = numChars.lastIndexOf(".");
  const num = parseInt(numChars.join("").replace(".", ""), 10);

  if (decimalIndex > -1) {
    const decPlace = numChars.length - 1 - decimalIndex;
    return num / Math.pow(10, decPlace);
  }

  return num;
}
