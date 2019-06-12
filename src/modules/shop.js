import {db} from '@/main';

const initialState = () => ({ // se usa para inicializar la tienda
  products: [], // productos en la tienda
  last: 100000, // fecha unix para saber cual es el ultimo
  limit: 2, // productos mostrados por carga
  finish: false, // indica si se llego al final de productos, si no hay mas productos
});

export default {
  state: initialState(),
  actions: {
    fetchAllProductsPaginate ({commit, state}) { // obtiene productos paginados - state accede al estado del modulo si se requeire acceder al state principal se usa rootstate
      if ( ! state.finish) { // verifica si el finish es false es decir si no estamos en el final de productos
        db.collection('products').limit(state.limit) // se obtienen los productos limitando la cantidad
          .where('createdAt', '>', state.last) // se indica un wehere que indica que la fecha de creacion debe ser mayor al ultimo producto mostrado
          .orderBy('createdAt', 'asc') // se indica c0mo se ordenara
          .onSnapshot(snapshot => { 
            commit('setProducts', snapshot); // se llama a la mutacion de agregar productos a la tabla 
          }, (error) => {
            console.log('listener products pagination off...'); // se muestra si hay algun error
          });
      }
    }
  },
  mutations: {
    setProducts: (state, productsSnap) => { // agrega productos a la tabla y al array de productos del state
      if ( ! productsSnap.empty) { // pregunta si el snapshot esta vacio y si es asi coloca el estado de finish en true para no hacer mas peticiones de productos

        productsSnap.forEach(productData => { // se recorre el snap
          const product = productData.data();

          const newProduct = { // se toma la informacion en un nuevo producto
            id: product.id,
            name: product.name,
            url: product.url,
            price: product.price,
            flex: 6, // este dato se usa para indicar el tamaño de losproductos en la tabla
            createdAt: product.createdAt
          };

          if ( !state.products.filter(e => e.id === newProduct.id).length > 0) { // nos aseguramos que el producto que agregaremos ya no esta en el array state.products
            state.products.push(newProduct); // se agrega el producto al array state.products
          }
        });

        state.finish = false; // finish sigue en false
        state.last = state.products.slice(-1)[0].createdAt; // tomamos la fecha de creacion del ultimo producto 
      } else {
        state.finish = true; // no queremos mas peticiones
      }
    },
    resetProductsPagination (state) { // resetea el estado
      const initial = initialState();
      Object.keys(initial).forEach(key => { state[key] = initial[key] })
    },
    updateLimitProductsPaginate (state, limit) { // para actualizar el limite, esto cuando el usuario lo solicite o desee cambiarlo
      state.limit = limit;
    }
  }
};
