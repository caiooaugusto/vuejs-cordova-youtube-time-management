<template>
    <v-bottom-nav
        shift
        :value="true"
        :active.sync="e"
        :class="{
            'red base': e === 0,
            'red lighten-1': e === 1
        }"
    >
        <v-btn
            dark
            flat
        >
            <span>Play</span>
            <v-icon>play_circle_filled</v-icon>
        </v-btn>
    </v-bottom-nav>
</template>

<script>
    import Vue from 'vue'

    export default {
        props:{
            e: Number
        },
        data () {
            return {
            }
        }
    }
</script>

<style lang="stylus">
</style>