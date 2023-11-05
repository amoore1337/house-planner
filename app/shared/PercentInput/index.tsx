import { NumberInput, type Props as NumperInputProps } from "../NumberInput";

interface Props
  extends Omit<
    NumperInputProps,
    "decimalLimit" | "endAdornment" | "padDecimal"
  > {}

export function PercentInput({ value, onChange, ...props }: Props) {
  const handleChange = (val: number) => {
    onChange?.(val / 100);
  };
  return (
    <NumberInput
      {...props}
      value={typeof value === "number" ? value * 100 : value}
      onChange={handleChange}
      endAdornment="%"
      decimalLimit={2}
      padDecimal
    />
  );
}
