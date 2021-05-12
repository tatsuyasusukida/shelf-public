<template lang="pug">
  include ./product-item

  .container-fluid
    h1.mt-3 お問い合わせ
    template(v-if="currentView === 'index'")
      form(role='form')
        fieldset.mb-3
          legend.fs-6 お問い合わせの種類
          .form-check
            input.form-check-input(type='radio' name='category' id='category0' value='商品について' v-model='form.category')
            label.form-check-label(for='category0') 商品について
          .form-check
            input.form-check-input(type='radio' name='category' id='category1' value='法人割引について' v-model='form.category')
            label.form-check-label(for='category1') 法人割引について
        .form-group.mb-3
          label.form-label(for='name') お名前
          input.form-control(type='text' name='name' id='name' aria-required='true' aria-describedby='nameHelp' readonly v-model='form.name')
          p.form-text(id='nameHelp') デモのためお名前を入力できません。
        .form-group.mb-3
          label.form-label(for='kana') フリガナ
          input.form-control(type='text' name='kana' id='kana' aria-required='true' aria-describedby='kanaHelp' readonly v-model='form.kana')
          p.form-text(id='kanaHelp') デモのためフリガナを入力できません。
        .form-group.mb-3
          label.form-label(for='company') 会社名
          input.form-control(type='text' name='company' id='company' aria-required='true' aria-describedby='companyHelp' readonly v-model='form.company')
          p.form-text(id='companyHelp') デモのため会社名を入力できません。
        .form-group.mb-3
          label.form-label(for='zip') 郵便番号
          input.form-control(type='number' name='zip' id='zip' aria-required='true' aria-describedby='zipHelp' readonly v-model='form.zip')
          p.form-text(id='zipHelp') デモのため郵便番号を入力できません。
        .form-group.mb-3
          label.form-label(for='address') 住所
          input.form-control(type='text' name='address' id='address' aria-required='true' aria-describedby='addressHelp' readonly v-model='form.address')
          p.form-text(id='addressHelp') デモのため住所を入力できません。
        .form-group.mb-3
          label.form-label(for='tel') 電話番号
          input.form-control(type='tel' name='tel' id='tel' aria-required='true' aria-describedby='telHelp' readonly v-model='form.tel')
          p.form-text(id='telHelp') デモのため電話番号を入力できません。
        .form-group.mb-3
          label.form-label(for='email') メールアドレス
          input.form-control(type='email' name='email' id='email' aria-required='true' aria-describedby='emailHelp' readonly v-model='form.email')
          p.form-text(id='emailHelp') デモのためメールアドレスを入力できません。
        .form-group.mb-3
          label.form-label(for='content') お問い合わせの内容
          textarea.form-control(rows='7' name='content' id='content' aria-required='true' aria-describedby='memoHelp' readonly v-model='form.content')
          p.form-text(id='memoHelp') デモのため備考を入力できません。

        .row.justify-content-end
          .col-6
            .d-grid
              button.btn.btn-primary(type='submit' v-on:click.prevent='onClickButtonNext')
                | 確認画面へ進む 
                span(aria-hidden='true') &raquo;

    template(v-if="currentView === 'review'")
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
        h2 お問い合わせについて
        dl.mb-0
          dt お問い合わせの種類
          dd {{form.category}}

          dt お名前
          dd {{form.name}}

          dt フリガナ
          dd {{form.kana}}

          dt 会社名
          dd {{form.company}}

          dt 郵便番号
          dd {{form.zip}}

          dt 住所
          dd {{form.address}}

          dt 電話番号
          dd {{form.tel}}

          dt メールアドレス
          dd {{form.email}}

          dt お問い合わせの内容
          dd.mb-0
            p.mb-0
              template(v-for="(line, i) of form.content.split('\\n')")
                br(v-if='i >= 1')
                | {{line}}

        .row.mt-3
          .col-6.order-last
            .d-grid
              button.btn.btn-primary(type='submit' v-on:click.prevent='onClickButtonSubmit') お問い合わせ
          .col-6
            .d-grid
              button.btn.btn-link(type='button' v-on:click.prevent='onClickButtonPrevious')
                span(aria-hidden='true') &laquo; 
                | 入力画面へ戻る
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
          const response = await fetch(url)
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
</script>
