<template>
    <v-app
        top-toolbar
        footer
    >
        <toolbar></toolbar>
        <main class="home-main">
            <v-container>
                <vue-progress-bar></vue-progress-bar>
                <video-list></video-list>
            </v-container>
        </main>
        <home-footer
            :e='e'
            @switchFooter='e = $event'
        ></home-footer>
    </v-app>
</template>

<script>
    import Toolbar from './Toolbar.vue'
    import HomeFooter from './Footer.vue'
    import VideoList from '../video/VideoList.vue'
    
    export default {
        components: {
            Toolbar,
            HomeFooter,
            VideoList
        },
        data () {
            return {
                e: 0
            }
        }
    }
</script>

<style lang="stylus">
    .home-main
        padding-top 56px
        padding-bottom 120px
        min-height: 100vh
        min-width: 100vw

    .__cov-progress
        top 112px !important
</style>