import { XIcon } from "@heroicons/react/outline";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { useLocale } from "@lib/hooks/useLocale";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { HeadSeo } from "@components/seo/head-seo";

//import { ssrInit } from "@server/lib/ssr";

export default function Error() {
  const { t } = useLocale();
  const router = useRouter();
  const { error } = router.query;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true">
      <HeadSeo title={t("error")} description={t("error")} />
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div>
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <XIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                {error}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{t("error_during_login")}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <Link href="/auth/login">
              <a className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-sm shadow-sm bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 sm:text-sm">
                {t("go_back_login")}
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { locale } = context;
  //const ssr = await ssrInit(context);

  return {
    props: {
      ...(await serverSideTranslations(locale!, ['common'])),
      //trpcState: ssr.dehydrate(),
    },
  };
}
