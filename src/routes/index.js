import HealthRouter from './health.js'
import ApiRouter from './api.js'

export default (app) => {

  app
    .use(HealthRouter)
    .use('/api', ApiRouter)

}
