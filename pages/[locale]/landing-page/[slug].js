import Head from 'next/head'
import { useRouter } from "next/router";
import ErrorPage from "next/error";

import camelcaseKeys from 'camelcase-keys';

import { getLandingPage, getPostsData } from '@/lib/api'

import LandingPageSection from '@/components/landing-page-sections/landing-page-section'
import Blog from "@/components/blog/blog";
import Preloader from '@/components/preloader';

export default function LandingPage({ page, blogPosts }) {
  const router = useRouter();
  if (router.isFallback) {
    return <Preloader />
  }

  if (!page) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>{page.fields.seo.title}</title>
        <meta name="description" content={page.fields.seo.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" type="image/x-icon" href="https://buttercms.com/static/v2/images/favicon.png" />
      </Head>

      {page.fields.body.map(({ type, fields: sectionData }, index) =>
        <LandingPageSection
          key={index}
          type={type}
          sectionData={sectionData}
        />
      )}
      <Blog posts={blogPosts} />
    </>
  )
}

export const getServerSideProps = async (context) => {
  const { params } = context
  const preview = context?.query?.preview === '1' ? 1 : 0
  const page = await getLandingPage(params.slug, params.locale, preview)
  const blogPosts = (await getPostsData({page: 1, pageSize: 2})).posts
  return {
    props: {
      page: camelcaseKeys(page),
      blogPosts: camelcaseKeys(blogPosts)
    }
  }
}
