<template lang="pug">
  include ./product-form

  .container-fluid
    h1.mt-3 商品の追加
    +product-form(submit={href: '../../list/', text: '保存リストに追加する'})
</template>

<script>
  import BaseMixin from './mixin/base'

  export default {
    mixins: [BaseMixin],

    data () {
      return {
        form: null,
        validation: null,
        options: null,
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
      },
    },
  }
</script>
