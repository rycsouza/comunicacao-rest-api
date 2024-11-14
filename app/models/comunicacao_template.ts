import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ComunicacaoConfig extends BaseModel {
  static table = 'comunicacao_config'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare tag: string

  @column()
  declare descricao: string

  @column()
  declare template: string

  @column()
  declare elemento: string

  @column()
  declare mensagem: string
}
