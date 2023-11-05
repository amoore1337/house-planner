import type {
  MortgageDetails,
  MortgageReport,
  SavingsDetails,
  SavingsReport,
} from "~/types";

export function calculateMortgage({
  mortgageInterest,
  mortgageTerm = 30,
  propertyTax,
  insurance,
  purchasePrice,
  principal = 0,
}: MortgageDetails): MortgageReport {
  const monthlyProperty = propertyTax / 12;
  const monthlyInsurance = insurance / 12;
  const interestRate = mortgageInterest / 12;
  const months = mortgageTerm * 12;
  const loanAmount = purchasePrice - principal;

  const monthlyTotal =
    (loanAmount * interestRate * Math.pow(1 + interestRate, months)) /
      (Math.pow(1 + interestRate, months) - 1) +
    monthlyProperty +
    monthlyInsurance;

  return {
    monthlyTotal,
    amountDown: principal,
    percentDown: principal / purchasePrice,
    monthlyInsurance,
    monthlyProperty,
    monthlyMortgage: monthlyTotal - monthlyInsurance - monthlyProperty,
  };
}

export function calculateSavingsForXMonths(
  months: number,
  details: SavingsDetails,
): SavingsReport {
  let totalSavings = details.principal;
  let totalInterest = 0;
  let totalContributions = 0;
  const monthsLog: {
    total: number;
    principal: number;
    interest: number;
    contributions: number;
  }[] = [];

  for (let i = 0; i < months; i++) {
    const result = calculateSavingsForMonth(totalSavings, details);
    totalSavings = result.total;
    totalInterest += result.interest;
    totalContributions += details.savingsPerMonth;
    monthsLog.push({
      total: result.total,
      principal: details.principal,
      interest: totalInterest,
      contributions: totalContributions,
    });
  }

  return { totalSavings, totalInterest, totalContributions, monthsLog };
}

const compoundedPerYear = 12;

function calculateSavingsForMonth(
  principal: number,
  { interestRate, savingsPerMonth }: SavingsDetails,
) {
  const total =
    Math.pow(
      principal * (1 + interestRate / compoundedPerYear),
      compoundedPerYear * (1 / 12),
    ) + savingsPerMonth;

  const interest = total - principal - savingsPerMonth;

  return {
    total,
    interest,
  };
}
