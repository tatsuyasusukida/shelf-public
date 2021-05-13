<template lang="pug">
  include ./mixin/estimate
  include ./mixin/requirement

  .container-a4
    nav(aria-label='メニュー')
      .d-print-none
        .mt-3.mb-3.text-end
          button.px-3(type='button' v-on:click.prevent='onClickButtonPrint') 印刷
    .paper.is-first
      +estimate
    .mb-3.d-print-none
    template(v-for='product of products')
      .paper
        +requirement
      .mb-3.d-print-none
</template>

<script>
  import BaseMixin from './mixin/base'

  export default {
    mixins: [BaseMixin],

    data () {
      return {
        estimate: null,
        products: null,
        summary: null,
      }
    },

    methods: {
      async initialize () {
        const url = this.api + 'initialize' + window.location.search
        const response = await fetch(url)
        const body = await response.json()

        this.estimate = body.estimate
        this.products = body.products
        this.summary = body.summary
      },

      async onClickButtonPrint () {
        window.print()
      },
    },
  }
</script>
