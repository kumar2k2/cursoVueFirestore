<template>
  <div>
    <div>
      <img
        :src="imageUrl"
        ref="imageUrl"
        height="150"
        @click="onPickFile"
        style="cursor: pointer;"
      />
    </div>
    <div>
      <v-btn raised @click="onPickFile" v-if="!imageUrl">
        {{ $t('admin.productsTable.select_image') }}
      </v-btn>
      <v-btn raised class="error" @click="removeFile" v-else>
        {{ $t('admin.productsTable.remove') }}
      </v-btn>
      <input
        type="file"
        ref="image"
        name="image"
        :accept="accept"
        @change="onFilePicked"
      >
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String
      },
      accept: {
        type: String,
        default: '*'
      },
      selectLabel: {
        type: String,
      },
      removeLabel: {
        type: String,
      }
    },

    data() {
      return {
        imageUrl: ''
      }
    },

    watch: {
      value(value) {
        this.imageUrl = value
      }
    },

    mounted() {
      this.imageUrl = this.value
    },

    methods: {
      onPickFile () {
        this.$refs.image.click() // activar el input file
      },

      onFilePicked (event) {
        
        const files = event.target.files || event.dataTransfer.files; // tomo tdos los archivos
        
        if (files && files[0]) {
          let filename = files[0].name; // tomo el nombre

          if (filename && filename.lastIndexOf('.') <= 0) {
            return
          }

          const fileReader = new FileReader();
          
          fileReader.addEventListener('load', () => {
            this.imageUrl = fileReader.result
            
          });

          fileReader.readAsDataURL(files[0]);


          this.$emit('input', files[0]);
        }
      },

      removeFile() {
        this.imageUrl = ''
      }
    }
  }
</script>

<style scoped>
  input[type=file] {
    position: absolute;
    left: -99999px;
  }
</style>
