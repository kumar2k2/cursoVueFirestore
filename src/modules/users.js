export default{
    state:{
        dialog:false,
        editMode:false,
        user:{
            uid:null,
            email:'',
            username:''
        }
    },
    mutations:{
        toggleUserDialog:(state,data)=>{
            state.dialog=!state.dialog
            state.editMode=data.editMode
            state.user=data.user
        }
    },
    getters:{
        usersDialog:(state)=>{
            return state.dialog
        },
        userForEdit:(state)=>{
            return state.user
        },
        userDialogEditMode:(state)=>{
            return state.editMode
        }
    }

}