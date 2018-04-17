<template>
    <v-toolbar class="toolbar-tasklist elevation-0">
        <div class="toolbar-title">YouTube Time Management</div>
    </v-toolbar>
</template>

<script>

    export default {
        components: {
        },
        data () {
            return {
            }
        },   
        methods: {
        }
    }
</script>

<style lang="stylus" scoped>
    .toolbar-title
        font-size 20px
        font-weight 600

    .toolbar-tasklist
        z-index 1
        top 0px
        position fixed
        display flex
        justify-content center
        align-items center
        background-color #D50000
        color: #ffffff

    .logo-toolbar
        margin-top -8px
        width 300px !important
</style>