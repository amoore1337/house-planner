import { Form } from "@remix-run/react";
import { redirect, type ActionFunctionArgs } from "@remix-run/server-runtime";
import {
  parseSavingsForm,
  SavingsMortgageFormFields,
} from "~/shared/forms/SavingsMortgageFormFields";
import { type SavingsSlug } from "~/types";
import { Button } from "~/shared/base/Button";
import { objToCompressedUrlSlug } from "~/utils/compression";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const slugContent: SavingsSlug = parseSavingsForm(formData);
  const urlSlug = objToCompressedUrlSlug(slugContent);

  return redirect(`/calc/savings/${urlSlug}`);
}

export default function SavingsCalcIndexPage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="max-w-[600px]">
        <p className="my-4">
          Enter savings details and click submit to calculate.
        </p>

        <Form method="post">
          <SavingsMortgageFormFields savingsDetails={undefined} />
          <div className="flex justify-end">
            <Button variant="primary" type="submit" className="!py-2 !px-8">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
