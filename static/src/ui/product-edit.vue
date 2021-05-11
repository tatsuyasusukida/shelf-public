<template lang="pug">
  include ./product-form

  .container-fluid
    h1.mt-3 商品の変更
    +product-form(submit='保存リストを更新する')
</template>

<script>
  import ProductForm from './product-form'

  export default {
    mixins: [ProductForm],

    data () {
      return {
        method: 'PUT',
      }
    },
  }
</script>
