import clsx from "clsx";
import { getDollarFormValue, getPercentFormValue } from "~/utils/form";
import { DollarInput } from "~/shared/DollarInput";
import { NumberInput } from "~/shared/NumberInput";
import { PercentInput } from "~/shared/PercentInput";
import { type MortgageDetails } from "~/types";

interface Props {
  mortgageDetails: MortgageDetails | undefined;
  className?: string;
  skipPrincipal?: boolean;
}

export function MortgageFormFields({
  mortgageDetails,
  className,
  skipPrincipal,
}: Props) {
  return (
    <div className={clsx(className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DollarInput
          name="purchasePrice"
          label="Purchase Price"
          value={mortgageDetails?.purchasePrice}
        />
        {!skipPrincipal && (
          <DollarInput
            name="principal"
            label="Principal amount"
            value={mortgageDetails?.principal}
          />
        )}
        <PercentInput
          name="mortgageInterest"
          label="Mortgage rate (ex: 6.50)"
          value={mortgageDetails?.mortgageInterest}
          maxValue={100}
        />
        <DollarInput
          name="propertyTax"
          label="Property Tax per Year"
          value={mortgageDetails?.propertyTax}
        />
        <DollarInput
          name="insurance"
          label="Home Insurance per Year"
          value={mortgageDetails?.insurance}
        />
        <NumberInput
          name="mortgageTerm"
          label="Term"
          value={mortgageDetails?.mortgageTerm ?? 30}
          endAdornment="Yrs"
          decimalLimit={0}
        />
      </div>
    </div>
  );
}

export function parseMortgageForm(formData: FormData): MortgageDetails {
  const form: MortgageDetails = {
    purchasePrice: getDollarFormValue(formData, "purchasePrice"),
    principal: getDollarFormValue(formData, "principal"),
    mortgageInterest: getPercentFormValue(formData, "mortgageInterest"),
    propertyTax: getDollarFormValue(formData, "propertyTax"),
    insurance: getDollarFormValue(formData, "insurance"),
    mortgageTerm: getDollarFormValue(formData, "mortgageTerm"),
  };

  return form;
}
