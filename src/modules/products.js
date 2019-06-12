import firebase from 'firebase';
import * as faker from 'faker';

export default {
  state: {
    admin: {
      products: {
        dialog: false,
        editMode: false,
        product: {
          id: null,
          name: '',
          price: '',
          file_id: '',
          url: ''
        }
      }
    }
  },
  actions: {
    pushFileToStorage({commit}, {fileToUpload, id}) { // sube el archivo al storage
      const storageRef = firebase.storage().ref(); // crea referencia 
      const fileId = faker.random.alphaNumeric(16); // crea Id para el archivo de 16 caracteres alfanumericos
      const uploadTask = storageRef.child(`/products/${fileId}`).put(fileToUpload); // crea la orden para subir el archivo

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          // muestra el progreso de la subida del archivo
          const snap = firebase.storage.UploadTaskSnapshot;
        },
        (error) => { // si se presenta algun error en la subida del archivo
          console.log(error);
        },
        () => {
          storageRef.child(`/products/${fileId}`).getDownloadURL().then(url => { // cuando se termina satisfactoriamente de subir el archivo
            let product = firebase.firestore().collection('products').doc(id); // se solicita el producto
            return product.update({ // se actualizan los datos del archivo subido en el producto correspondiente
              url: url,
              file_id: fileId
            });
          });
        }
      )
    },
    removeFile ({commit}, product) { // para borrar un archivo del storage
      return firebase.storage().ref().child(`products/${product.file_id}`).delete();
    },
    updateDeletedProduct ({commit}, id) { // actualizacion de datos en el producto cuando se borra un archivo del storage
      let product = firebase.firestore().collection(`products`).doc(id);
      if (product) {
        return product.update({
          url: '',
          file_id: ''
        });
      }
    }
  },
  mutations: {
    toggleProductsDialog: (state, data) => { // se activa la ventana modal  
      state.admin.products.dialog = ! state.admin.products.dialog;
      state.admin.products.editMode = data.editMode;
      state.admin.products.product = data.product;
    }
  },
  getters: {
    productsDialog: (state) => {
      return state.admin.products.dialog;
    },
    productForEdit: (state) => {
      return state.admin.products.product;
    },
    productsDialogEditMode: (state) => {
      return state.admin.products.editMode;
    }
  }
};
