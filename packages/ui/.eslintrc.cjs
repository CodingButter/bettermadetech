module.exports = {
  root: true,
  extends: ["@repo/eslint-config"],
  env: {
    node: true,
    browser: true
  },
  globals: {
    module: true,
    require: true
  }
};