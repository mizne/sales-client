// import { Logger } from '@/http/index'

// const userActions = ['ADD_FOOD', 'REMOVE_FOOD']

// const collectUserActionPlugin = store => {
//   store.subscribe((mutation, state) => {
//     if (userActions.indexOf(mutation.type) > -1) {
//       let description = `food: ${mutation.payload.food.name}; num: ${mutation
//         .payload.num};`

//       mutation.payload.remark &&
//         (description += ` food-remark: ${mutation.payload.remark}`)

//       Logger.info({
//         module: 'Menu.vue',
//         method: mutation.type,
//         description
//       })
//     }
//   })
// }

// export default [collectUserActionPlugin]
