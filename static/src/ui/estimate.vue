<template lang="pug">
  include ./mixin/product-item

  .container-fluid
    h1.mt-3 見積書の発行
    template(v-if="currentView === 'index'")
      form(role='form')
        .form-group.mb-3
          label.form-label(for='customer') 宛名
          input.form-control(type='text' name='customer' id='customer' aria-required='true' aria-describedby='customerHelp' readonly v-model='form.name')
          p.form-text(id='customerHelp') デモのため宛名を入力できません。
        fieldset.mb-3
          legend.fs-6 宛名の敬称
          .form-check.form-check-inline
            input.form-check-input(type='radio' name='title' id='title0' value='御中' v-model='form.title')
            label.form-check-label(for='title0') 御中
          .form-check.form-check-inline
            input.form-check-input(type='radio' name='title' id='title1' value='法人割引について' v-model='form.title')
            label.form-check-label(for='title1') 様
        fieldset.mb-3
          legend.fs-6 メールマガジン
          .form-check.form-check-inline
            input.form-check-input(type='radio' name='subscribe' id='subscribe0' value='受け取る' v-model='form.subscribe')
            label.form-check-label(for='subscribe0') 受け取る
          .form-check.form-check-inline
            input.form-check-input(type='radio' name='subscribe' id='subscribe1' value='受け取らない' v-model='form.subscribe')
            label.form-check-label(for='subscribe1') 受け取らない
          p.form-text.mb-0(id='subscribeHelp')
            | お得な割引クーポンなどが配信されます。 <br>
            | いつでも解除することができます。
        .form-group.mb-3(v-if="form.subscribe === '受け取る'")
          label.form-label(for='email') メールアドレス
          input.form-control(type='email' name='email' id='email' aria-required='true' readonly v-model='form.email')
          p.form-text(id='customerHelp') デモのためメールアドレスを入力できません。

        .row.justify-content-end
          .col-6
            .d-grid
              button.btn.btn-primary(type='submit' v-on:click.prevent='onClickButtonNext')
                | 確認画面へ進む 
                span(aria-hidden='true') &raquo;

    template(v-if="currentView === 'review'")
      form(role='form')
        template(v-for='product of products')
          section.border-bottom.pb-3.mt-3
            h2 商品{{product.number}}
            +product-item

        section.border-bottom.pb-3.mt-3
          h2 合計金額
          .row.justify-content-end
            .col-sm-6
              dl.row.mb-0
                dt.col-6 小計（税抜）
                dd.col-6 &yen;{{summary.subtotalText}}

                dt.col-6 消費税（10％）
                dd.col-6 &yen;{{summary.taxText}}

                dt.col-6 合計（税込）
                dd.col-6.mb-0 &yen;{{summary.totalText}}

        section.mt-3
          h2 見積書について
          dl
            dt 宛名
            dd {{form.name}} {{form.title}}

            dt メールマガジン
            dd {{form.subscribe}}

            dt(v-if="form.subscribe === '受け取る'") メールアドレス
            dd(v-if="form.subscribe === '受け取る'") {{form.email}}

        .row
          .col-6.order-last
            .d-grid
              button.btn.btn-primary(type='submit' v-on:click.prevent='onClickButtonSubmit') 見積書を発行する
          .col-6
            .d-grid
              button.btn.btn-link(type='button' v-on:click.prevent='onClickButtonPrevious')
                span(aria-hidden='true') &laquo; 
                | 入力画面へ戻る

</template>

<script>
  import ContactFormMixin from './mixin/contact-form'

  export default {
    mixins: [ContactFormMixin],
  }
</script>
