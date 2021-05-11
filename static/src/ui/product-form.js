import BaseMixin from './mixin/base'
import debounce from 'lodash.debounce'

export default {
  mixins: [BaseMixin],

  data () {
    return {
      method: null,
      form: null,
      validation: null,
      options: null,
      image: null,
      price: null,
    }
  },

  methods: {
    async initialize () {
      const url = this.api + 'initialize'
      const response = await fetch(url)
      const body = await response.json()

      this.form = body.form
      this.validation = body.validation
      this.options = body.options

      await this.onChangeForm()

      this.onChangeFormDebounced = debounce(this.onChangeForm, 500)
    },

    async onChangeForm () {
      const url = this.api + 'change'
      const options = {
        method: this.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({form: this.form}),
      }

      const response = await fetch(url, options)
      const body = await response.json()

      this.validation = body.validation
      this.image = body.image
      this.price = body.price
    },

    async onClickButtonSubmit () {
      const url = this.api + 'validate'
      const options = {
        method: this.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({form: this.form}),
      }

      const response = await fetch(url, options)
      const body = await response.json()

      this.validation = body.validation

      if (this.validation.ok) {
        const url = this.api + 'submit'
        const response = await fetch(url, options)
        const body = await response.json()

        if (body.ok) {
          window.location.assign(body.redirect)
        }
      } else {
        window.scrollTo(0, 0)
      }
    },
  },
}