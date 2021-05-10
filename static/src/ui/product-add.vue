<template lang="pug">
  include ./product-form

  .container-fluid
    h1.mt-3 商品の追加
    +product-form(submit={href: '../../list/', text: '保存リストに追加する'})
</template>

<script>
  import BaseMixin from './mixin/base'
  import debounce from 'lodash.debounce'

  export default {
    mixins: [BaseMixin],

    data () {
      return {
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

        await this.onChange()

        this.onChangeDebounced = debounce(this.onChange, 500)
      },

      async onChange () {
        const url = this.api + 'change'
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
        this.image = body.image
        this.price = body.price
      },
    },
  }
</script>
