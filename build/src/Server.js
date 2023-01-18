import Express from 'express'
import * as http from 'http'
import CORS from 'cors'
import swaggerUi from 'swagger-ui-express'
import { ValidateError } from 'tsoa'
import fs from 'fs/promises'
import { Server as SocketServer } from 'socket.io'
import { RegisterRoutes } from '../generated/routes'
import TownsStore from './lib/TownsStore'
import { TownsController } from './town/TownsController'
import { logError } from './Utils'
const app = Express()
app.use(CORS())
const server = http.createServer(app)
const socketServer = new SocketServer(server, {
  cors: { origin: '*' }
})
TownsStore.initializeTownsStore((townID) => socketServer.to(townID))
socketServer.on('connection', socket => {
  new TownsController().joinTown(socket)
})
app.use(Express.json())
app.use('/docs', swaggerUi.serve, async (_req, res) => {
  const swaggerSpec = await fs.readFile('../shared/generated/swagger.json', 'utf-8')
  return res.send(swaggerUi.generateHTML(JSON.parse(swaggerSpec)))
})
RegisterRoutes(app)
app.use((err, _req, res, next) => {
  if (err instanceof ValidateError) {
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields
    })
  }
  if (err instanceof Error) {
    logError(err)
    return res.status(500).json({
      message: 'Internal Server Error'
    })
  }
  return next()
})
server.listen(process.env.PORT || 8081, () => {
  const address = server.address()
  console.log(`Listening on ${address.port}`)
  if (process.env.DEMO_TOWN_ID) {
    TownsStore.getInstance().createTown(process.env.DEMO_TOWN_ID, false)
  }
})
// # sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL1NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLE9BQU8sTUFBTSxTQUFTLENBQUM7QUFDOUIsT0FBTyxLQUFLLElBQUksTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBRXhCLE9BQU8sU0FBUyxNQUFNLG9CQUFvQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDckMsT0FBTyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzdCLE9BQU8sRUFBRSxNQUFNLElBQUksWUFBWSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ25ELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRCxPQUFPLFVBQVUsTUFBTSxrQkFBa0IsQ0FBQztBQUUxQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDekQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUduQyxNQUFNLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztBQUN0QixHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QyxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBNkMsTUFBTSxFQUFFO0lBQ3hGLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7Q0FDdEIsQ0FBQyxDQUFDO0FBR0gsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFJN0UsWUFBWSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLEVBQUU7SUFDckMsSUFBSSxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekMsQ0FBQyxDQUFDLENBQUM7QUFHSCxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBR3hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQXFCLEVBQUUsR0FBcUIsRUFBRSxFQUFFO0lBQ3ZGLE1BQU0sV0FBVyxHQUFHLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxrQ0FBa0MsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRixPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuRSxDQUFDLENBQUMsQ0FBQztBQUdILGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUdwQixHQUFHLENBQUMsR0FBRyxDQUNMLENBQ0UsR0FBWSxFQUNaLElBQXFCLEVBQ3JCLEdBQXFCLEVBQ3JCLElBQTBCLEVBQ0QsRUFBRTtJQUMzQixJQUFJLEdBQUcsWUFBWSxhQUFhLEVBQUU7UUFDaEMsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixPQUFPLEVBQUUsbUJBQW1CO1lBQzVCLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTTtTQUNyQixDQUFDLENBQUM7S0FDSjtJQUNELElBQUksR0FBRyxZQUFZLEtBQUssRUFBRTtRQUN4QixRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDZCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRSx1QkFBdUI7U0FDakMsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxPQUFPLElBQUksRUFBRSxDQUFDO0FBQ2hCLENBQUMsQ0FDRixDQUFDO0FBR0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQzNDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQWlCLENBQUM7SUFFaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDNUMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRTtRQUM1QixVQUFVLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3RFO0FBQ0gsQ0FBQyxDQUFDLENBQUMifQ==
