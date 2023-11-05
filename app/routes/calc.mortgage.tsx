import { Form } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/server-runtime";
import {
  parseMortgageForm,
  MortgageFormFields,
} from "~/shared/forms/MortgageFormFields";
import { type MortgageSlug } from "~/types";
import { Button } from "~/shared/base/Button";
import { objToCompressedUrlSlug } from "~/utils/compression";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const mortgageDetails = parseMortgageForm(formData);
  const slugContent: MortgageSlug = { mortgageDetails };
  const urlSlug = objToCompressedUrlSlug(slugContent);

  return redirect(`/calc/mortgage/${urlSlug}`);
}

export default function CaclMortgagePage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="max-w-[600px]">
        <p className="my-4">
          Enter mortgage details and click submit to calculate.!!!!
        </p>

        <Form method="post">
          <MortgageFormFields mortgageDetails={undefined} />
          <div className="mt-4 flex justify-end">
            <Button variant="primary" type="submit" className="!py-2 !px-8">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
