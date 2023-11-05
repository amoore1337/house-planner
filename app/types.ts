export interface SavingsDetails {
  principal: number;
  interestRate: number;
  savingsPerMonth: number;
  months: number;
}

export interface SavingsReport {
  monthsLog: {
    total: number;
    principal: number;
    interest: number;
    contributions: number;
  }[];
  totalSavings: number;
  totalInterest: number;
  totalContributions: number;
}

export interface SavingsSlug {
  savingsDetails: SavingsDetails;
  mortgageDetails?: MortgageDetails;
}

export interface MortgageDetails {
  purchasePrice: number;
  mortgageInterest: number;
  propertyTax: number;
  insurance: number;
  mortgageTerm: number;
  principal: number;
}

export interface MortgageReport {
  monthlyTotal: number;
  amountDown: number;
  percentDown: number;
  monthlyMortgage: number;
  monthlyProperty: number;
  monthlyInsurance: number;
}

export interface MortgageSlug {
  mortgageDetails: MortgageDetails;
  savingsDetails?: SavingsDetails;
}
