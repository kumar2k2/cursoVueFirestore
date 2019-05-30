// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'


// ------------- configuracion de firebase y firestore

import firebase from 'firebase' // se importa firebase
import 'firebase/firestore' // se importa todo lo necesario para trabajar con firestore
import firebaseconfig from './config/firebase' // se importa la configuracion de firebase del archivo creado en config
firebase.initializeApp(firebaseconfig) // se inicializa firebase
export const db=firebase.firestore() // exportacion de la variable db = database 

// ------------- configuracion de firebase y firestore


import i18n from '@/config/i18n' // importacion para la traduccion

import Store from '@/Store' // importacion del Store de Vuex

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  Store,
  components: { App },
  template: '<App/>'
})
