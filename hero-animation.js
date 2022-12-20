/** @type {HTMLCanvasElement} */

class ImageFlipper {
  static coef = 1.3
  showFirstImage = false
  invertImage = false
  onPause = true
  pause = 23
  currentPause = 0

  constructor() {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.baseCanvas = document.createElement('canvas')
    this.baseCtx = this.baseCanvas.getContext('2d')
  }

  getBaseImage(img) {
    const w = (this.baseCanvas.width = img.naturalWidth * ratio * ImageFlipper.coef)
    const h = (this.baseCanvas.height = img.naturalHeight * ratio * ImageFlipper.coef)
    this.baseCtx.clearRect(0, 0, w, h)
    this.baseCtx.drawImage(img, 0, 0, w, h)
    return this.baseCanvas
  }

  getFlipImage(img1, img2, flipRadians) {
    if (this.onPause) {
      if (flipRadians - this.currentPause > this.pause) {
        this.currentPause = flipRadians
        this.onPause = false
        this.invertImage = !this.invertImage
      }
      return this.showFirstImage ? img1 : img2
    }
    flipRadians -= this.currentPause

    const sign = Math.sign(Math.cos(flipRadians))

    if (flipRadians >= Math.PI) {
      this.onPause = true
    }

    const flipPower = 0.2 * Math.sin(flipRadians) * sign
    let yScale = Math.abs(Math.cos(flipRadians))

    this.showFirstImage = sign > 0
    if (this.invertImage) {
      this.showFirstImage = !this.showFirstImage
    }

    const img = this.getBaseImage(this.showFirstImage ? img1 : img2)

    const w = img.width
    const h = img.height
    const targetWidth = (this.canvas.width = w * (1 + Math.abs(flipPower)))
    const realHeight = h * yScale
    const targetHeight = (this.canvas.height = realHeight < 2 ? 2 : realHeight)
    this.ctx.clearRect(0, 0, targetWidth, targetHeight)

    for (let y = 0; y < targetHeight; y++) {
      const pY = y / targetHeight
      const sourceY = pY * h
      const scaleX = (1 - pY) * (1 + flipPower) + pY * (1 - flipPower)
      this.ctx.drawImage(img, 0, sourceY, w, 1, (targetWidth - w * scaleX) * 0.5, y, w * scaleX, 1)
    }

    return this.canvas
  }
}
const imageFlipper = new ImageFlipper()

const cnv = document.getElementById('heroAnimation')
const ctx = cnv.getContext('2d')

let ratio = (window.devicePixelRatio || 1) * 2
let heroWidth = 1160
let heroOffset = 0
const MIN_SCALE = 0.7
const MAX_SCALE = 1.3

const heroImages = [
  {
    offset: -0.1,
    url: './assets/images/hero/cube.svg',
    rotation: -2,
    transform: {
      offsetY: () => -60,
      offsetX: () => -60,
      scale: () => 1.7
    }
  },
  { offset: 0.25, url: './assets/images/hero/state-map/map.svg' },
  {
    offset: 0.25,
    url: './assets/images/hero/state-map/comment.svg',
    transform: {
      opacity: (t) => linear(2.6, 2.7, 0, 1, t),
      offsetY: (t) => -100 + linear(2.6, 2.7, 20, 0, t),
      offsetX: () => -100,
      scale: (t) => linear(2.6, 2.7, 0.4, 1, t)
    },
    text: [
      {
        color: '#173773',
        fontSize: 10,
        x: 60,
        y: -2,
        getText: (t) => linear(2.8, 4.6, 48000, 50103, t).toFixed(0)
      },
      {
        color: '#173773',
        fontSize: 10,
        x: 60,
        y: 10,
        getText: (t) => linear(2.8, 4.9, 8721, 9889, t).toFixed(0)
      }
    ]
  },
  {
    offset: 0.25,
    url: './assets/images/hero/state-map/us-ut.svg',
    transform: {
      offsetY: () => -30,
      offsetX: () => -90,
      scale: (t) => linear(2.3, 2.5, 1, 1.15, t)
    }
  },
  {
    offset: 0.25,
    url: './assets/images/hero/state-map/cursor.svg',
    transform: {
      offsetY: (t) => -30 + linear(2, 2.2, 60, 0, t),
      offsetX: (t) => -90 + linear(2, 2.2, -90, 0, t)
    }
  },
  {
    offset: 0.25,
    url: './assets/images/hero/state-map/line-chart.svg',
    transform: {
      opacity: (t) => linear(2.6, 2.7, 0, 1, t),
      offsetY: () => 70,
      offsetX: () => 150
    },
    text: [
      {
        color: '#3677EF',
        fontSize: 12,
        x: -40,
        y: 40,
        getText: (t) => linear(2, 5, 593, 950, t).toFixed(0)
      },
      {
        color: '#C2D9FE',
        fontSize: 12,
        x: -5,
        y: 40,
        getText: (t) => linear(2, 5, 350, 634, t).toFixed(0)
      },
      {
        color: '#3CA4B0',
        fontSize: 12,
        x: 30,
        y: 40,
        getText: (t) => linear(2, 5, 110, 325, t).toFixed(0)
      }
    ]
  },
  {
    offset: 0.25,
    url: './assets/images/hero/state-map/line-bars.svg',
    transform: {
      opacity: (t) => linear(2.6, 2.7, 0, 1, t),
      offsetY: () => 58.5,
      offsetX: () => 148,
      scaleBottom: (t) => linear(2.7, 5, 0, 1, t)
    }
  },
  {
    offset: 0.6,
    url: './assets/images/hero/square.svg',
    rotation: -1.5,
    transform: {
      offsetX: () => -200
    }
  },
  {
    offset: 0.5,
    url: './assets/images/hero/cube.svg',
    rotation: -1.2,
    transform: {
      offsetY: () => 80,
      scale: () => 0.7
    }
  },
  {
    offset: 0.6,
    url: './assets/images/hero/notification/card.svg',
    transform: {
      offsetX: () => -100,
      offsetY: () => -50
    }
  },
  {
    offset: 0.6,
    url: './assets/images/hero/notification/switch-background.svg',
    transform: {
      offsetX: () => -50,
      offsetY: () => -95
    },
    draw: {
      circle: (t) => [24 + 24 * Math.max(Math.min(Math.cos(t) * 1.5, 1), 0), 24, 10, 0, 2 * Math.PI],
      line: (t) => 0
    }
  },
  {
    offset: 0.7,
    url: './assets/images/hero/deal-card/placeholder.svg',
    transform: {
      offsetX: () => -50,
      offsetY: () => 100
    }
  },
  {
    offset: 0.7,
    url: './assets/images/hero/deal-card/circle.svg',
    rotation: 1.3,
    transform: {
      offsetX: () => 90,
      offsetY: () => 50
    }
  },
  {
    offset: 0.7,
    flip: 10,
    url: './assets/images/hero/deal-card/card.svg',
    url2: './assets/images/hero/deal-card/card-flipped.svg',
    transform: {
      offsetX: () => -40,
      offsetY: () => 90
    }
  },
  {
    offset: 0.9,
    url: './assets/images/hero/square.svg',
    rotation: -1.5,
    transform: {
      offsetY: () => -100,
      offsetX: () => -60
    }
  },
  { offset: 0.9, url: './assets/images/hero/num-of-deals/card.svg' },
  {
    offset: 0.9,
    url: './assets/images/hero/num-of-deals/doughnut.svg',
    rotation: 1,
    text: [
      {
        color: '#525252',
        fontSize: 20,
        x: 0,
        y: 0,
        getText: (t) => linear(2.3, 7, 3000, 3203, t).toFixed(0)
      }
    ],
    transform: {
      opacity: (t) => linear(2.2, 2.3, 0, 1, t)
    }
  },
  {
    offset: 0.9,
    url: './assets/images/hero/num-of-deals/legend.svg',
    transform: {
      opacity: (t) => linear(2, 2.2, 0, 1, t),
      offsetY: () => 90,
      offsetX: (t) => linear(2, 2.2, 0, -40, t)
    }
  },
  {
    offset: 1,
    url: './assets/images/hero/cube.svg',
    rotation: -1.2,
    transform: {
      offsetY: () => -60,
      offsetX: () => 80,
      scale: () => 0.6
    }
  }
]

const getPos = (t) => {
  const tO = scale(t, 1.2)
  return {
    x: t > 0 && t < 1 ? Math.sin(t * Math.PI - Math.PI / 2) / 2 + 0.5 : t < 0 ? t / 10 : 1 + (t - 1) / 10,
    y: t > 0 && t < 1 ? 0.5 + Math.sin(t * Math.PI) * 0.2 : 0.5 + cabs(t) / 9,
    opacity: tO > 1.5 || tO < -0.5 ? 0 : tO > 0 && tO < 1 ? 1 : 1 + cabs(tO) * 2,
    scale: t > 0 && t < 1 ? MIN_SCALE + Math.sin(t * Math.PI) * (MAX_SCALE - MIN_SCALE) : MIN_SCALE / (1 - cabs(t) * 4)
  }
}

const linear = (startT, endT, minV, maxV, t) => {
  return t < startT ? minV : t > endT ? maxV : minV + ((t - startT) / (endT - startT)) * (maxV - minV)
}

const cabs = (t) => (t < 0 ? t : t > 1 ? 1 - t : t)
const scale = (t, a) => (t - 0.5) * a + 0.5

async function loadImages(heros) {
  return await Promise.all(
    heros.map(async (h) => {
      h.img = await loadImage(h.url)
      if (h.url2) h.img2 = await loadImage(h.url2)
    })
  )
}

function loadImage(url) {
  return new Promise((resolve) => {
    const img = document.createElement('img')
    img.onload = () => {
      resolve(img)
    }
    img.src = url
  })
}

function drawImage(img, x, y, scale = 1, rotation = 0, opacity = 1, scaleBottom = 1) {
  const w = img.naturalWidth * ratio || img.width / ImageFlipper.coef
  const h = img.naturalHeight * ratio || img.height / ImageFlipper.coef
  ctx.setTransform(scale, 0, 0, scale, x, y)
  ctx.globalAlpha = opacity
  ctx.rotate(rotation)
  ctx.drawImage(img, -w / 2, -h / 2 + h * (1 - scaleBottom), w, h * scaleBottom)
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.globalAlpha = 1
}

function drawText(text, x, y, size, opacity = 1, color = '#525252') {
  const length = text.length * size * 0.57
  ctx.globalAlpha = opacity
  ctx.font = `600 ${size}px Montserrat`
  ctx.fillStyle = color
  ctx.fillText(text, x - length / 2, y + size * 0.46)
  ctx.globalAlpha = 1
}

let automaticAnimationEnded = false
let timer = 0

function draw() {
  timer += 0.012
  ctx.clearRect(0, 0, cnv.width, cnv.height)
  if (!automaticAnimationEnded && offsetTopPercent < 0) {
    offsetTopPercent = offsetTopPercent * 0.995 + 0.01
    if (offsetTopPercent >= 0) {
      automaticAnimationEnded = true
    }
  }
  renderOffsetTopPercent = renderOffsetTopPercent * 0.95 + offsetTopPercent * 0.05
  let coef = 0
  heroImages.forEach((hero) => (hero.pos = getPos(renderOffsetTopPercent + hero.offset)))
  heroImages.sort((h1, h2) => h1.pos.scale - h2.pos.scale)
  heroImages.forEach((hero) => {
    let { x, y, scale, opacity } = hero.pos
    const t = renderOffsetTopPercent + hero.offset
    let offsetX = 0
    let offsetY = 1
    let scaleBottom = 1
    coef = ratio * scale

    if (hero.transform) {
      offsetX = hero.transform.offsetX ? hero.transform.offsetX(hero.hasTransform ? t : timer) * coef : 0
      offsetY = hero.transform?.offsetY ? hero.transform?.offsetY(hero.hasTransform ? t : timer) * coef : 0
      scaleBottom = hero.transform?.scaleBottom ? hero.transform?.scaleBottom(timer) : 1
      opacity *= hero.transform?.opacity ? hero.transform?.opacity(hero.hasTransform ? t : timer) : 1
      scale *= hero.transform?.scale ? hero.transform?.scale(timer) : 1
    }

    const img = hero.flip ? imageFlipper.getFlipImage(hero.img, hero.img2, timer * hero.flip) : hero.img

    drawImage(
      img,
      heroOffset + x * heroWidth + offsetX,
      y * cnv.height + offsetY,
      scale,
      (hero.rotation || 0) * timer,
      opacity,
      scaleBottom
    )

    if (hero.text?.length)
      hero.text.forEach((textObj) =>
        drawText(
          textObj.getText(timer),
          heroOffset + x * heroWidth + textObj.x * coef + offsetX,
          y * cnv.height + textObj.y * coef + offsetY,
          textObj.fontSize * coef,
          opacity,
          textObj.color
        )
      )

    if (hero.draw) {
      const drawCoef = Math.min(Math.max(Math.cos(timer) * 5, -1), 1)
      if (hero.draw?.line) {
        ctx.beginPath()
        console.log(coef)
        ctx.moveTo(heroOffset + x * heroWidth + offsetX - 13 * coef, y * cnv.height + offsetY)
        ctx.lineTo(heroOffset + x * heroWidth + offsetX + 13 * coef, y * cnv.height + offsetY)
        ctx.lineWidth = 12 * coef
        ctx.strokeStyle = drawCoef > 0 ? '#9CBFFF' : '#D1D1D1'
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      if (hero.draw?.circle) {
        ctx.beginPath()
        ctx.arc(heroOffset + x * heroWidth + offsetX + 13 * coef * drawCoef, y * cnv.height + offsetY, 10 * coef, 0, 2 * Math.PI)
        ctx.fillStyle = drawCoef > 0 ? '#397FFF' : '#999999'
        ctx.fill()
      }
    }
  })
  requestAnimationFrame(draw)
}

function resizeCanvas() {
  ratio = window.devicePixelRatio || 1
  const h = window.innerHeight
  const w = window.innerWidth
  cnv.height = h * ratio
  cnv.width = w * ratio
  cnv.style.cssText = `width:${w}px;height:${h}px`
  heroWidth = Math.min(innerWidth - 64, 1160) * ratio
  heroOffset = (cnv.width - heroWidth) / 2
}

resizeCanvas()

loadImages(heroImages).then(draw)
