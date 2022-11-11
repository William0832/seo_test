import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import colors from 'colors'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = path.join(__dirname, 'public')

dotenv.config()

const app = express()

const port = process.env.PORT || 3000

// middleware 
const checkUserAgent = (req, res, next) => {
  const userAgent = req.headers['user-agent']
  if (userAgent.includes('facebook')) {
    const title = 'SEO-PAGE',
      url = req.path
    return res.render('seo', { title, url, userAgent })
  }

  next()
}
const log = (req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.path}`)
  next()
}
app.set('view engine', 'pug')
app.use(express.json())
app.use(log)
app.use(
  (req, res, next) => {
    const name = req.path.split('/')[1]
    const isFile = ['html', 'js', 'css', 'jpg', 'png', 'svg', 'ico', 'text']
      .includes(req.path.split('.')[1])
    if (isFile) {
      res.sendFile(name, { root })
      return
    }
    next()
  },
  checkUserAgent,
  (req, res) => { res.sendFile('index.html', { root }) }
)
app.use((err, req, res, next) => {
  console.error(err.stack.red)
  res.sendStatus(500)
})

app.listen(port, () => console.log(`App listen on http://localhost:${port}\n`))