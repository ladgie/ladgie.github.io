// Initialise Apps framework client. See also:
// https://developer.zendesk.com/apps/docs/developer-guide/getting_started
const client = ZAFClient.init()

// Vuetify settings
const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#03363D',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
    },
  },
})
