export function getNumericFormValue(form: FormData, key: string): number {
  try {
    return parseFloat(form.get(key)?.toString() ?? "0");
  } catch (error) {
    return 0;
  }
}

export function getDollarFormValue(form: FormData, key: string): number {
  try {
    return parseFloat(form.get(key)?.toString().split(",").join("") ?? "0");
  } catch (error) {
    return 0;
  }
}

export function getPercentFormValue(form: FormData, key: string): number {
  try {
    return parseFloat(form.get(key)?.toString() ?? "0") / 100;
  } catch (error) {
    return 0;
  }
}
