const querystring = require('querystring')
const {Initializer} = require('./initializer')

class ImageMaker {
  constructor () {
    this.initializer = new Initializer()
  }

  makeImage (req) {
    const options = this.initializer.makeOptionsProductColor()
    const map = options.reduce((memo, option) => {
      memo[option.value] = option.background
      return memo
    }, {})

    const background = map[req.body.form.color]
    const search = '?' + [
      querystring.stringify(req.body.form),
      querystring.stringify({background}),
    ].join('&')

    return {
      front: '/render/front.svg' + search,
      side: '/render/side.svg' + search,
    }
  }
}

module.exports.ImageMaker = ImageMaker
