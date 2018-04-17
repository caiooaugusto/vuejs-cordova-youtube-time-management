<template>
    <router-view></router-view>
    <!--<home></home>-->
    <!-- if !authenticated then <login></login> -->
</template>

<script>
    import Main from './components/home/Main.vue'
    
    export default {
        components: {
            Main: Main
        },
        data () {
            return {}
        }
    }
</script>

<style lang="stylus">  
    @import '../node_modules/vuetify/src/stylus/settings/_colors'
    $theme := {
        primary: $red.base
        accent: $red.accent-4
        secondary: $red.darken-4
        info: $yellow.base
        warning: $deep-orange.accent-4
        error: $red.base
        success: $green.darken-2
    }
    @import '../node_modules/vuetify/src/stylus/main'
</style>