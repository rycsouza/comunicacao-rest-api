import { client, MessageMedia } from '#config/whatsapp'
import { GenerateImage } from '../helpers/index.js'
import fs from 'node:fs'

interface WhatsappTextMessageInterface {
  params: { [key: string]: string }
  mensagem: string
}

interface WhatsappMediaMessageInterface {
  params: { [key: string]: string }
  mensagem: string | undefined
  templateTag: string
}

export default class WhatsappService {
  static async sendTextMessage({ params, mensagem }: WhatsappTextMessageInterface) {
    try {
      const telefone = this.formatPhoneNumber({ telefone: params!.telefone })
      await client.sendMessage(telefone, mensagem)

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  static async sendMediaMessageGenerateBasedHTMLTemplate({
    params,
    mensagem = '',
    templateTag,
  }: WhatsappMediaMessageInterface) {
    try {
      const telefone = this.formatPhoneNumber({ telefone: params?.telefone })

      const imageGenerated = await GenerateImage({
        params,
        templateTag,
      })

      if (!imageGenerated) throw new Error('Não foi possível gerar a imagem para envio!')

      const midia = MessageMedia.fromFilePath(imageGenerated.pathMediaFile)
      await client.sendMessage(telefone, mensagem, { media: midia })

      if (fs.existsSync(imageGenerated.pathMediaFile)) fs.unlinkSync(imageGenerated.pathMediaFile) //apagando imagem do projeto, após envio!

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  static formatPhoneNumber({ telefone }: { telefone: string }) {
    return telefone && telefone[0] === '5' && telefone[1] === '5'
      ? `${telefone}@c.us`
      : `55${telefone}@c.us`
  }
}
