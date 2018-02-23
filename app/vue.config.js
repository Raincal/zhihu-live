module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      "/api": {
        target: "https://easy-mock.com/mock/5a901f74aad80a47eaa237ec/lives",
        secure: false
      }
    }
  }
};
