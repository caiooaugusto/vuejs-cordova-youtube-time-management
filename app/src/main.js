import Vue from 'vue'
import VueCordova from 'vue-cordova'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import Vuetify from 'vuetify'
import VueProgressBar from 'vue-progressbar'
import VueResourceProgressBarInterceptor  from 'vue-resource-progressbar-interceptor'
import messages from 'vee-validate/dist/locale/pt_BR'
import VeeValidate, { Validator } from 'vee-validate'
import VueLodash from 'vue-lodash'
import App from './App.vue'
import { routes } from './routes'

const options = { name: 'lodash' } // customize the way you want to call it
Vue.use(VueLodash, options) // options is optional

//cordova config
Vue.use(VueCordova, {
  optionTestKey: 'optionTestValue'
})
// add cordova.js only if serving the app through file://
if (window.location.protocol === 'file:' || window.location.port === '3000') {
    var cordovaScript = document.createElement('script')
    cordovaScript.setAttribute('type', 'text/javascript')
    cordovaScript.setAttribute('src', 'cordova.js')
    document.body.appendChild(cordovaScript)
}

//vue router config
Vue.use(VueRouter);

//vue http resources 
Vue.use(VueResource)
Vue.http.interceptors.push(function(request, next) {
    // modify method
    //request.method = 'POST';
    // modify headers
    request.headers.set('Access-Control-Allow-Origin', '*');
    request.headers.set('Content-Type', 'application/json');
    // continue to next interceptor
    next();
});

Vue.http.options.root = 'https://www.googleapis.com/youtube/v3/';
//chave da api youtube => AIzaSyC756WUk3Dfl2J2-Qt-4zrlYwwxtHvqPnk

//vue resource loadingbar
const progressbarOptions = {
    color: '#000000',
    failedColor: '#D50000',
    thickness: '3px',
    transition: {
        speed: '0.4s',
        opacity: '0.7s',
        termination: 700
    },
    autoRevert: false,
    location: 'top',
    inverse: false
};
Vue.use(VueProgressBar, progressbarOptions);

const progressbarInterceptorOptions = {
    latencyThreshold: 100,
    // Number of ms before progressbar starts showing, 100 is default
    responseLatency: 1000,
    // Number of ms before progressbar starts reacting to response, 50 is default
    // Can be used to wait for more requests to kick in under single progress bar
}
Vue.use(VueResourceProgressBarInterceptor, progressbarInterceptorOptions);

//vuetify config
Vue.use(Vuetify);

//vue form validation
// Merge the locales.
Validator.addLocale(messages);
const config = {
    errorBagName: 'errors', // change if property conflicts
    fieldsBagName: 'fields',
    delay: 0,
    locale: 'pt-BR',
    dictionary: null,
    strict: true,
    classes: false,
    classNames: {
        touched: 'touched', // the control has been blurred
        untouched: 'untouched', // the control hasn't been blurred
        valid: 'valid', // model is valid
        invalid: 'invalid', // model is invalid
        pristine: 'pristine', // control has not been interacted with
        dirty: 'dirty' // control has been interacted with
    },
    events: 'input|blur',
    inject: true,
    validity: false,
    aria: true
};


Vue.use(VeeValidate, config);

//vue router
const router = new VueRouter({
    mode: 'hash', //history mode cause a bug in production *see that in future
    routes
});

(function() {
    Vue.cordova.on('deviceready', () => {
        function onBackKeyDown() {
            // Handle the back button
            event.preventDefault()
            event.stopPropagation()
            return false
        }
        document.addEventListener("backbutton", onBackKeyDown, false)
    })
}());

new Vue({
    el: '#app',
    router,
    render: h => h(App),
    data: function () {
    	return {
    		cordova: Vue.cordova
    	}
    }
});
