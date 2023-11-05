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
import { calculateMortgage } from "~/utils/algo";
import MortgageDoughnutChart from "~/routes/calc.mortgage.$mortgageSlug/MortgageDoughnutChart";
import {
  parseMortgageForm,
  MortgageFormFields,
} from "~/shared/forms/MortgageFormFields";
import type { MortgageSlug, SavingsSlug } from "~/types";
import { formatDollar, formatPercent } from "~/utils/number";
import {
  objToCompressedUrlSlug,
  parseCompressedUrlSlug,
} from "~/utils/compression";

export async function loader({ params }: LoaderFunctionArgs) {
  const { mortgageDetails, savingsDetails } =
    parseCompressedUrlSlug<MortgageSlug>(params.mortgageSlug ?? "");

  const mortgageReport = calculateMortgage(mortgageDetails);

  let savingsSlug: string | null = null;
  if (savingsDetails) {
    const slugContent: SavingsSlug = {
      mortgageDetails,
      savingsDetails,
    };
    savingsSlug = objToCompressedUrlSlug(slugContent);
  }

  return json({
    mortgageDetails,
    mortgageReport,
    savingsSlug,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const mortgageDetails = parseMortgageForm(formData);
  const slugContent: MortgageSlug = { mortgageDetails };
  const urlSlug = objToCompressedUrlSlug(slugContent);
  return redirect(`/calc/mortgage/${urlSlug}`);
}

export default function MortgageReportPage() {
  const navigation = useNavigation();
  const { mortgageDetails, mortgageReport, savingsSlug } =
    useLoaderData<typeof loader>();

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
      <div className="absolute top-2 flex w-full justify-center text-slate-900">
        <div className="flex items-center rounded border border-green-500 bg-white p-4">
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
                <MortgageFormFields mortgageDetails={mortgageDetails} />
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
          Estimated Mortgage:
          <span className="mx-1 font-bold">
            {formatDollar(mortgageReport.monthlyTotal)}
          </span>
          per month @
          <span className="mx-1 font-bold">
            {formatPercent(
              mortgageDetails.principal / mortgageDetails.purchasePrice,
            )}
          </span>
          down
          {savingsSlug && (
            <div className="ml-3 inline-block text-sm text-sky-500 underline">
              <Link to={`/calc/savings/${savingsSlug}`}>
                View Savings Details
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex h-3/4 w-full items-center justify-center">
        <MortgageDoughnutChart report={mortgageReport} />
      </div>
    </div>
  );
}
