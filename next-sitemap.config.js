/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://localhost.com",

  generateRobotsTxt: true,

  exclude: ["/twitter-image.*", "/opengraph-image.*", "/icon.*", "/private/*", "/admin/*"],

  robotsTxtOptions: {
    policies: [
      { 
        userAgent: "*", 
        allow: "/", 
        disallow: ["/private/", "/admin/"] 
      },
    ],
  },
};