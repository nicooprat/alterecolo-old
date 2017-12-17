import settings from './settings'

import Vue from 'vue'
import bugsnag from 'bugsnag-js'
import bugsnagVue from 'bugsnag-vue'

const bugsnagClient = bugsnag('3fa623ae462ce13db539a7a70631a0fa')
bugsnagClient.use(bugsnagVue(Vue))

export default bugsnagClient
