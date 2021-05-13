import List from './ui/list.vue'
import ProductAdd from './ui/product-add.vue'
import ProductEdit from './ui/product-edit.vue'
import ProductDelete from './ui/product-delete.vue'
import Estimate from './ui/estimate.vue'
import EstimatePrint from './ui/estimate-print.vue'
import Order from './ui/order.vue'
import Question from './ui/question.vue'

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
    } else if (new RegExp('^/product/[0-9]+/edit/$').test(pathname)) {
      return ProductEdit
    } else if (new RegExp('^/product/[0-9]+/delete/$').test(pathname)) {
      return ProductDelete
    } else if (new RegExp('^/estimate/$').test(pathname)) {
      return Estimate
    } else if (new RegExp('^/estimate/print/$').test(pathname)) {
      return EstimatePrint
    } else if (new RegExp('^/order/$').test(pathname)) {
      return Order
    } else if (new RegExp('^/question/$').test(pathname)) {
      return Question
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
