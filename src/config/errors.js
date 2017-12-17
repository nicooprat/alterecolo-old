import settings from './settings'

import Vue from 'vue'
import bugsnag from 'bugsnag-js'
import bugsnagVue from 'bugsnag-vue'

const bugsnagClient = bugsnag(settings.bugsnag)
bugsnagClient.use(bugsnagVue(Vue))

export default bugsnagClient
