import mail from '@adonisjs/mail/services/main'
import { HTMLFormater } from '../helpers/index.js'

interface MailType {
  sender: { email: string; name: string }
  receiver: string
  subject: string
  htmlTemplate: string
  params: object
}

export default class MailService {
  static async send({ sender, receiver, subject, htmlTemplate, params = {} }: MailType) {
    try {
      htmlTemplate = HTMLFormater({ htmlTemplate, params })

      await mail.send((message) => {
        message.to(receiver).from(sender.email, sender.name).subject(subject).html(htmlTemplate)
      })

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
