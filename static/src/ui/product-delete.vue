<template lang="pug">
  include ./mixin/product-item

  .container-fluid
    h1.mt-3 商品の削除
    p 保存リストから商品を削除してもよろしいですか？
    section
      h2 商品について
      +product-item

    form.mt-3(role='form')
      .row.gx-3
        .col
          .d-grid
            a.btn.btn-link(href='../../../list/') キャンセル
        .col
          .d-grid
            button.btn.btn-danger(type='submit' v-on:click.prevent='onClickButtonSubmit') 削除

</template>

<script>
  import BaseMixin from './mixin/base'

  export default {
    mixins: [BaseMixin],

    data () {
      return {
        product: null,
      }
    },

    methods: {
      async initialize () {
        const url = this.api + 'initialize'
        const response = await fetch(url)
        const body = await response.json()

        this.product = body.product
      },

      async onClickButtonSubmit () {
        const url = this.api + 'submit'
        const options = {
          method: 'DELETE',
        }

        const response = await fetch(url, options)
        const body = await response.json()

        if (body.ok) {
          window.location.assign(body.redirect)
        }
      },
    },
  }
</script>
