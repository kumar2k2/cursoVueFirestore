<template>
  <v-dialog v-model="productsDialog" max-width="500px">

    <v-btn dark slot="activator" class="indigo lighten-1 white--text text-xs-center mb-2">
      {{ $t('admin.productsTable.newProduct')}}
    </v-btn>

    <v-card>
      <v-card-title>
        <span class="headline">{{ $t('admin.productsTable.newProduct')}}</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>

            <v-flex xs12>
              <v-text-field :label="$t('admin.productsTable.name')" v-model="productForEdit.name"/>
            </v-flex>

            <v-spacer />

            <v-flex xs12>
              <v-text-field :label="$t('admin.productsTable.price')" v-model="productForEdit.price"/>
            </v-flex>

            <v-flex xs12>
              <a v-if="productForEdit.url" :href="productForEdit.url" target="_blank">
                {{ $t('admin.productsTable.openFile') }}
              </a>

              <file-input accept="image/*" @input="getUploadedFile"/>

            </v-flex>

          </v-layout>
        </v-container>
      </v-card-text>

      <v-card-actions>

        <v-spacer />

        <v-btn color="blue darken-1" flat @click="close">
          {{ $t('common.close') }}
        </v-btn>

        <v-btn v-if="$store.getters.productsDialogEditMode" color="blue darken-1" flat @click="update">
          {{ $t('common.update') }}
        </v-btn>
        <v-btn v-else color="blue darken-1" flat @click="add">
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import {db} from "@/main";
  import * as faker from 'faker';
  import {mapGetters} from 'vuex';
  import FileInput from "@/components/helpers/FileInput";
	export default {
		name: "admin-products-dialog",
    components: {FileInput},
    methods: {
		  close () { // cierra la ventana modal; elimina el modo edicion y el producto lo pone vacio
        this.$store.commit('toggleProductsDialog', {
          editMode: false,
          product: {
            id: null,
            name: '',
            price: '',
            url: '',
            file_id: ''
          }
        })
      },
      add () { // agregar productos 
        this.productForEdit.id = faker.random.alphaNumeric(16); // crea id de 16 caracteres alfanumericos
        const product = Object.assign({}, this.productForEdit); // agrega los datos traidos por el getter que esta al final a una cosntante product
        product.createdAt = Date.now(); // agrega la fecha de creacion al product
        db.collection('products').doc(this.productForEdit.id).set(product).then(() => { // agrega el producto la base de datos firebase
          if (this.image) { // si existe imagen, si fue seleccioana alguna imagen
            this.$store.dispatch('pushFileToStorage', {fileToUpload: this.image, id: product.id}).then(() => { // llama a la accion del modulo para subir la imagen al storage, pasando la imagen y el id del producto
              this._alertAndClose('saved'); // muestra mensaje alert 
            })
          } else {
            this._alertAndClose('saved');
          }
        });
      },
      update () { // edicion de producto
        const product = Object.assign({}, this.productForEdit); // agrega los datos del producto tomados con el getter del final
      
        db.collection('products').doc(product.id).update(product).then(() => { // se solicita la actualizacion
          if (this.image) { // pregunta si hay imagen seleccioanada
            if (product.url) { // si el producto tenia imagen se la borra del storage y de la relacion con el producto              
              this.$store.dispatch('removeFile', product).then(() => { // borrado de storage
                this.$store.dispatch('updateDeletedProduct', product.id); // eliminando relacion con el producto
              })
            }

            //subimos la nueva imagen
            this.$store.dispatch('pushFileToStorage', {fileToUpload: this.image, id: product.id}).then(() => {
              this._alertAndClose('updated');
            });
          } else {
              this._alertAndClose('updated');
          }
        })
      },
      getUploadedFile (e) { // al seleccionar la imagen en el Input File se le asignan los datos a una variable
        this.image = e;         
      },
      _alertAndClose (action) { // cierra y muestra alert
        this.$store.commit('setAlertMessage', {
          show: true,
          type: 'success',
          message: this.$t(`messages.${action}`, {item: this.$t('common.product')}),
          timeout: 5000
        });
        this.close();
      }
    },
    computed: {
		  productsDialog: {
		    get () {
          return this.$store.getters.productsDialog;
        },
        set () {
          this.close();
        }
      },
      ...mapGetters(['productForEdit']) // acciona el getter del modulo de productos
    }
	}
</script>
