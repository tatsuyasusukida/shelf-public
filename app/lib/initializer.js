class Initializer {
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
