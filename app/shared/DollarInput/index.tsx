import { NumberInput, type Props as NumperInputProps } from "../NumberInput";

interface Props
  extends Omit<NumperInputProps, "decimalLimit" | "startAdornment"> {}

export function DollarInput(props: Props) {
  return (
    <NumberInput {...props} startAdornment="$" decimalLimit={2} padDecimal />
  );
}
