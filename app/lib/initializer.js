class Initializer {
  makeFormQuestion () {
    return {
      category: '',
      name: 'ここに氏名が入ります',
      kana: 'ここにフリガナが入ります',
      company: '株式会社ロレムイプサム',
      zip: '9402039',
      address: '新潟県長岡市関原南4丁目3934番地',
      tel: '0258945233',
      email: 'shelf@loremipsum.co.jp',
      content: [
        'ここにテキストが入ります。',
        'ここにテキストが入ります。',
        'ここにテキストが入ります。',
      ].join('\n'),
    }
  }

  makeOptionsQuestion () {
    return {
      category: [
        {value: '商品について', text: '商品について'},
        {value: '法人割引について', text: '法人割引について'},
      ],
    }
  }

  makeFormEstimate () {
    return {
      name: '株式会社ロレムイプサム',
      title: '御中',
      subscribe: '受け取る',
      email: 'shelf@loremipsum.co.jp',
    }
  }

  makeOptionsEstimate () {
    return {
      title: [
        {value: '御中', text: '御中'},
        {value: '様', text: '様'},
      ],
      subscribe: [
        {value: '受け取る', text: '受け取る'},
        {value: '受け取らない', text: '受け取らない'},
      ],
    }
  }

  makeFormProduct () {
    return {
      width: '15',
      height: '49',
      depth: '19',
      row: '1',
      thickness: '17',
      fix: 'ビス（固定）',
      back: 'なし',
      color: 'ナチュラル',
      amount: '1',
    }
  }

  makeOptionsProduct () {
    return {
      row: this.makeOptionsProductRow(),
      thickness: this.makeOptionsProductThickness(),
      fix: this.makeOptionsProductFix(),
      back: this.makeOptionsProductBack(),
      color: this.makeOptionsProductColor(),
    }
  }

  makeOptionsProductRow () {
    return [
      {value: '1', text: '1枚'},
      {value: '2', text: '2枚'},
      {value: '3', text: '3枚'},
      {value: '4', text: '4枚'},
      {value: '5', text: '5枚'},
      {value: '6', text: '6枚'},
    ]
  }

  makeOptionsProductThickness () {
    return [
      {value: '17', text: '17mm'},
      {value: '25', text: '25mm'},
    ]
  }

  makeOptionsProductFix () {
    return [
      {value: 'ビス（固定）', text: 'ビス（固定）'},
      {value: '棚ダボ（可動）', text: '棚ダボ（可動）'},
    ]
  }

  makeOptionsProductBack () {
    return [
      {value: 'なし', text: 'なし'},
      {value: 'あり', text: 'あり'},
    ]
  }

  makeOptionsProductColor () {
    return [
      {value: 'ナチュラル', text: 'ナチュラル', background: '#c4b295'},
      {value: 'ホワイト', text: 'ホワイト', background: '#ebe5d7'},
      {value: 'ブラウン', text: 'ブラウン', background: '#573d2b'},
      {value: 'ブラック', text: 'ブラック', background: '#322e2f'},
    ]
  }
}

module.exports.Initializer = Initializer
