import BaseMixin from './base'

export default {
  mixins: [BaseMixin],

  data () {
    return {
      form: null,
      validation: null,
      options: null,
      currentView: 'index',
      products: null,
      summary: null,
    }
  },

  methods: {
    async initialize () {
      const url = this.api + 'initialize' + window.location.search
      const response = await fetch(url)
      const body = await response.json()

      this.form = body.form
      this.validation = body.validation
      this.options = body.options
    },

    async onClickButtonNext () {
      const url = this.api + 'validate'
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({form: this.form}),
      }

      const response = await fetch(url, options)
      const body = await response.json()

      this.validation = body.validation

      if (this.validation.ok) {
        const url = this.api + 'review'
        const response = await fetch(url, options)
        const body = await response.json()

        this.products = body.products
        this.summary = body.summary
        this.currentView = 'review'
        window.scrollTo(0, 0)
      } else {
        window.scrollTo(0, 0)
      }
    },

    async onClickButtonPrevious () {
      this.currentView = 'index'
      window.scrollTo(0, 0)
    },

    async onClickButtonSubmit () {
      const url = this.api + 'submit'
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({form: this.form}),
      }
      const response = await fetch(url, options)
      const body = await response.json()

      if (body.ok) {
        window.location.assign(body.redirect)
      }
    },
  },
}
