<template>
  <div>
      <auth-form
        action='register'
        v-on:process='register($event)'
      />
      <appsnackbar
      v-if='snackBar'
      :snack-bar='snackBar'
      :text='message'
      :timeout='timeout' 
    />
  </div>    
</template>

<script>
import appsnackbar from './SnackBar'
import AuthForm from '@/forms/Auth'
import Store from '../Store/index.js' // importacion del Store de Vuex
import {db} from '../main'
    export default {
        name: 'Register',
        Store,
        components:{AuthForm, appsnackbar},
        data() {
          return {
            snackBar:false,
            message:'',
            timeout:5000
          }
        },
        methods: {
          register (user) {
            Store.dispatch('firebaseRegister', user)
              .then((userRegistered) => { 
                const data = {
                  uid: userRegistered.user.uid,
                  email: user.email,
                  role: 'customer'
                }
                db.collection('users').doc(userRegistered.user.uid).set(data).then(() => {                  
                  Store.commit('setRole', data.role);                  
                  this.$router.push('/');
                });
              })
              .catch((error) => {                
                this.message = error.message.substr(0, 60);                
                this.snackBar = true
                setTimeout(() => {
                  this.snackBar = false
                }, this.timeout);
              })
          }  
        },
        props:{

        }
    }
</script>
