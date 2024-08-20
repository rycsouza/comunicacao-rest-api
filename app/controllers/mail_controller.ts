import ComunicacaoTemplate from '#models/comunicacao_template'
import MailService from '#services/mail_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class MailController {
  async sendMail({ request, response }: HttpContext) {
    try {
      const { email, templateTag, sender, htmlParams } = request.all()

      const comunicacaoTemplate = await ComunicacaoTemplate.findBy({ tag: templateTag })

      if (!comunicacaoTemplate) {
        throw new Error('Template não encontrado!', {
          cause: 'O valor do parâmetro templateTag não existe no Banco de Dados!',
        })
      }

      const subject = comunicacaoTemplate.tag
        .replace('-', ' ')
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      await MailService.send({
        sender,
        receiver: email,
        subject,
        htmlTemplate: comunicacaoTemplate.template,
        params: htmlParams,
      })

      return response.status(200).send(true)
    } catch (error) {
      const { message, cause } = error
      return response.status(404).send({ message, cause })
    }
  }
}
