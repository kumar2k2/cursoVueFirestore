import {db} from '@/main';

const initialState = () => ({
  products: [],
  last: 100000,
  limit: 2,
  finish: false,
});

export default {
  state: initialState(),
  actions: {
    fetchAllProductsPaginate ({commit, state}) {
      if ( ! state.finish) {
        db.collection('products').limit(state.limit)
          .where('createdAt', '>', state.last)
          .orderBy('createdAt', 'asc')
          .onSnapshot(snapshot => {
            commit('setProducts', snapshot);
          }, (error) => {
            console.log('listener products pagination off...');
          });
      }
    }
  },
  mutations: {
    setProducts: (state, productsSnap) => {
      if ( ! productsSnap.empty) {

        productsSnap.forEach(productData => {
          const product = productData.data();

          const newProduct = {
            id: product.id,
            name: product.name,
            url: product.url,
            price: product.price,
            flex: 6,
            createdAt: product.createdAt
          };

          if ( !state.products.filter(e => e.id === newProduct.id).length > 0) {
            state.products.push(newProduct);
          }
        });

        state.finish = false;
        state.last = state.products.slice(-1)[0].createdAt;
      } else {
        state.finish = true;
      }
    },
    resetProductsPagination (state) {
      const initial = initialState();
      Object.keys(initial).forEach(key => { state[key] = initial[key] })
    },
    updateLimitProductsPaginate (state, limit) {
      state.limit = limit;
    }
  }
};
