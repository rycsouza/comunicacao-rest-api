import ComunicacaoConfig from '#models/comunicacao_template'
import MailService from '#services/mail_service'

import type { HttpContext } from '@adonisjs/core/http'

export default class MailController {
  async sendMail({ request, response }: HttpContext) {
    try {
      const { email, templateTag, sender, htmlParams } = request.all()

      const comunicacaoTemplate = await ComunicacaoConfig.findBy({ tag: templateTag })

      if (!comunicacaoTemplate) {
        throw new Error('Template não encontrado!', {
          cause: 'O valor do parâmetro templateTag não existe no Banco de Dados!',
        })
      }

      await MailService.send({
        sender,
        receiver: email,
        subject: comunicacaoTemplate.descricao,
        htmlTemplate: comunicacaoTemplate.template,
        params: htmlParams,
      })

      return response.status(200).send(true)
    } catch (error) {
      const { message, cause } = error
      return response.status(400).send({ message, cause })
    }
  }
}
