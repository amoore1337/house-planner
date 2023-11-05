import { MixerVerticalIcon } from "@radix-ui/react-icons";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import { Button } from "~/shared/base/Button";
import { Modal, ModalContent, ModalHeader } from "~/shared/base/Modal";

import React from "react";
import { calculateMortgage, calculateSavingsForXMonths } from "~/utils/algo";
import type {
  MortgageDetails,
  MortgageReport,
  MortgageSlug,
  SavingsSlug,
} from "~/types";
import { SavingsBarChart } from "~/routes/calc.savings.$savingsSlug/SavingsBarChart";
import {
  parseSavingsForm,
  SavingsMortgageFormFields,
} from "~/shared/forms/SavingsMortgageFormFields";
import {
  objToCompressedUrlSlug,
  parseCompressedUrlSlug,
} from "~/utils/compression";
import { formatDollar, round } from "~/utils/number";

export async function loader({ params }: LoaderFunctionArgs) {
  const { mortgageDetails, savingsDetails } =
    parseCompressedUrlSlug<SavingsSlug>(params.savingsSlug ?? "");

  const savingsReport = calculateSavingsForXMonths(
    savingsDetails.months,
    savingsDetails,
  );

  let mortgageReport: MortgageReport | null = null;
  let mortgageSlug: string | null = null;
  if (mortgageDetails) {
    const populatedMortgageDetails: MortgageDetails = {
      ...mortgageDetails,
      principal: round(savingsReport.totalSavings, 2),
    };

    mortgageReport = calculateMortgage(populatedMortgageDetails);
    const slugContent: MortgageSlug = {
      mortgageDetails: populatedMortgageDetails,
      savingsDetails,
    };
    mortgageSlug = objToCompressedUrlSlug(slugContent);
  }

  return json({
    savingsDetails,
    mortgageDetails,
    savingsReport,
    mortgageReport,
    mortgageSlug,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const form = parseSavingsForm(formData);

  const urlSlug = objToCompressedUrlSlug(form);

  return redirect(`/calc/savings/${urlSlug}`);
}

export default function SavingsReportPage() {
  const navigation = useNavigation();

  const {
    savingsReport,
    savingsDetails,
    mortgageDetails,
    mortgageReport,
    mortgageSlug,
  } = useLoaderData<typeof loader>();

  const [openModal, setOpenModal] = React.useState(false);

  // Close the modal once the action returns successfully
  React.useEffect(() => {
    // TODO: Has to be a way to clean this up
    const isActionRedirect =
      navigation.state === "loading" &&
      navigation.formMethod != null &&
      navigation.formMethod != "GET" &&
      // We had a submission navigation and are now navigating to different location
      navigation.formAction !== navigation.location.pathname;
    if (isActionRedirect) {
      setOpenModal(false);
    }
  }, [navigation, openModal]);

  const updating = navigation.state === "submitting";

  return (
    <div className="relative flex h-full w-full items-center justify-center px-8">
      <div className="absolute top-2 flex w-full justify-center">
        <div className="flex items-center rounded border border-green-500 bg-white p-4 text-slate-900">
          <button
            className="mr-3 rounded-full border border-solid border-green-500 p-1 text-green-500 hover:bg-green-500 hover:text-white"
            onClick={() => setOpenModal(true)}
          >
            <MixerVerticalIcon className="" />
          </button>
          <Modal open={openModal} onOpenChange={(open) => setOpenModal(open)}>
            <ModalContent>
              <ModalHeader title="Savings details" />
              <Form method="post" className="bg-slate-800 p-4">
                <SavingsMortgageFormFields
                  savingsDetails={savingsDetails}
                  mortgageDetails={mortgageDetails}
                />
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="primary"
                    type="submit"
                    className="!py-2 !px-8"
                  >
                    {updating ? "Loading..." : "Submit"}
                  </Button>
                </div>
              </Form>
            </ModalContent>
          </Modal>
          Total Savings:
          <span className="ml-1 font-bold">
            {formatDollar(savingsReport.totalSavings)}
          </span>
          {mortgageReport && (
            <div className="ml-2 inline-block">
              Estimated Mortgage:
              <span className="mx-1 font-bold">
                {formatDollar(mortgageReport.monthlyTotal)}
              </span>
              per month @
              <span className="mx-1 font-bold">
                {round(mortgageReport.percentDown * 100, 2)}%
              </span>
              down
              <div className="ml-3 inline-block text-sm text-sky-500 underline">
                <Link to={`/calc/mortgage/${mortgageSlug}`}>
                  View Mortgage Details
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <SavingsBarChart report={savingsReport} months={savingsDetails.months} />
    </div>
  );
}
