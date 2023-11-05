import clsx from "clsx";
import React from "react";
import {
  getDollarFormValue,
  getNumericFormValue,
  getPercentFormValue,
} from "~/utils/form";
import {
  parseMortgageForm,
  MortgageFormFields,
} from "~/shared/forms/MortgageFormFields";
import type { MortgageDetails, SavingsDetails } from "~/types";
import { DollarInput } from "~/shared/DollarInput";
import { NumberInput } from "~/shared/NumberInput";
import { PercentInput } from "~/shared/PercentInput";

interface Props {
  savingsDetails: SavingsDetails | undefined;
  mortgageDetails?: MortgageDetails;
  className?: string;
}

export function SavingsMortgageFormFields({
  savingsDetails,
  mortgageDetails,
  className,
}: Props) {
  const [includeMortgage, setIncludeMortgage] = React.useState(
    !!mortgageDetails,
  );

  return (
    <div className={clsx("", className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="hidden"
          name="includeMortgage"
          value={includeMortgage ? "true" : "false"}
        />
        <DollarInput
          name="principal"
          label="Principal Amount"
          value={savingsDetails?.principal}
          autoFocus
        />
        <PercentInput
          name="interestRate"
          label="Interest rate (ex: 2.5%)"
          value={savingsDetails?.interestRate}
        />
        <DollarInput
          name="savingsPerMonth"
          label="Savings per month"
          value={savingsDetails?.savingsPerMonth}
        />
        <NumberInput
          name="months"
          label="Number of months"
          value={savingsDetails?.months ?? 12}
          endAdornment="Months"
        />
      </div>
      <div className="my-4 flex items-center">
        <input
          id="mortgage"
          type="checkbox"
          defaultChecked={includeMortgage}
          onChange={({ target: { checked } }) => setIncludeMortgage(checked)}
        />
        <label className="ml-2 text-sm text-green-500" htmlFor="mortgage">
          Include mortgage estimation
        </label>
      </div>
      {includeMortgage && (
        <MortgageFormFields mortgageDetails={mortgageDetails} skipPrincipal />
      )}
    </div>
  );
}

export function parseSavingsForm(formData: FormData) {
  const includeMortgage =
    formData.get("includeMortgage")?.toString() === "true";

  const form: {
    savingsDetails: SavingsDetails;
    mortgageDetails?: MortgageDetails;
  } = {
    savingsDetails: {
      principal: getDollarFormValue(formData, "principal"),
      interestRate: getPercentFormValue(formData, "interestRate"),
      savingsPerMonth: getDollarFormValue(formData, "savingsPerMonth"),
      months: getNumericFormValue(formData, "months") || 12,
    },
  };

  if (includeMortgage) {
    form.mortgageDetails = parseMortgageForm(formData);
  }

  return form;
}
