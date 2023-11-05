import type { MutableRefObject } from "react";
import React from "react";
import { useIMask } from "react-imask";
import { Input, type Props as InputProps } from "~/shared/base/Input";

export interface Props
  extends Omit<InputProps, "step" | "type" | "onChange" | "value"> {
  onChange?: (value: number) => void;
  value?: number;
  decimalLimit?: number;
  maxValue?: number;
  padDecimal?: boolean;
}

export function NumberInput({
  value: controlledValue,
  onChange,
  decimalLimit,
  maxValue,
  padDecimal,
  ...props
}: Props) {
  const [maskOptions, setMaskOptions] = React.useState(() => {
    const opts: any = {
      mask: Number,
      thousandsSeparator: ",",
      scale: decimalLimit,
      radix: ".",
      padFractionalZeros: padDecimal,
    };
    // imask has a bug where undefined value for `max` results
    // in negative values.
    if (typeof maxValue === "number") {
      opts.max = maxValue;
    }
    return opts;
  });

  const { ref, maskRef } = useIMask(maskOptions, {
    onAccept: (_value, mask) => {
      const updatedValue = mask.typedValue;
      if (onChange && updatedValue !== controlledValue) {
        onChange(updatedValue);
      }
    },
  });

  React.useEffect(() => {
    // TODO: Kill silly extra render
    setMaskOptions((o: any) => {
      const opts = {
        ...o,
        scale: decimalLimit,
        padFractionalZeros: padDecimal,
      };
      if (typeof maxValue === "number") {
        opts.max = maxValue;
      }
    });
  }, [decimalLimit, maxValue, padDecimal]);

  React.useEffect(() => {
    if (typeof controlledValue === "number") {
      if (controlledValue.toString() === maskRef.current?.unmaskedValue) {
        return;
      }
      if (maskRef.current) {
        maskRef.current.unmaskedValue = controlledValue.toString();
        maskRef.current.updateValue();
      }
    }
  }, [controlledValue, maskRef]);

  return (
    <Input
      // Bleh, how did this lib screw up type defs so much
      ref={ref as MutableRefObject<HTMLInputElement>}
      defaultValue={controlledValue}
      {...props}
    />
  );
}
