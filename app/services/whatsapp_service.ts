import { GenerateImage } from '../helpers/index.js'
import { client, MessageMedia } from '#config/whatsapp'
import fs from 'node:fs'
import { GroupChat } from 'whatsapp-web.js'
import { Sleep } from '../helpers/index.js'
import env from '#start/env'

const TIME_TO_SLEEP = env.get('TIME_TO_SLEEP') ? Number.parseInt(env.get('TIME_TO_SLEEP')!) : 10000

interface WhatsappTextMessageInterface {
  params: { [key: string]: string }
  mensagem: string
}

interface WhatsappMediaMessageInterface {
  params: { [key: string]: string }
  mensagem: string | undefined
  templateTag: string
}

interface WhatsappAddParticipants {
  nomeGrupo: string
  telefones: string[]
}

export default class WhatsappService {
  static async sendTextMessage({ params, mensagem }: WhatsappTextMessageInterface) {
    try {
      const telefones = this.formatPhoneNumber({ telefone: params!.telefone })
      await Promise.all(
        telefones.map(async (telefone: string) => {
          await client.sendMessage(telefone, mensagem)
          await Sleep(TIME_TO_SLEEP)
        })
      )

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
      const imageGenerated = await GenerateImage({
        params,
        templateTag,
      })

      if (!imageGenerated) throw new Error('Não foi possível gerar a imagem para envio!')

      const midia = MessageMedia.fromFilePath(imageGenerated.pathMediaFile)

      const telefones = this.formatPhoneNumber({ telefone: params?.telefone })
      await Promise.all(
        telefones.map(async (telefone: string) => {
          await client.sendMessage(telefone, mensagem, { media: midia })
          await Sleep(TIME_TO_SLEEP)
        })
      )

      if (fs.existsSync(imageGenerated.pathMediaFile)) fs.unlinkSync(imageGenerated.pathMediaFile) //apagando imagem do projeto, após envio!

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }

  static async addParticipants({ nomeGrupo, telefones }: WhatsappAddParticipants) {
    const chats = await client.getChats()
    const group = chats.find((chat) => chat.isGroup && chat.name === nomeGrupo) as GroupChat

    if (!group) throw new Error('Grupo não encontrado')

    const telefonesFormatados: string[] = []
    telefones.forEach((telefone) => {
      if (!telefone) return
      const array = this.formatPhoneNumber({ telefone })

      array.forEach((item: string) => telefonesFormatados.push(item))
    })

    await group.addParticipants(telefonesFormatados, { sleep: TIME_TO_SLEEP / 2 })
  }

  static formatPhoneNumber({ telefone }: { telefone: string }) {
    try {
      if (!telefone) throw new Error('É necessário o telefone para realizar a ação!')
      telefone = telefone.trim()

      telefone =
        telefone[0] === '5' && telefone[1] === '5' ? `${telefone}@c.us` : `55${telefone}@c.us`

      const telefones: string[] = []
      telefones.push(telefone)

      //17 ou 18 por causa do '@c.us'
      if (telefones[0].length === 17) {
        telefones.push(`${telefone.slice(0, 4)}9${telefone.slice(4)}`)
      } else if (telefones[0].length === 18) {
        telefones.push(`${telefone.slice(0, 4)}${telefone.slice(5)}`)
      }

      return telefones
    } catch (error) {
      throw error
    }
  }
}
