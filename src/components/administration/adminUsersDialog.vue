<template>
  <div>
    
  </div>
</template>

<script>
import {db} from '@/main' // importacion de la conexiona la base de datos
import * as faker from 'faker' // crea id de forma dinamica para que no se repitan
import {mapGetters} from 'vuex' // mapeo de getters

import Store from '@/store/index' // importacion del Store de Vuex

    export default {      
        name: 'admin-users-dialog',
        Store,
        data() {
          return {

          }
        },
        methods: {
           close(){
              Store.commit('toggleUserDialog',{
                editMode:false,
                user:{
                  uid:null,
                  email:'',
                  username:''
                }
              })
           },
           add(){
              this.userForEdit.uid=faker.random.alphaNumeric(16) // se asigna un id al usuario, aleatorio de 16 caracteres
              this.userForEdit.rol='customer' // se le asigna un rol al usuario
              const user = Object.assign({},this.userForEdit) // se crea el documento con los datos del usuario y el id creado
              db.collection('users').doc(this.userForEdit.uid)
           },
           update(){

           }
        },
        computed:{
          userDialog:{
            get(){
              return Store.getters.userDialog
            },
            set(){
              this.close()
            }
          },
          ...mapGetters(['userForEdit'])
        },
        props:{

        }
    }
</script>
