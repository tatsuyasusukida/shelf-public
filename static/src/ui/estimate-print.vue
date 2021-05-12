<template lang="pug">
  .container-a4
    nav(aria-label='メニュー')
      .d-print-none
        .mt-3.mb-3.text-end
          button.px-3(type='button' v-on:click.prevent='onClickButtonPrint') 印刷
    .paper.is-first
      .estimate
        .estimate-date {{estimate.dateText}}
        .estimate-number 見積番号：{{estimate.number}}
        .estimate-header 見積書
        .row
          .col
            .estimate-left
              .estimate-customer {{estimate.name}} {{estimate.title}}
              .estimate-subject 件名：オーダーメイド本棚
              .estimate-expiration 有効期限：発行日から1カ月間
              .estimate-content 下記のとおりお見積申し上げます。
              .estimate-total
                .d-flex
                  .estimate-total-text お見積金額
                  .estimate-total-value.ms-auto &yen;{{summary.totalText}}-
          .col
            .estimate-right
              .estimate-issuer 株式会社ロレムイプサム <br> 代表取締役　薄田達哉
              .estimate-address 〒940-2039 <br> 新潟県長岡市関原南4丁目3934番地
              .estimate-tel TEL：0258-94-5233
              .estimate-fax FAX：0258-94-5541
              .estimate-email E-mail：shelf@loremipsum.co.jp
        .estimate-table
          table
            thead
              tr
                th.is-product 品番・品名
                th.is-amount 数量
                th.is-price 単価
                th.is-total 金額
            tbody
              template(v-for='product of products')
                tr
                  td.is-product オーダーメイド本棚｜別紙仕様書{{product.number}}ページ
                  td.is-amount {{product.amount}}台
                  td.is-price {{product.price.unitText}}
                  td.is-total {{product.price.totalText}}
              template(v-for='i of (10 - products.length)')
                tr
                  td.is-product &nbsp;
                  td.is-amount &nbsp;
                  td.is-price &nbsp;
                  td.is-total &nbsp;
            tfoot
              tr
                td.is-blank &nbsp;
                td(colspan='2') 小計
                td.is-total {{summary.subtotalText}}
              tr
                td.is-blank &nbsp;
                td(colspan='2') 消費税（10％）
                td.is-total {{summary.taxText}}
              tr
                td.is-blank &nbsp;
                td(colspan='2') 合計
                td.is-total {{summary.totalText}}
        .estimate-memo.
          納入期限：注文日から約1カ月後 <br>
          納入期限：別途打合せ
    template(v-for='product of products')
      .mb-3.d-print-none
      .paper
        .requirement
          .requirement-header
            .requirement-header-title 仕様書｜オーダーメイド本棚
            .requirement-header-page {{product.number}}/{{products.length}} ページ
          .requirement-body
            .requirement-image
              .requirement-image-front
                figure
                  img.w-100(v-bind:src='product.image.front' alt='正面画像')
                  figcaption 正面画像
              .requirement-image-side
                figure
                  img.w-100(v-bind:src='product.image.side' alt='側面画像')
                  figcaption 側面画像
            .requirement-table
              table
                tbody
                  tr
                    th W(幅)
                    td {{product.width}}cm
                  tr
                    th H(高さ)
                    td {{product.height}}cm
                  tr
                    th D(奥行)
                    td {{product.depth}}cm
                  tr
                    th 棚板の枚数
                    td {{product.row}}枚
                  tr
                    th 棚板の厚さ
                    td {{product.thickness}}mm
                  tr
                    th 棚板の取り付け
                    td {{product.fix}}
                  tr
                    th 背面の有無
                    td {{product.back}}
                  tr
                    th カラー
                    td {{product.color}}
          .requirement-footer 株式会社ロレムイプサム
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
