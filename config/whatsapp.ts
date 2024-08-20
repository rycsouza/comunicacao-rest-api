import env from '#start/env'
import qrcode from 'qrcode-terminal'
import WWebJS from 'whatsapp-web.js'

const { Client, LocalAuth, MessageMedia } = WWebJS

const puppeteer =
  env.get('NODE_ENV') === 'production'
    ? {
        executablePath: env.get('BROWSER_PATH'),
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }
    : {}

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: puppeteer,
})

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
  console.log('WhatsApp Conectado!')
})

client.initialize()

export { client, MessageMedia }
