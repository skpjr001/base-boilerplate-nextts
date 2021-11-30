//Nextjs
import { AppProps } from 'next/app'

import superjson from "superjson"

//Seo
import { DefaultSeo } from "next-seo";
import { seoConfig } from "@lib/config/next-seo.config";

//Intl(i18)
import { appWithTranslation } from 'next-i18next'

//styles
import "../styles/fonts.css";
import "../styles/globals.css";


function MyApp( props : AppProps ) {
  const { Component, pageProps } = props
  return (
    <>
      <DefaultSeo {...seoConfig.defaultNextSeo}/>
      <Component {...pageProps} />
    </>
    
  )
}

export default appWithTranslation(MyApp)
