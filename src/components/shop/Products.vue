<template>
  <div>
    <v-layout column>
      <v-flex xs12 sm6>

        <v-toolbar color="indigo" dark>
          <v-toolbar-title>{{ $t('shop.product_list') }}</v-toolbar-title>

          <v-spacer />

          <v-menu
            origin="center center"
            transition="scale-transition"
            bottom
          >
            <v-btn color="primary" dark slot="activator">
              {{ $t('shop.products_qty') }} ({{ $store.state.shopModule.limit }})
              {{ $t('shop.total_products') }} ({{ products.length }})
            </v-btn>

            <v-list>
              <v-list-tile v-for="(limit, i) in [2, 4, 6, 8, 10, 20, 50]" :key="i">
                <v-list-tile-title @click="changeLimit(limit)">
                  {{ limit}}
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar>

        <v-card>
          <v-container fluid grid-list-md>

            <v-layout row wrap>
              <v-flex
                :class="`xs${product.flex}`"
                v-for="product in products"
                :key="product.name"
              >
                <product
                  :product="product"
                  @addToCart="openSheet(product)"
                />
              </v-flex>
            </v-layout>

          </v-container>
        </v-card>

      </v-flex>
    </v-layout> 

    <v-layout row>
      <infinite-scroll :handler="fetchProducts" :should-handle="!loading" />

      <v-progress-linear v-if="loading" color="purple" indeterminate />

    </v-layout>

    <product-sheet :product="productSheet" @closeSheet="closeSheet" :sheet="statusSheet" />
  </div>
</template>

<script>
  import InfiniteScroll from 'vue-mugen-scroll';
  import Product from './Product';
  import ProductSheet from './ProductSheet';

	export default {
		name: "products",
    components: {
		  InfiniteScroll, Product, ProductSheet
    },
    data () {
		  return {
		    loading: false, // cargando productos Datatable
        productSheet: {}, // productos que se enviaran al sheet
        statusSheet: false // se muestra el sheet o no
      }
    },
    destroyed () { // cuando se cambia la ruta o cuando se recarga la pagina
		  this.$store.commit('resetProductsPagination');
    },
    computed: {
		  products () {
		    return this.$store.state.shopModule.products; // accede a todos los productos
      },
      limit () {
		    return this.$store.state.shopModule.limit; // accede al limit de elementos a cargar
      }
    },
    methods: {
		  openSheet (product) { // abre elsheet y pasa la informacion necesaria para que muestre la imagen del producto, asi como la cantidad
		    this.productSheet = product; // producto a mostrar
		    this.statusSheet = true; // mostrar sheet
		    this.$store.commit('setActiveProductInCart', product); // establece el producto seleccionado en el state
      },
      fetchProducts () { // obtener productos que salen de la tienda
		    if ( !this.$store.state.shopModule.finish) { // si todavia hay productos por cargar
		      this.loading = true; // muestra el loading
		      setTimeout(() => {
		        this.$store.dispatch('fetchAllProductsPaginate').then(() => { // agrega los productos a la pagina
		          this.loading = false;
            })
          }, 2000);
        }
      },
      changeLimit (limit) { // cambia el limite de paginacion, productos por carga
		    if ( this.limit !== limit) { // siel limite establecido en el state es diferente
		      this.$store.commit('resetProductsPagination'); // resetea los productos mostrados en la tabla y en el state
		      this.$store.commit('updateLimitProductsPaginate', limit); // actualiza el limte en el state
		      this.fetchProducts(); // agrega productos a la tabla
        }
      },
      closeSheet () { // cierra el sheet
		    this.statusSheet = false;
      }
    }
	}
</script>
