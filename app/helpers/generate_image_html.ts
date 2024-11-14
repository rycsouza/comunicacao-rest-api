import { HTMLFormater } from './index.js'
import ComunicacaoConfig from '#models/comunicacao_template'
import env from '#start/env'
import fs from 'node:fs'
import puppeteer from 'puppeteer'

interface GenerateImageInterface {
  params: { [key: string]: string }
  templateTag?: string
}

const puppeteerConfig =
  env.get('NODE_ENV') === 'production'
    ? {
        executablePath: env.get('BROWSER_PATH'),
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }
    : {}

export default async ({ params, templateTag }: GenerateImageInterface) => {
  try {
    const comunicacaoTemplate = await ComunicacaoConfig.findBy({ tag: templateTag })

    if (!comunicacaoTemplate) {
      throw new Error('Template não encontrado!', {
        cause: 'O valor do parâmetro templateTag não existe no Banco de Dados!',
      })
    }
    const templateHTML = comunicacaoTemplate?.template
    const elementoHTML = comunicacaoTemplate.elemento

    const html = HTMLFormater({ htmlTemplate: templateHTML, params })
    const browser = await puppeteer.launch(puppeteerConfig)
    const page = await browser.newPage()

    await page.setContent(html)

    await page.waitForSelector(elementoHTML)

    const element = await page.$(elementoHTML)
    const boundingBox = await element?.boundingBox()

    const caminhoPasta = `./app/tmp_images/${templateTag}`
    const caminhoImagem = `${caminhoPasta}/${params!.id}.png`

    if (boundingBox) {
      if (!fs.existsSync(caminhoPasta)) {
        fs.mkdirSync(caminhoPasta, { recursive: true })
      }

      await page.screenshot({
        path: caminhoImagem,
        clip: {
          x: boundingBox.x,
          y: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      })
    }

    await browser.close()

    return { pathMediaFile: caminhoImagem }
  } catch (error) {
    console.log(error)
    return false
  }
}
