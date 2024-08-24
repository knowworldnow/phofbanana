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

const Page: FaustTemplate<GetPageQuery> = (props) => {
  if (props.loading) {
    return <>Loading...</>;
  }

  const { title, editorBlocks, featuredImage, ncPageMeta } =
    props.data?.page || {};

  // This change removes the condition for isFrontPage
  const isGutenbergPage = ncPageMeta?.isFullWithPage;

  const blocks = flatListToHierarchical(editorBlocks as any, {
    idKey: "clientId",
    parentKey: "parentClientId",
  });

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
        <div className={`container ${isGutenbergPage ? "" : "pb-20 pt-5 sm:pt-10"}`}>
          <main className={`prose lg:prose-lg dark:prose-invert mx-auto ${isGutenbergPage ? "max-w-none" : ""}`}>
            {title && !isGutenbergPage && (
              <>
                <EntryHeader title={title} />
                <hr />
              </>
            )}

            <MyWordPressBlockViewer blocks={blocks} />
          </main>
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

// The original GraphQL query remains unchanged
Page.query = gql`
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
    generalSettings {
      ...NcgeneralSettingsFieldsFragment
    }
    primaryMenuItems: menuItems(where: { location: $headerLocation }, first: 80) {
      nodes {
        ...NcPrimaryMenuFieldsFragment
      }
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }, first: 40) {
      nodes {
        ...NcFooterMenuFieldsFragment
      }
    }
  }
`;

export default Page;
