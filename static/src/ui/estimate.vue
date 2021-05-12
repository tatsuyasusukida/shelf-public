<template lang="pug">
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
  import BaseMixin from './mixin/base'

  export default {
    mixins: [BaseMixin],

    data () {
      return {
        form: null,
        validation: null,
        options: null,
        currentView: 'index',
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
