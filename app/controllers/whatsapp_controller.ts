import ComunicacaoConfig from '#models/comunicacao_template'
import WhatsappService from '#services/whatsapp_service'

import type { HttpContext } from '@adonisjs/core/http'

export default class WhatsappController {
  async sendTextMessage({ request, response }: HttpContext) {
    try {
      const { params, templateTag } = request.all()

      if (!params || !params?.telefone) {
        throw new Error('O Parâmetro TELEFONE é obrigatório!', {
          cause: 'O valor do parâmetro é vazio!',
        })
      }

      const comunicacaoTemplate = await ComunicacaoConfig.findBy({ tag: templateTag })

      if (!comunicacaoTemplate) {
        throw new Error('Template não encontrado!', {
          cause: 'O valor do parâmetro templateTag não existe no Banco de Dados!',
        })
      }

      const sended = await WhatsappService.sendTextMessage({
        params,
        mensagem: comunicacaoTemplate.mensagem,
      })

      if (!sended) {
        throw new Error(
          'Não foi possível enviar a mensagem! Ocorreu um erro interno, entre em contato com o suporte.',
          {
            cause: 'Causa desconhecida!',
          }
        )
      }

      return response.status(200).send(true)
    } catch (error) {
      const { message, cause } = error
      return response.status(400).send({ message, cause })
    }
  }

  async sendMediaMessage({ request, response }: HttpContext) {
    try {
      const { params, templateTag } = request.all()

      if (!params || !params?.telefone) {
        throw new Error('O Parâmetro TELEFONE é obrigatório!', {
          cause: 'O valor do parâmetro é vazio!',
        })
      }

      if (!templateTag) {
        throw new Error('O Parâmetro templateTag é obrigatório!', {
          cause: 'O valor do parâmetro é vazio!',
        })
      }

      const comunicacaoTemplate = await ComunicacaoConfig.findBy({ tag: templateTag })

      if (!comunicacaoTemplate) {
        throw new Error('Template não encontrado!', {
          cause: 'O valor do parâmetro templateTag não existe no Banco de Dados!',
        })
      }

      const sended = await WhatsappService.sendMediaMessageGenerateBasedHTMLTemplate({
        params,
        mensagem: comunicacaoTemplate.mensagem,
        templateTag,
      })

      if (!sended) {
        throw new Error(
          'Não foi possível enviar a mensagem! Ocorreu um erro interno, entre em contato com o suporte.',
          {
            cause: 'Causa desconhecida!',
          }
        )
      }

      return response.status(200).send(true)
    } catch (error) {
      const { message, cause } = error
      return response.status(400).send({ message, cause })
    }
  }

  async sendGroupMessage({ request, response }: HttpContext) {
    try {
      const params = request.body()
      const { comunicacaoTag } = params

      if (!params?.groupName) {
        throw new Error('O Parâmetro groupName é obrigatório!', {
          cause: 'O valor do parâmetro é vazio!',
        })
      }

      if (!comunicacaoTag) {
        throw new Error('O Parâmetro comunicacaoTag é obrigatório!', {
          cause: 'O valor do parâmetro é vazio!',
        })
      }

      const comunicacaoTemplate = await ComunicacaoConfig.findBy({ tag: comunicacaoTag })

      if (!comunicacaoTemplate) {
        throw new Error('Template não encontrado!', {
          cause: 'O valor do parâmetro comunicacaoTag não existe no Banco de Dados!',
        })
      }

      const sended = await WhatsappService.sendGroupMessage({
        params,
        mensagem: comunicacaoTemplate.mensagem,
      })

      if (!sended) {
        throw new Error(
          'Não foi possível enviar a mensagem! Ocorreu um erro interno, entre em contato com o suporte.',
          {
            cause: 'Causa desconhecida!',
          }
        )
      }

      return response.status(200).send(sended)
    } catch (error) {
      const { message, cause } = error
      return response.status(400).send({ message, cause })
    }
  }

  async addParticipants({ request, response }: HttpContext) {
    try {
      const { nomeGrupo, telefones } = request.all()
      await WhatsappService.addParticipants({ nomeGrupo, telefones })
    } catch (error) {
      const { message, cause } = error
      return response.status(400).send({ message, cause })
    }
  }
}
