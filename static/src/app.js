import ProductAdd from './ui/product-add.vue'

class Main {
  async run () {
    const page = this.getPage(window.location.pathname)

    if (page) {
      const vm = new Vue(page)
      await vm.initialize()

      vm.$mount('#main')
    }
  }

  getPage (pathname) {
    if (pathname === '/product/add/') {
      return ProductAdd
    } else {
      return null
    }
  }
}

main()

async function main () {
  try {
    await new Main().run()
  } catch (err) {
    console.error(err.message)
    console.debug(err.stack)
  } 
}
