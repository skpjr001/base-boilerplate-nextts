import superjson from "superjson"

//Nextjs
import AppProviders, { AppProps } from "@lib/app-providers";

//Seo
import { DefaultSeo } from "next-seo";
import { seoConfig } from "@lib/config/next-seo.config";

//Intl(i18)
//import { appWithTranslation } from 'next-i18next'
import I18nLanguageHandler from "@components/I18nLanguageHandler";


//trpc
import type { AppRouter } from "@server/routers/_app";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import type { TRPCClientErrorLike } from "@trpc/react";
import { Maybe } from "@trpc/server";

//styles
import "../styles/fonts.css";
import "../styles/globals.css";


function MyApp(props: AppProps) {
  const { Component, pageProps, err } = props;
  return (
    <AppProviders {...props}>
      <DefaultSeo {...seoConfig.defaultNextSeo} />
      <I18nLanguageHandler />
      <Component {...pageProps} err={err} />
    </AppProviders>
  );
}

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    return {
      /**
       * @link https://trpc.io/docs/links
       */
      links: [
        // adds pretty logs to your console in development and logs errors in production
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `/api/trpc`,
        }),
      ],
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: {
        defaultOptions: {
          queries: {
            /**
             * 1s should be enough to just keep identical query waterfalls low
             * @example if one page components uses a query that is also used further down the tree
             */
            staleTime: 1000,
            /**
             * Retry `useQuery()` calls depending on this function
             */
            retry(failureCount, _err) {
              const err = _err as never as Maybe<TRPCClientErrorLike<AppRouter>>;
              const code = err?.data?.code;
              if (code === "BAD_REQUEST" || code === "FORBIDDEN" || code === "UNAUTHORIZED") {
                // if input data is wrong or you're not authorized there's no point retrying a query
                return false;
              }
              const MAX_QUERY_RETRIES = 3;
              return failureCount < MAX_QUERY_RETRIES;
            },
          },
        },
      },
      /**
       * @link https://trpc.io/docs/data-transformers
       */
      transformer: superjson,
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);

//unused after trpc setup
//export default appWithTranslation(MyApp)
