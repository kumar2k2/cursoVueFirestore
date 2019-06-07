<template>
  <v-dialog v-model='userDialog' max-width='500px'>
    <v-btn dark slot='activator' class='indigo lighten-1 white--text text-xs-center mb-2'>
      {{ $t('admin.usersTable.newUser') }}
    </v-btn>
    <v-card>
      <v-card-title>
        <span class='headLine'>
          {{ $t('admin.usersTable.newUser') }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field :label="$t('auth.email')" v-model='userForEdit.email'/>
            </v-flex>
            <v-spacer/>
            <v-flex xs12>
              <v-text-field :label="$t('auth.username')" v-model='userForEdit.username'/>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn color='blue darken-1' flat @click='close'> 
          {{ $t('common.close') }}
        </v-btn>
        <v-btn v-if='DialogEditMode' color='blue darken-1' flat @click='update'> 
          {{ $t('common.update') }}
        </v-btn>
        <v-btn v-else color='blue darken-1' flat @click='add'> 
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
            userForEdit:{},
            DialogEditMode:false
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
              db.collection('users').doc(this.userForEdit.uid).set(user).then(()=>{ // si se agrega exitosamente se muestra un mensaje toast snackbar
                Store.commit('setAlertMessage',{
                  show:true,
                  type:'success',
                  message:this.$t('messages.saved',{item:this.$t('common.user')}),
                  timeout:5000
                })
              })
              this.close()
           },
           update(){
             const user= Object.assign({},this.userForEdit)
             db.collection('users').doc(user.uid).update(user).then(()=>{
               Store.commit('setAlertMessage',{
                  show:true,
                  type:'success',
                  message:this.$t('messages.edited',{item:this.$t('common.user')}),
                  timeout:5000
                })
             })
             this.close()
           }
        },
        computed:{
          userDialog:{
            get(){
              return Store.state.usersModule.dialog
            },
            set(){
              this.close()
            }
          },
          dataUserForEdit(){
            userForEdit=Store.state.usersModule.user
          },
          userDialogEditMode(){
            return DialogEditMode=Store.state.usersModule.editMode
          }
        },
        props:{

        }
    }
</script>
