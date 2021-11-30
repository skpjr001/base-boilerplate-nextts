import React, { SyntheticEvent, useState } from "react";

import { ErrorCode } from "@lib/auth";
import { useLocale } from "@lib/hooks/useLocale";
import showToast from "@lib/notification";

const ChangePasswordSection = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLocale();

  const errorMessages: { [key: string]: string } = {
    [ErrorCode.IncorrectPassword]: t("current_incorrect_password"),
    [ErrorCode.NewPasswordMatchesOld]: t("new_password_matches_old_password"),
  };

  async function changePasswordHandler(e: SyntheticEvent) {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/auth/changepw", {
        method: "PATCH",
        body: JSON.stringify({ oldPassword, newPassword }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setOldPassword("");
        setNewPassword("");
        showToast(t("password_has_been_changed"), "success");
        return;
      }

      const body = await response.json();
      setErrorMessage(errorMessages[body.error] || `${t("something_went_wrong")}${t("please_try_again")}`);
    } catch (err) {
      console.error(t("error_changing_password"), err);
      setErrorMessage(`${t("something_went_wrong")}${t("please_try_again")}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="mt-6">
        <h2 className="font-cal text-lg leading-6 font-medium text-gray-900">{t("change_password")}</h2>
      </div>
      <form className="divide-y divide-gray-200 lg:col-span-9" onSubmit={changePasswordHandler}>
        <div className="py-6 lg:pb-8">
          <div className="flex">
            <div className="w-1/2 mr-2">
              <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                {t("current_password")}
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  value={oldPassword}
                  onInput={(e) => setOldPassword(e.currentTarget.value)}
                  name="current_password"
                  id="current_password"
                  required
                  className="shadow-sm focus:ring-black focus:border-brand block w-full sm:text-sm border-gray-300 rounded-sm"
                  placeholder={t("your_old_password")}
                />
              </div>
            </div>
            <div className="w-1/2 ml-2">
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                {t("new_password")}
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="new_password"
                  id="new_password"
                  value={newPassword}
                  required
                  onInput={(e) => setNewPassword(e.currentTarget.value)}
                  className="shadow-sm focus:ring-black focus:border-brand block w-full sm:text-sm border-gray-300 rounded-sm"
                  placeholder={t("super_secure_new_password")}
                />
              </div>
            </div>
          </div>
          {errorMessage && <p className="mt-1 text-sm text-red-700">{errorMessage}</p>}
          <div className="py-8 flex justify-end">
            <button
              type="submit"
              className="ml-2 bg-neutral-900 border border-transparent rounded-sm shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              {t("save")}
            </button>
          </div>
          <hr className="mt-4" />
        </div>
      </form>
    </>
  );
};

export default ChangePasswordSection;
