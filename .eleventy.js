const { DateTime } = require("luxon")
const htmlmin = require("html-minifier")
const yaml = require("js-yaml")
const pluginNavigation  = require('@11ty/eleventy-navigation')
const pluginRss         = require('@11ty/eleventy-plugin-rss')
const syntaxHighlight   = require('@11ty/eleventy-plugin-syntaxhighlight')


const filters           = require('./utils/filters.js')
const shortcodes        = require('./utils/shortcodes.js')
const pairedshortcodes  = require('./utils/paired-shortcodes.js')

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
   eleventyConfig.setDataDeepMerge(true);

  /**
   * Filters
   * @link https://www.11ty.io/docs/filters/
   */
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName])
  })

 	/**
	 * Shortcodes
	 * @link https://www.11ty.io/docs/shortcodes/
	 */
	Object.keys(shortcodes).forEach((shortcodeName) => {
		eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
  })
  
 	/**
	 * Paired Shortcodes
	 * @link https://www.11ty.dev/docs/languages/nunjucks/#paired-shortcode
	 */
	Object.keys(pairedshortcodes).forEach((shortcodeName) => {
		eleventyConfig.addPairedShortcode(
			shortcodeName,
			pairedshortcodes[shortcodeName]
		)
  })

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Add RSS Feed
  eleventyConfig.addPlugin(pluginRss);

  // Add Navigation
  eleventyConfig.addPlugin(pluginNavigation);

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // Add Tailwind Output CSS as Watch Target
  eleventyConfig.addWatchTarget("./_tmp/style.css");

  /**
	 * Passthrough File Copy
	 * @link https://www.11ty.dev/docs/copy/
	 */
  eleventyConfig.addPassthroughCopy({
    "./_tmp/style.css": "./css/style.css",
    "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css": "./css/prism-tomorrow.css",
    "./public": "./",
    "./src/assets/images": "./images",
    });

  eleventyConfig.addShortcode("version", function () {
    return String(Date.now());
  });

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  // Plugins  
  
  // Collections

  });
  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: "_site"
    }
  };
};
