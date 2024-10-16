/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `El Track`,
    siteUrl: `https://jackarnold84.github.io/el-track/`
  },
  pathPrefix: "/el-track",
  plugins: [
    "gatsby-plugin-styled-components",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: "El Track",
        short_name: "El Track",
        start_url: "/",
        background_color: "#2166b1",
        theme_color: "#2166b1",
        display: "standalone",
        icon: "src/images/icon.png",
      },
    },
  ]
};