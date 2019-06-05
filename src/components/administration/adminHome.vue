<template>
  <v-layout row>
    <v-flex xs12 sm3>
      <v-navigation-drawer permanent>
        <v-toolbar flat>
          <v-list>
            <v-list-tile-title class='title'>
              {{ $t('admin.home') }}
            </v-list-tile-title>
          </v-list>
        </v-toolbar>
        <v-divider />
        <v-list dense class='pt-0'>
          <v-list-tile v-for='item in items' :key='item.title' :to='item.to' align-center>
            <v-list-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
    </v-flex>
  </v-layout>
</template>

<script>
    export default {
        name: 'admin-home',
        data() {
          return {
            items:[
              {title:this.$t('admin.products'), icon: 'shopping_basket', to:'/admin/products'},
              {title:this.$t('admin.users'), icon: 'face', to:'/admin/users'}              
            ]
          }
        },
        methods: {
            
        },
        props:{

        }
    }
</script>
