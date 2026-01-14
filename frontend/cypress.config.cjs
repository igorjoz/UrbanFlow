const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 0,
    env: {
      apiUrl: 'http://localhost:3000/api'
    },
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'electron') {
          launchOptions.preferences.webPreferences = launchOptions.preferences.webPreferences || {}
          launchOptions.preferences.webPreferences.sandbox = false
        }
        if (browser.family === 'chromium') {
          launchOptions.args.push('--disable-gpu')
          launchOptions.args.push('--disable-dev-shm-usage')
          launchOptions.args.push('--no-sandbox')
          launchOptions.args.push('--disable-software-rasterizer')
        }
        return launchOptions
      })
    }
  }
})
