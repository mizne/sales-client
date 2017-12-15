import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import Vue from 'vue'

Raven.config(
  'https://f0fd16a5120f404e8758b66d9f4c1488@sentry.io/258071'
)
  .addPlugin(RavenVue, Vue)
  .install()

export default class Logger {
  static error(options) {
    const msg = `Module: ${options.module}, Method: ${
      options.method
    }, description: ${options.description}`

    return Raven.captureMessage(msg)
  }

  static info(options) {
    const msg = `Module: ${options.module}, Method: ${
      options.method
    }, description: ${options.description}`

    return Raven.captureMessage(msg, {
      level: 'info'
    })
  }
}
