import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ComunicacaoTemplate extends BaseModel {
  static table = 'comunicacao_template'

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
