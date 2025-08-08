import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: `In The Loop`,
    siteUrl: `https://intheloop.jarno.site`
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-antd',
      options: {
        style: true
      }
    },
    {
      resolve: `gatsby-plugin-less`,
      options: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            '@primary-color': '#2166b1',
            '@font-size-base': '16px',
            '@font-family': "'Source Sans Pro', sans-serif",
            '@border-radius-base': '6px',
          }
        },
      },
    },
    "gatsby-plugin-styled-components",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "images",
        "path": "./src/images/"
      },
      __key: "images"
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "In The Loop",
        short_name: "In The Loop",
        start_url: "/",
        background_color: "#2166b1",
        theme_color: "#2166b1",
        display: "standalone",
        icon: "src/images/icon.png",
      },
    },
  ]
};

export default config;
