import { AppProps } from 'next/app'

import { DefaultSeo } from "next-seo";
import { seoConfig } from "@lib/config/next-seo.config";

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

export default MyApp
