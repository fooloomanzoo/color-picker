module.exports = {
  verbose: false,
  plugins: {
    local: {
      skipSeleniumInstall: false,
      browsers: ["chrome", "firefox"],
      browserOptions: {
        chrome: ["headless", "disable-gpu", "no-sandbox"],
        firefox: ["-headless"]
      }
    },
    sauce: false
  }
}
