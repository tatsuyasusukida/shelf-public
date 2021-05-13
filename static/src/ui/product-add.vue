<template lang="pug">
  include ./mixin/product-form

  .container-fluid
    h1.mt-3 商品の追加
    +product-form(submit='保存リストに追加する')
</template>

<script>
  import ProductForm from './mixin/product-form'

  export default {
    mixins: [ProductForm],

    data () {
      return {
        method: 'POST',
      }
    },
  }
</script>
