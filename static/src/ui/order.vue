<template lang="pug">
  include ./mixin/product-item

  .container-fluid
    h1.mt-3 注文
    template(v-if="currentView === 'index'")
      form(role='form')
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
          label.form-label(for='memo') 備考
          textarea.form-control(rows='7' name='memo' id='memo' aria-required='false' aria-describedby='memoHelp' readonly v-model='form.memo')
          p.form-text(id='memoHelp') デモのため備考を入力できません。
        fieldset.mb-3
          legend.fs-6 お支払い方法
          .form-check
            input.form-check-input(type='radio' name='payment' id='payment0' value='クレジットカード' v-model='form.payment')
            label.form-check-label(for='payment0') クレジットカード
          .form-check
            input.form-check-input(type='radio' name='payment' id='payment1' value='銀行振込' v-model='form.payment')
            label.form-check-label(for='payment1') 銀行振込
          .form-check
            input.form-check-input(type='radio' name='payment' id='payment2' value='代金引換' v-model='form.payment')
            label.form-check-label(for='payment2') 代金引換

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
                dt.col-6 送料
                dd.col-6 &yen;{{summary.shippingText}}

                dt.col-6(v-if="form.payment === '代金引換'") 代引手数料
                dd.col-6(v-if="form.payment === '代金引換'") &yen;{{summary.feeText}}

                dt.col-6 小計（税抜）
                dd.col-6 &yen;{{summary.subtotalText}}

                dt.col-6 消費税（10％）
                dd.col-6 &yen;{{summary.taxText}}

                dt.col-6 合計（税込）
                dd.col-6.mb-0 &yen;{{summary.totalText}}

        section.mt-3
          h2 注文について
          dl
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

            dt 備考
            dd
              p.mb-0
                template(v-for="(line, i) of form.memo.split('\\n')")
                  br(v-if='i >= 1')
                  | {{line}}

            dt お支払い方法
            dd.mb-0 {{form.payment}}

        .row.mt-3
          .col-6.order-last
            .d-grid
              button.btn.btn-primary(type='submit' v-on:click.prevent='onClickButtonSubmit') 注文を確定する
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
