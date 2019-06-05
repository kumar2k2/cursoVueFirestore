import Store from '../store/index' // importacion del Store de Vuex

export default{
    Store,
    methods: {
        togglerDrawer(){
            this.drawer=!this.drawer
        },
        logout(){
            Store.dispatch('firebaseLogout').then(() => {
                Store.commit('setUser')
                Store.commit('setRole','guest')
                this.$router.push('/login')
            })

        }
    }
}