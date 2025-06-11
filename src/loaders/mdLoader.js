// /src/loaders/markdown/loader.js
 // const content = ${JSON.stringify(content)}
function mdLoader(content) {
  return `
      const content = ${JSON.stringify(content)}
      export default { content };
  `
}
module.exports = mdLoader
