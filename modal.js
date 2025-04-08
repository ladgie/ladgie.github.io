// Initialise Vue instance
const vm = new Vue({
  el: '#modal',
  vuetify: vuetify,

  /////////////////////////////////////////////////////////////////////////////
  // Data
  /////////////////////////////////////////////////////////////////////////////

  data: {
    ticket: 0,
    status: {},
    order: {}
  },

  /////////////////////////////////////////////////////////////////////////////
  // Methods
  /////////////////////////////////////////////////////////////////////////////

  methods: {
    // Update ticket
    updateTicket: async function () {
      const response = await client.request({
        type: 'PUT',
        url: `/api/v2/tickets/${this.ticket}.json`,
        contentType: 'application/json',
        data: JSON.stringify({
          ticket: {
            custom_fields: [
              {
                id: 4627845858705,
                value: '5673454130'
              }
            ]
          }
        })
      })

      console.log(`${this.ticket} Ticket updated!`)
    }
  },

  /////////////////////////////////////////////////////////////////////////////
  // Created
  /////////////////////////////////////////////////////////////////////////////

  created: function () {
    const urlParams = new URLSearchParams(window.location.search)

    const ticket = urlParams.get('ticket')
    const order = urlParams.get('order')
    const status = urlParams.get('status')

    this.ticket = ticket
    this.order = JSON.parse(order)
    this.status = Object.freeze(JSON.parse(status))
  }
})
