import { Router } from 'express'
import * as whatsappController from '../controllers/whatsapp.controller'

export const routes = Router()

routes.post('/send-message', whatsappController.sendMessageController)