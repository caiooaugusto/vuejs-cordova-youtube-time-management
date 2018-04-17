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
            showCordovaDeviceGallery () {
                this.askPicture = false
                this.cordova.camera.getPicture(
                    (imageURI) => {
                        this.$Progress.start()
                        this.photo = imageURI
                        this.$emit('PictureWasGot', this.photo)
                        this.selectedComponent = 'History'
                        this.$emit('switchComponent', this.selectedComponent)
                    },
                    (message) => {
                        //alert("Erro ao acessar a galeria de fotos: " + message)
                        //this.hideWebcam = false
                        //this.getWebcamVideo()
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
                        this.photo = imageURI
                        this.$emit('PictureWasGot', this.photo)
                        this.selectedComponent = 'History'      
                        this.$emit('switchComponent', this.selectedComponent) 
                    }, 
                    (message) => {
                        //alert("Erro ao acessar a camera: " + message)
                        //this.hideWebcam = false
                        //this.getWebcamVideo()
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
            getWebcamVideo() {
                navigator.getMedia = (
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia
                );
            
                const video = this.$refs.video;

                navigator.getMedia(
                    { video: true, audio: false },
                    (stream) => {
                        if (navigator.mozGetUserMedia) {
                            video.mozSrcObject = stream;
                        } else {
                            var vendorURL = window.URL || window.webkitURL;
                            video.src = vendorURL.createObjectURL(stream);
                        }
                        video.play();
                    },
                    (err) => {                    
                        if(err.name === 'DevicesNotFoundError'){
                            this.alertText = 'Nenhuma câmera encontrada :('
                        }else{
                            this.alertText = 'Um erro aconteceu :('
                        }
                        //this.notFound = true
                        this.askPicture = true
                    }
                )    
            },
            getWebcamPicture() {                
                var canvas = document.createElement('canvas')
                var context = canvas.getContext('2d')

                const video = this.$refs.video
                canvas.width = video.clientWidth
                canvas.height = video.clientHeight
                context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight)
                
                var data = canvas.toDataURL('image/png')
                this.photo = data
                this.$emit('PictureWasGot', this.photo)
                this.selectedComponent = 'History'      
                this.$emit('switchComponent', this.selectedComponent)        
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