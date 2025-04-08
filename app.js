// Initialise Vue instance
const vm = new Vue({
  el: '#app',
  vuetify : vuetify,

  /////////////////////////////////////////////////////////////////////////////
  // Data
  /////////////////////////////////////////////////////////////////////////////

  data: {
    // Orders
    orders: [
      {
        id: '1876',
        status: 'cancelled',
        date: '20205-03-28',
        title: 'Unable to login',
        details: {
          total: {
            name: 'Assigned to',
            value: 'John Smith'
          },
          payment: {
            name: 'Priority',
            value: 'Normal'
          },
          shipping: {
            name: 'Last Activity',
            value: '2025-03-29'
          }
        }
      },
      {
        id: '1875',
        status: 'cancelled',
        date: '2025-03-28',
        title: 'Unable to login',
        details: {
          total: {
            name: 'Assigned to',
            value: 'John Smith'
          },
          payment: {
            name: 'Priority',
            value: 'Normal'
          },
          shipping: {
            name: 'Last Activity',
            value: '2025-03-29'
          }
        }
      },
      {
        id: '1872',
        status: 'delivered',
        date: '2025-.3-11',
        title: 'Unable to login',
        details: {
          total: {
            name: 'Assigned to',
            value: 'John Smith'
          },
          payment: {
            name: 'Priority',
            value: 'Normal'
          },
          shipping: {
            name: 'Last Activity',
            value: '2025-03-29'
          }
        }
      }
    ],

    // Loyalty
    loyalty: {
      details: {
        status: {
          icon: 'fa fa-star',
          title: 'Status',
          value: 'Pending device validation'
        },
        card: {
          icon: 'fa fa-credit-card',
          title: 'Card Number',
          value: '**** **** **** 4130'
        },
        balance: {
          icon: 'fa fa-stream',
          title: 'Balance',
          value: 103
        },
        orders: {
          icon: 'fa fa-shopping-cart',
          title: 'Transfers',
          value: 30
        },
        total: {
          icon: 'fa fa-wallet',
          title: 'LTV',
          value: '$4252.00'
        },
      },
      vouchers: [
        {
          discount: '5000',
          source: 'IOS app',
          status: 'pending'
        },
        {
          discount: '1200',
          source: 'Android app',
          status: 'complete'
        },
        {
          discount: '370',
          source: 'Android app',
          status: 'complete'
        }
      ]
    },

    // Basket
    basket: [
      {
        id: '543-81346',
        description: 'Boho Bracelet',
        price: '$50.00',
        quantity: 1
      },
      {
        id: '293-61943',
        description: 'Vintage Suitcase',
        price: '$250.00',
        quantity: 1
      }
    ],

    // Do not change anything below this line
    ///////////////////////////////////////////////////////////////////////////

    loading: true,
    currentTab: 'orders',
    search: null,
    sortBy: 'date',
    sortOrder: 'desc',
    orderTab: null,
    ticket: {},
    user: {},
    tabs: Object.freeze({
      user: {
        icon: 'fa fa-user',
        name: 'User info'
      },
      orders: {
        icon: 'fas fa-comments-dollar',
        name: 'Tickets'
      },
      loyalty: {
        icon: 'fas fa-wallet',
        name: 'Profile'
      }
    }),
    status: Object.freeze({
      transit: {
        name: 'Pending',
        color: 'light-blue darken-3'
      },
      delivered: {
        name: 'Solved',
        color: 'teal darken-3'
      },
      cancelled: {
        name: 'Open',
        color: 'red darken-3'
      }
    })
  },

  /////////////////////////////////////////////////////////////////////////////
  // Computed
  /////////////////////////////////////////////////////////////////////////////

  computed: {
    // Get orders info (filter and sort, depending on the app selection)
    getOrders: function () {
      const orders = this.orders.sort((a, b) => a.id - b.id)
      const sortBy = this.sortBy ? this.sortBy : 'id'
      const sortOrder = this.sortOrder ? this.sortOrder : 'asc'
      const search = this.search

      const filtered = search ? orders.filter(obj => obj.id.toUpperCase().includes(search.toUpperCase()) || new Date(`${obj.date} GMT`).toString() === new Date(`${search} GMT`).toString()) : orders

      return filtered.sort((a, b) => (sortOrder === 'asc' ? a[sortBy] > b[sortBy] : a[sortBy] < b[sortBy]) ? 1 : -1)
    }
  },

  /////////////////////////////////////////////////////////////////////////////
  // Methods
  /////////////////////////////////////////////////////////////////////////////

  methods: {
    // Open modal window with more details about the selected order
    openModal: function(id) {
      const order = this.orders.find(obj => obj.id === id)

      client.invoke('instances.create', {
        location: 'modal',
        url: `assets/modal.html?status=${encodeURIComponent(JSON.stringify(this.status))}&order=${encodeURIComponent(JSON.stringify(order))}`,
        size: {
          width: '60vw',
          height: '70vh'
        }
      })
    },

    // Offer a discount voucher on the ticket text input
    offerDiscount: function() {
      client.invoke('ticket.editor.insert', 'Here is your discount code: N77HW6EB8CCE. Use this when checking out!')
    },

    // Load app initial data
    loadInitialData: async function() {
      try {
        this.loading = true
        this.loading = false
      }

      catch (err) {
        client.invoke('notify', err, 'error', {
          sticky: true
        })
      }
    },

    // Fetch ticket info
    fetchTicketInfo: async function () {
      try {
        return (await client.get('ticket')).ticket
      }

      catch(err) {
        console.error(err)
        throw 'An error has occurred while fetching ticket information.'
      }
    },

    // Fetch user info
    fetchUserInfo: async function (id) {
      try {
        return (await client.request({ url: `/api/v2/users/${id}.json` })).user
      }

      catch (err) {
        console.error(err)
        throw 'An error has occurred while fetching user information.'
      }
    },

    // Fetch user fields
    fetchUserFields: async function () {
      try {
        return (await client.request({ url: `/api/v2/user_fields.json?per_page=100` })).user_fields
      }

      catch (err) {
        console.error(err)
        throw 'An error has occurred while fetching user fields.'
      }
    },

    // Resize app based on the app container height
    resizeApp: function() {
      const appHeight = document.querySelector('#app .app-container').offsetHeight + 'px'

      client.invoke('resize', { width: '100%', height: appHeight })
    }
  },

  /////////////////////////////////////////////////////////////////////////////
  // Created
  /////////////////////////////////////////////////////////////////////////////

  // Execute when the app is created
  created: function () {
    this.loadInitialData()
  },

  /////////////////////////////////////////////////////////////////////////////
  // Updated
  /////////////////////////////////////////////////////////////////////////////

  // Execute when the app is updated
  updated: function() {
  },

  /////////////////////////////////////////////////////////////////////////////
  // Watch
  /////////////////////////////////////////////////////////////////////////////

  watch: {
  }
})
