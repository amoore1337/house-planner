import type { ChartOptions } from "chart.js";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import dayjs from "dayjs";
import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { formatDollar } from "~/utils/number";
import { type SavingsReport } from "~/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  ChartDataLabels,
);

interface Props {
  report: SavingsReport;
  months: number;
}

const options: ChartOptions<"bar"> = {
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          let label = context.dataset.label ?? "";
          if (label) {
            label += ": ";
          }

          if (context.parsed.y !== null) {
            label += formatDollar(context.parsed.y);
          }

          return label;
        },
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      ticks: { color: "#FFFFFF" },
      border: { color: "#FFFFFF" },
    },
    y: {
      stacked: true,
      grid: { color: "#FFFFFF" },
      ticks: { color: "#FFFFFF" },
      border: { color: "#FFFFFF" },
    },
  },
};

export function SavingsBarChart({ report, months }: Props) {
  const data = useMemo(() => buildChartData(report, months), [report, months]);

  return <Bar options={options} data={data} height="100%" />;
}

function buildChartData(report: SavingsReport, months: number) {
  const totals = report.monthsLog.map(({ total }) => total);
  const isPrincipalLargest =
    report.monthsLog[0].principal > report.monthsLog[0].contributions;

  const dataLabels = {
    formatter: (_value: number, context: any) =>
      formatDollar(totals[context.dataIndex]),
    rotation: -90,
    display: true,
  };

  return {
    labels: buildLabelsForMonths(months),
    datasets: [
      {
        label: "Principal",
        data: report.monthsLog.map(({ principal }) => principal),
        backgroundColor: "#22c55e",
        datalabels: isPrincipalLargest ? dataLabels : { display: false },
      },
      {
        label: "Contributions",
        data: report.monthsLog.map(({ contributions }) => contributions),
        backgroundColor: "#0ea5e9",
        datalabels: isPrincipalLargest ? { display: false } : dataLabels,
      },
      {
        label: "Interest",
        data: report.monthsLog.map(({ interest }) => interest),
        backgroundColor: "#8b5cf6",
        datalabels: {
          display: false,
        },
      },
    ],
  };
}

function buildLabelsForMonths(months: number) {
  const labels: string[] = [];
  let date = new Date();
  for (let i = 0; i < months; i++) {
    date = dayjs(date).add(1, "month").toDate();
    labels.push(dayjs(date).format("MMM YYYY"));
  }

  return labels;
}
