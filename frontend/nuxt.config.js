import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

console.log("==============================================")
console.log('API_URL', process.env.API_URL)
console.log('NODE_ENV', process.env.NODE_ENV)
console.log('SITE_URL', process.env.SITE_URL)
console.log("==============================================")

export default {

    env: {
        SITE_URL: process.env.SITE_URL
    },

    /*
    ** Headers of the page
    */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: '~/components/LoadingBar.vue',
    /*
    ** Global CSS
    */
    css: [
        '~/assets/style.scss',
        'element-ui/lib/theme-chalk/index.css'
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        '@/plugins/index',
        '@/plugins/element-ui',
        '@/plugins/axios-accessors',
        '@/plugins/extends',
        { src: '@/plugins/jsontree', ssr: false },
        { src: '~/plugins/vuex-persist', ssr: false }
    ],
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [
        '@nuxt/typescript-build'
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/auth-next',
        '@nuxtjs/pwa',
    ],
    /*
    ** Axios module configuration
    ** See https://axios.nuxtjs.org/options
    */
    axios: {
        baseURL: process.env.API_URL
    },

    publicRuntimeConfig: {
        axios: {
            browserBaseURL: process.env.API_URL
        }
    },

    privateRuntimeConfig: {
        axios: {
            baseURL: process.env.API_URL
        }
    },


    auth: {
        strategies: {
            local: {
                token: {
                    property: 'access_token',
                    // required: true,
                    // type: 'Bearer'
                },
                user: {
                    property: 'user',
                    autoFetch: true
                },
                endpoints: {
                    login: { url: '/auth/login', method: 'post' },
                    logout: { url: '/auth/logout', method: 'post' },
                    user: { url: '/auth/user', method: 'get' }
                }
            }
        }

    },

    router: {
        middleware: ['auth']
    },
    /*
    ** Build configuration
    */
    build: {
        transpile: [/^element-ui/],
        plugins: [

        ],
        /*
        ** You can extend webpack config here,
        */
        extend(config, { isClient }) {
            if (isClient) {
                config.plugins.push(
                    //"monaco-editor-webpack-plugin": "^3.0.0",
                    new MonacoWebpackPlugin({
                        languages: ['json', 'typescript', 'r']
                    })
                )
            }
        }
    }
}
