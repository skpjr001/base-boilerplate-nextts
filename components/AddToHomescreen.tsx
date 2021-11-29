import { XIcon } from "@heroicons/react/outline";
import { useState } from "react";

import { useLocale } from "@lib/hooks/useLocale";

export default function AddToHomescreen() {
  const { t } = useLocale();
  const [closeBanner, setCloseBanner] = useState(false);

  if (typeof window !== "undefined") {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return null;
    }
  }
  return !closeBanner ? (
    <div className="fixed sm:hidden bottom-0 inset-x-0 pb-2 sm:pb-5">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg shadow-lg sm:p-3" style={{ background: "#2F333D" }}>
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-opacity-30 bg-brand">
                <svg
                  className="h-7 w-7 text-indigo-500 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  enableBackground="new 0 0 50 50">
                  <path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z" />
                  <path d="M24 7h2v21h-2z" />
                  <path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z" />
                </svg>
              </span>
              <p className="ml-3 text-xs font-medium text-white">
                <span className="inline">{t("add_to_homescreen")}</span>
              </p>
            </div>

            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
              <button
                onClick={() => setCloseBanner(true)}
                type="button"
                className="-mr-1 flex p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-white">
                <span className="sr-only">{t("dismiss")}</span>
                <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
