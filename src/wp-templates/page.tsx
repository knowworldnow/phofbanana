import { gql } from "@/__generated__";
import EntryHeader from "../components/entry-header";
import {
  GetPageQuery,
  NcgeneralSettingsFieldsFragmentFragment,
} from "../__generated__/graphql";
import { FaustTemplate, flatListToHierarchical } from "@faustwp/core";
import { FOOTER_LOCATION, PRIMARY_LOCATION } from "@/contains/menu";
import PageLayout from "@/container/PageLayout";
import MyWordPressBlockViewer from "@/components/MyWordPressBlockViewer";
import { Sidebar } from "@/container/singles/Sidebar";
import { TCategoryCardFull } from "@/components/CardCategory1/CardCategory1";

const Page: FaustTemplate<GetPageQuery> = (props) => {
  // LOADING ----------
  if (props.loading) {
    return <>Loading...</>;
  }

  // for this page
  const { title, editorBlocks, featuredImage, ncPageMeta } =
    props.data?.page || {};

  const isGutenbergPage =
    !!props.__SEED_NODE__?.isFrontPage || ncPageMeta?.isFullWithPage;

  const blocks = flatListToHierarchical(editorBlocks as any, {
    idKey: "clientId",
    parentKey: "parentClientId",
  });

  // Fetch top 10 categories for the sidebar
  const categories: TCategoryCardFull[] =
    (props.data?.categories?.nodes as TCategoryCardFull[]) || [];

  return (
    <>
      <PageLayout
        headerMenuItems={props.data?.primaryMenuItems?.nodes || []}
        footerMenuItems={props.data?.footerMenuItems?.nodes || []}
        pageFeaturedImageUrl={featuredImage?.node?.sourceUrl}
        pageTitle={title}
        generalSettings={
          props.data?.generalSettings as NcgeneralSettingsFieldsFragmentFragment
        }
      >
        <div className="nc-BgGlassmorphism absolute inset-x-0 md:top-10 xl:top-20 min-h-0 pl-20 py-24 flex overflow-hidden z-[-1]">
          <span className="block bg-[#ef233c] w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-10 lg:w-96 lg:h-96"></span>
          <span className="block bg-[#04868b] w-72 h-72 -ml-20 mt-40 rounded-full mix-blend-multiply filter blur-3xl opacity-10 lg:w-96 lg:h-96 nc-animation-delay-2000"></span>
        </div>
        <div
          className={`container ${
            isGutenbergPage ? "" : "pb-20 pt-5 sm:pt-10"
          } flex`} // Added "flex" class for sidebar layout
        >
          <main
            className={`prose lg:prose-lg dark:prose-invert ${
              isGutenbergPage ? "max-w-none" : "mx-auto"
            } w-full lg:w-3/4`} // Adjusted width for sidebar
          >
            {title && !isGutenbergPage && (
              <>
                <EntryHeader title={title} />
                <hr />
              </>
            )}

            <MyWordPressBlockViewer blocks={blocks} />
          </main>

          {/* Sidebar for all pages */}
          <aside className="hidden lg:block w-full lg:w-1/4">
            <Sidebar categories={categories} /> {/* Pass categories to the Sidebar */}
          </aside>
        </div>
      </PageLayout>
    </>
  );
};

Page.variables = ({ databaseId }, ctx) => {
  return {
    databaseId,
    asPreview: ctx?.asPreview,
    headerLocation: PRIMARY_LOCATION,
    footerLocation: FOOTER_LOCATION,
  };
};

// Note***: tat ca cac query trong cac page deu phai co generalSettings, no duoc su dung o compoent Wrap
Page.query = gql(`
  query GetPage($databaseId: ID!, $asPreview: Boolean = false, $headerLocation: MenuLocationEnum!, $footerLocation: MenuLocationEnum!) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      ncPageMeta {
        isFullWithPage
      }
      featuredImage {
        node {
          altText
          sourceUrl
        }
      }
      editorBlocks(flat: true) {
        __typename
        renderedHtml
        clientId
        parentClientId
        ...NcmazFaustBlockMagazineFragment
        ...NcmazFaustBlockTermsFragment
        ...NcmazFaustBlockCtaFragment
        ...NcmazFaustBlockGroupFragment
        ...CoreColumnsFragment
        ...CoreColumnFragment
      }
    }
    categories(first:10, where: { orderby: COUNT, order: DESC }) {
      nodes {
        ...NcmazFcCategoryFullFieldsFragment
      }
    }
    # common query for all page 
    generalSettings {
      ...NcgeneralSettingsFieldsFragment
    }
    primaryMenuItems: menuItems(where: { location:  $headerLocation  }, first: 80) {
      nodes {
        ...NcPrimaryMenuFieldsFragment
      }
    }
    footerMenuItems: menuItems(where: { location:  $footerLocation  }, first: 40) {
      nodes {
        ...NcFooterMenuFieldsFragment
      }
    }
  }
`);

export default Page;




