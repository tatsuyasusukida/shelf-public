import List from './ui/list.vue'
import ProductAdd from './ui/product-add.vue'
import ProductDelete from './ui/product-delete.vue'

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
    if (pathname === '/list/') {
      return List
    } else if (pathname === '/product/add/') {
      return ProductAdd
    } else if (new RegExp('^/product/[0-9]+/delete/$').test(pathname)) {
      return ProductDelete
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
