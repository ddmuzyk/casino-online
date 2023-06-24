import React, {ReactNode} from "react";
import Head from "next/head"
import './layout.scss'

interface LayoutProps {
  children: ReactNode,
  siteTitle: string
}

const Layout: React.FC<LayoutProps> = ({children, siteTitle}) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <title>{siteTitle}</title>
      </Head>
      <main>{children}</main>
    </>
  )
}

export default Layout;