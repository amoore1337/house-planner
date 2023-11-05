import type { ChartOptions } from "chart.js";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { formatDollar } from "~/utils/number";
import type { MortgageReport } from "~/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  report: MortgageReport;
}

const options: ChartOptions<"doughnut"> = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          let label = context.dataset.label ?? "";
          if (label) {
            label += ": ";
          }

          if (context.parsed !== null) {
            label += formatDollar(context.parsed);
          }

          return label;
        },
      },
    },
  },
};

export default function MortgageDoughnutChart({ report }: Props) {
  const data = useMemo(() => buildChartData(report), [report]);
  return <Doughnut data={data} options={options} />;
}

function buildChartData(report: MortgageReport) {
  return {
    labels: ["Mortgage", "Property Tax", "Home Insurance"],
    datasets: [
      {
        data: [
          report.monthlyMortgage,
          report.monthlyProperty,
          report.monthlyInsurance,
        ],
        backgroundColor: ["#22c55e", "#8b5cf6", "#0ea5e9"],
        borderColor: ["#16a34a", "#7c3aed", "#0284c7"],
        datalabels: {
          formatter: (value: number) => "",
        },
      },
    ],
  };
}
