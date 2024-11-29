import mail from '@adonisjs/mail/services/main'

interface MailType {
  receiver: string
  subject: string
  htmlTemplate: string
  params: {
    [key: string]: string
  }
}

export default class MailService {
  static async send({ receiver, subject, htmlTemplate, params }: MailType) {
    try {
      //@ts-ignore
      Object.keys(params)?.forEach((key) => {
        if (htmlTemplate.includes(`{{${key}}}`))
          htmlTemplate = htmlTemplate.replace(`{{${key}}}`, params[key])
      })

      await mail.send((message) => {
        message.to(receiver).subject(subject).html(htmlTemplate)
      })

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
