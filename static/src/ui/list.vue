<template lang="pug">
  include ./product-item

  .container-fluid
    h1.mt-3 保存リスト
    template(v-for='product of products')
      section
        h2 商品{{product.number}}
        nav.mt-3(v-bind:aria-label="'商品' + product.number + 'のメニュー'")
          .d-flex.flex-wrap.gap-2
            a.btn.btn-outline-primary(v-bind:href="'../product/' + product.id + '/edit/'") 変更
            a.btn.btn-outline-danger(v-bind:href="'../product/' + product.id + '/delete/'") 削除
        +product-item

    nav.mt-3(aria-label='メイン')
      .d-grid
        a.btn.btn-outline-primary(href='../product/add/') 商品を追加する

      template(v-if='products.length >= 1')
        hr

        .row.gx-3.mt-3
          .col
            .d-grid
              a.btn.btn-outline-primary(href='../estimate/') 見積書を発行する
          .col
            .d-grid
              a.btn.btn-primary(href='../order/') 注文

        ul.list-unstyled.mt-3.text-end
          li
            a(href='../question/?category=product') 保存リストの商品についてお問い合わせ
          li
            a(href='../question/?category=discount') 法人割引についてお問い合わせ

</template>

<script>
  import BaseMixin from './mixin/base'

  export default {
    mixins: [BaseMixin],

    data () {
      return {
        products: null,
      }
    },

    methods: {
      async initialize () {
        const url = this.api + 'initialize'
        const response = await fetch(url)
        const body = await response.json()

        this.products = body.products
      },
    },
  }
</script>
