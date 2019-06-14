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
      cart.get().then((doc) => { // se solicita el carrito respectivo
        let cartData = doc.data(); // este seria el contenido del carrito
        let productsInCart = cartData.products; // estos serian los productos dentro del carrito
        const oldProductInCart = findProductByKey(productsInCart, 'id', product.id); // se busca un producto en le carrito, a ver si ya esta contenido

        if ( ! oldProductInCart) { // No existe el rpoducto
          if (data.type === 'increment') { // si el producto no esta en el carrito el tipo de variacion siempre debe ser increment
            productsInCart.push({ // se agrega el carrito al arreglo de productos
              id: product.id,
              name: product.name,
              qty: 1, // la cantidad se coloca en uno
              price: product.price
            });
            cartData.totalProducts += 1; // la cantidad de productos en el carrito aumenta en uno
          }
        } else { // Si existe el producto
          if (data.type === 'increment') { // si existe la variacion puede ser increment 
            oldProductInCart.qty += 1; // aumenta en uno la cantidad del producto
            cartData.totalProducts += 1; // aumenta en uno la cantidad de productos en el carrito
          } else { // o decrement
            if ( oldProductInCart.qty === 1) { // si la cantidad del producto es 1 y se decrementa
              const index = productsInCart.findIndex(obj => obj.id === product.id); // se busca el indice del producto dentrol de array (la funcion esta al final de la hoja)
              cartData.products = [ // se elimina el producto del array
                ...productsInCart.slice(0, index),
                ...productsInCart.slice(index + 1)
              ];
              cartData.totalProducts -= 1; // el total de productos se disminuye en uno
            } else { // si se decrementa y la cantidad es mayor a uno
              oldProductInCart.qty -= 1; // se disminuye en uno la cantidad del producto
              cartData.totalProducts -= 1; // se dismunuye en uno la cantidad de productos del carrito
            }
          }
        }

        cart.update(cartData).then(() => { // se actualiza el carrito con el 
          commit('updateCart', cartData);
        })
      })
    }
  },
  mutations: {
    setCart (state, data) { // se inicializa la data del state del carrito (productos, cantidad de productos y el id del carrito)
      state.cart = data.cart.products;
      state.totalProducts = data.cart.totalProducts;
      state.cartId = data.cartId;
    },
    updateCart (state, data) { // actualiza productos en el carrito en el state
      state.cart = data.products;
      state.totalProducts = data.totalProducts;
    },
    setActiveProductInCart (state, product) { // establece el producto seleccionado en el state
      state.selectedProduct = product;
    },
    resetCart (state) {  // resetea el state pero no elimina el ide del carrito en el state
      const initial = initialState();
      Object.keys(initial).forEach(key => {
        if (key !== 'cartId') {
          state[key] = initial[key];
        }
      })
    }
  },
  getters: {
    qtyProductInCart: (state) => { // cantidad de produtos en un producto del carrito
      if ( ! state.selectedProduct) return 0; // si no hay productos seleccionados
      const selectedProduct = state.cart.filter(obj => obj.id === state.selectedProduct.id)[0]; // se busca el producto seleccioando
      if (selectedProduct) { // si se consigue el producto
        return selectedProduct.qty; // retorna la cantidad
      }
      return 0; // retorna cero si el producto no esta en el carrito
    },
    totalCostCart: (state) => { // monto total del carrito
      let totalCost = 0;
      if (state.cart.length) { // si el array del carrito en state tiene productos
        state.cart.map(product => { // mapea todos los productos del array
          totalCost += parseFloat(product.price) * parseInt(product.qty); // calculo del total
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
