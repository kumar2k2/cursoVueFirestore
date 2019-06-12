import {db} from '@/main';
const initialState = () => ({ // inicilizacion del estado
  cartId: null, // id a guardar en la coleccion de cards
  cart: [], // el carrito
  totalProducts: 0, // total de productos
  selectedProduct: null, // producto seleccionado que se muestra en la toad de abajo 
});

export default {
  state: initialState(),
  actions: {
    createCartIfNotExists ({commit, state}, user) { // crear carro si no existe
      db.collection('carts').doc(user.uid).onSnapshot(cartSnap => { // se consulta si el usuario ya tiene un carrito creado o asignado
        let cart;
        if ( ! cartSnap.exists) { // si no existe 
          cart = { // la variable cart sera igual a un objeto que contendra los productos y el numero de productos
            products: [], totalProducts: 0
          };
          db.collection('carts').doc(user.uid).set(cart); // crea el cart en la coleccion
        } else {
          cart = cartSnap.data(); // si el cart existe lo hace igual a la data obtenida en la busqueda
        }
        commit('setCart', {cart, cartId: user.uid}); // se inicializa el estado del carro
      }, (error) => {
        console.log('listener cart off...');
      });
    },
    updateCart ({commit, state}, data) { // actualizar el carrito, eliminar, añadir o cambiar catidad de un producto
      let cart = db.collection('carts').doc(state.cartId);  // con esto se consigue el contenido del carrito en una variable
      const product = data.product; // datos del producto a editar en el carrito
      cart.get().then((doc) => {
        let cartData = doc.data(); // este seria el contenido del carrito
        let productsInCart = cartData.products; // estos serian los productos dentro del carrito
        const oldProductInCart = findProductByKey(productsInCart, 'id', product.id); // se busca un producto en le carrito, a ver si ya esta contenido

        if ( ! oldProductInCart) {
          if (data.type === 'increment') {
            productsInCart.push({
              id: product.id,
              name: product.name,
              qty: 1,
              price: product.price
            });
            cartData.totalProducts += 1;
          }
        } else {
          if (data.type === 'increment') {
            oldProductInCart.qty += 1;
            cartData.totalProducts += 1;
          } else {
            if ( oldProductInCart.qty === 1) {
              const index = productsInCart.findIndex(obj => obj.id === product.id);
              cartData.products = [
                ...productsInCart.slice(0, index),
                ...productsInCart.slice(index + 1)
              ];
              cartData.totalProducts -= 1;
            } else {
              oldProductInCart.qty -= 1;
              cartData.totalProducts -= 1;
            }
          }
        }

        cart.update(cartData).then(() => {
          commit('updateCart', cartData);
        })
      })
    }
  },
  mutations: {
    setCart (state, data) { // se inicializa la data del estae del carrito (productos, cantidad de productos y el id del carrito)
      state.cart = data.cart.products;
      state.totalProducts = data.cart.totalProducts;
      state.cartId = data.cartId;
    },
    updateCart (state, data) {
      state.cart = data.products;
      state.totalProducts = data.totalProducts;
    },
    setActiveProductInCart (state, product) {
      state.selectedProduct = product;
    },
    resetCart (state) {
      const initial = initialState();
      Object.keys(initial).forEach(key => {
        if (key !== 'cartId') {
          state[key] = initial[key];
        }
      })
    }
  },
  getters: {
    qtyProductInCart: (state) => {
      if ( ! state.selectedProduct) return 0;
      const selectedProduct = state.cart.filter(obj => obj.id === state.selectedProduct.id)[0];
      if (selectedProduct) {
        return selectedProduct.qty;
      }
      return 0;
    },
    totalCostCart: (state) => {
      let totalCost = 0;
      if (state.cart.length) {
        state.cart.map(product => {
          totalCost += parseFloat(product.price) * parseInt(product.qty);
        })
      }
      return totalCost;
    }
  }
}

const findProductByKey = (array, key, value) => { // busca el producto por el id a ver si existe
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return null;
};
