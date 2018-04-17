<template>
    <div>
        <div>
            <v-alert error
                     icon='photo_camera'
                     class='camera-alert'
                     v-text='alertText'
                     v-model='notFound'
            >
            </v-alert>
            <v-dialog v-model="askPicture">
                <v-card>
                    <v-card-row>
                        <v-card-title>Procure por fotos no seu dispositivo ou utilize a câmera do dispositivo!</v-card-title>
                    </v-card-row>
                    <v-card-row>
                        <v-card-text><br>O que você deseja fazer?</v-card-text>
                    </v-card-row>
                    <v-card-row actions>
                        <v-btn class="green--text darken-1" flat="flat" @click.native="showCordovaCamera()">Câmera</v-btn>
                        <v-btn class="green--text darken-1" flat="flat" @click.native="showCordovaDeviceGallery()">Galeria</v-btn>
                    </v-card-row>
                </v-card>
            </v-dialog>
        </div>
        <!--<div :hidden="hideWebcam">
            <video ref='video' class='camera-video'></video>
            <img :src='photo' class='camera-photo'/>-->
        <v-btn secondary floating
               class="floating-action-button file-floating-action-button fisherbook base-2 white--text"
               v-tooltip:left="{ html: 'Procurar foto' }"
               @click.native='showCordovaDeviceGallery()' >
            <v-icon class="white--text">file_upload</v-icon>
        </v-btn>
        <v-btn
                v-tooltip:left="{ html: 'Tirar foto' }"
                floating
                class="floating-action-button camera-floating-action-button fisherbook base-2"
                @click.native='showCordovaCamera()' >
            <v-icon class="white--text">photo_camera</v-icon>
        </v-btn>
        <!--</div>  -->
    </div>
</template>

<script>
    import Vue from 'vue' 

    export default {
        props: ['selectedComponent'],
        data () {
            return {
                user: JSON.parse(localStorage.getItem('user')),
                cordova: Vue.cordova,                
                hideWebcam: true,
                photo: null,
                video: '',
                askPicture: false,
                notFound: false,
                alertText: '',
                e: 4
            }
        },
        mounted () {
            this.$emit('switchFooter', this.e)
            this.askPicture = true
        },
        methods: {
            isCordova() {
                return (window.location.protocol === 'file:' || window.location.port === '3000') ? true : false
            },
            uploadPhoto(){
                this.$Progress.start()
                console.log('upload start')
                var options = new this.cordova.fileUploadOptions()
                options.fileKey = "photo"
                options.fileName = "photo"
                options.mimeType = "image/png"

                var params = this.user

                options.params = params
                options.chunkedMode = false

                var ft = new this.cordova.fileTransfer()

                var self = this

                ft.upload(this.user.image_url, "https://fisherbook-api.herokuapp.com/api/user/uploadPhoto", function(result){
                    //alert('successfully uploaded ' + result.response)
                    self.user.image_url = result.response
                    console.log('upload sucess')
                    console.log(self.user.image_url)
                    self.updateUserPhoto()
                }, function(error){
                    alert('Aconteceu um erro ao fazer upload da foto para o servidor: ' + JSON.stringify(error))
                }, options)
            },
            showCordovaDeviceGallery () {
                this.askPicture = false
                this.cordova.camera.getPicture(
                    (imageURI) => {
                        this.$Progress.start()
                        console.log('get imgeuri: '+imageURI)
                        this.user.image_url = imageURI
                        this.uploadPhoto()
                    },
                    (message) => {
                        //alert("Erro ao acessar a galeria de fotos: " + message)
                    },
                    {
                        quality: 30,
                        encodingType: this.cordova.camera.EncodingType.JPEG,
                        sourceType: this.cordova.camera.PictureSourceType.PHOTOLIBRARY,
                        destinationType: this.cordova.camera.DestinationType.FILE_URI,
                        mediaType: this.cordova.camera.MediaType.PICTURE,
                        allowEdit: true,
                        correctOrientation: true,
                        saveToPhotoAlbum: true
                    })
            },
            showCordovaCamera () {
                this.askPicture = false
                function onSuccess() {
                    //alert("Camera cleanup success.")
                }
                function onFail(message) {
                    //alert('Failed because: ' + message)
                }
                this.cordova.camera.cleanup(onSuccess, onFail)
                this.cordova.camera.getPicture(
                    (imageURI) => {
                        this.$Progress.start()
                        this.user.image_url = imageURI

                        this.uploadPhoto()
                    },
                    (message) => {
                        //alert("Erro ao acessar a camera: " + message)
                    },
                    {
                        quality: 30,
                        encodingType: this.cordova.camera.EncodingType.JPEG,
                        destinationType: this.cordova.camera.DestinationType.FILE_URI,
                        mediaType: this.cordova.camera.MediaType.PICTURE,
                        allowEdit: true,
                        correctOrientation: true,
                        saveToPhotoAlbum: true
                    })
            },
            updateUserPhoto(){
                this.$http.put('user/updateUserPhoto', {userId: this.user.id, photo: this.user.image_url})
                    .then(response => {
                        return response.json()
                    }, error => {
                        alert('Ocorreu um erro ao atualizar sua foto de perfil. '+JSON.stringify(error))
                    }).then(data => {
                        this.photo = this.user.image_url
                        localStorage.setItem('user',JSON.stringify(this.user))
                        this.$emit('PictureWasGot', this.photo)
                        this.selectedComponent = 'Home'
                        this.$emit('switchComponent', this.selectedComponent)
                })
            }
        }
    }
</script>

<style lang="stylus">
    .file-floating-action-button
        position fixed !important
        right 20px !important
        bottom 160px !important

    .camera-floating-action-button
        position fixed !important
        right 20px !important
        bottom 75px !important

    .camera-video
        width 100%
        height auto

    .camera-photo
        display none

    .camera-alert
        margin 0px
</style>