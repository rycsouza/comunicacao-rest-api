/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const MailController = () => import('#controllers/mail_controller')
const WhatsappController = () => import('#controllers/whatsapp_controller')
import router from '@adonisjs/core/services/router'

router.post('/mail', [MailController, 'sendMail'])

router
  .group(() => {
    router.post('/text', [WhatsappController, 'sendTextMessage'])
    router.post('/media', [WhatsappController, 'sendMediaMessage'])
    router
      .group(() => {
        router.post('/', [WhatsappController, 'addParticipants'])
      })
      .prefix('participants')
  })
  .prefix('whatsapp')
