/** @type {HTMLCanvasElement} */
const cnv = document.getElementById('heroAnimation')
const ctx = cnv.getContext('2d')

let ratio = window.devicePixelRatio || 1
let heroWidth = 1160
let heroOffset = 0
const MIN_SCALE = 0.7
const MAX_SCALE = 1.3

const heroImages = [
  { offset: -0.1, url: './assets/images/hero/cube.svg', rotation: -5 },
  { offset: 0.1, url: './assets/images/hero/state-map/map.svg' },
  {
    offset: 0.1,
    url: './assets/images/hero/state-map/comment.svg',
    autoTransform: true,
    opacity: (t) => linear(1.5, 1.7, 0, 1, t),
    offsetY: (t) => -100 + linear(1.5, 1.7, 20, 0, t),
    offsetX: () => -100,
    scale: (t) => linear(1.5, 1.7, 0.4, 1, t),
    text: [
      {
        color: '#173773',
        fontSize: 10,
        x: 60,
        y: -2,
        getText: (t) => linear(1.5, 3.9, 48000, 50103, t).toFixed(0)
      },
      {
        color: '#173773',
        fontSize: 10,
        x: 60,
        y: 10,
        getText: (t) => linear(1.5, 3.7, 8721, 9889, t).toFixed(0)
      }
    ]
  },
  {
    offset: 0.1,
    url: './assets/images/hero/state-map/us-ut.svg',
    autoTransform: true,
    opacity: () => 1,
    offsetY: () => -30,
    offsetX: () => -90,
    scale: (t) => linear(1.5, 1.7, 1, 1.15, t)
  },
  {
    offset: 0.1,
    url: './assets/images/hero/state-map/cursor.svg',
    autoTransform: true,
    opacity: () => 1,
    offsetY: (t) => -30 + linear(1.3, 1.5, 60, 0, t),
    offsetX: (t) => -90 + linear(1.3, 1.5, -90, 0, t),
    scale: () => 1
  },
  {
    offset: 0.1,
    url: './assets/images/hero/state-map/line-chart.svg',
    autoTransform: true,
    opacity: (t) => linear(1.5, 1.7, 0, 1, t),
    offsetY: () => 70,
    offsetX: () => 150,
    scale: () => 1,
    text: [
      {
        color: '#3677EF',
        fontSize: 12,
        x: -40,
        y: 40,
        getText: (t) => linear(1.5, 5, 593, 950, t).toFixed(0)
      },
      {
        color: '#C2D9FE',
        fontSize: 12,
        x: -5,
        y: 40,
        getText: (t) => linear(1.5, 5, 350, 634, t).toFixed(0)
      },
      {
        color: '#3CA4B0',
        fontSize: 12,
        x: 30,
        y: 40,
        getText: (t) => linear(1.5, 5, 110, 325, t).toFixed(0)
      }
    ]
  },
  {
    offset: 0.1,
    url: './assets/images/hero/state-map/line-bars.svg',
    autoTransform: true,
    opacity: (t) => linear(1.5, 1.7, 0, 1, t),
    offsetY: () => 58.5,
    offsetX: () => 148,
    scaleBottom: (t) => linear(1.6, 4, 0, 1, t),
    scale: () => 1
  },
  {
    offset: 0.4,
    url: './assets/images/hero/square.svg',
    rotation: -5,
    autoTransform: true,
    opacity: () => 1,
    offsetY: () => 20,
    offsetX: () => -80,
    scale: () => 1
  },
  {
    offset: 0.4,
    url: './assets/images/hero/notification.svg',
    autoTransform: true,
    opacity: () => 1,
    offsetY: () => -30,
    offsetX: () => 0,
    scale: () => 1
  },
  {
    offset: 0.6,
    url: './assets/images/hero/card.svg',
    autoTransform: true,
    opacity: () => 1,
    offsetY: () => 50,
    offsetX: () => 0,
    scale: () => 1
  },
  { offset: 0.8, url: './assets/images/hero/num-of-deals/card.svg' },
  {
    offset: 0.8,
    url: './assets/images/hero/num-of-deals/doughnut.svg',
    rotation: 5,
    text: [
      {
        color: '#525252',
        fontSize: 20,
        x: 0,
        y: 0,
        getText: (t) => linear(0, 7, 3000, 3203, t).toFixed(0)
      }
    ]
  },
  {
    offset: 0.8,
    url: './assets/images/hero/num-of-deals/legend.svg',
    hasTransform: true,
    opacity: (t) => Math.max(Math.sin(t * Math.PI), 0),
    offsetY: (t) => 110 - 10 * Math.sin(t * Math.PI),
    offsetX: (t) => -20 * Math.sin(t * Math.PI),
    scale: () => 1
  }
]

// const getPos = (t) => ({
//   x: Math.sin(t * Math.PI - Math.PI / 2) / 2 + 0.5,
//   y: Math.sin(t * Math.PI) / 1.1,
//   y: t > 0 && t < 1 ? Math.sin(t * Math.PI) : t <= 0 ? t : 1 - t
//   scale: t > 0 && t < 1 ? MIN_SCALE + Math.sin(t * Math.PI) * (MAX_SCALE - MIN_SCALE) : MIN_SCALE
// })

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
  return await Promise.all(heros.map((h) => loadImage(h.url)))
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
  const w = img.naturalWidth * ratio
  const h = img.naturalHeight * ratio
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
  let coef
  heroImages.forEach((hero) => {
    const t = renderOffsetTopPercent + hero.offset
    hero.pos = getPos(t)
  })
  heroImages.sort((h1, h2) => h1.pos.scale - h2.pos.scale)
  heroImages.forEach((hero) => {
    let { x, y, scale, opacity } = hero.pos
    const t = renderOffsetTopPercent + hero.offset
    // let { x, y, scale, opacity } = getPos(t)
    let offsetX = 0
    let offsetY = 1
    let scaleBottom = 1
    coef = ratio * scale
    if (hero.hasTransform) {
      offsetX = hero.offsetX(t) * coef
      offsetY = hero.offsetY(t) * coef
      opacity *= hero.opacity(t)
    }
    if (hero.autoTransform) {
      ;(scaleBottom = hero.scaleBottom ? hero.scaleBottom(timer) : 1), (offsetX = hero.offsetX(timer) * coef)
      offsetY = hero.offsetY(timer) * coef
      opacity *= hero.opacity(timer)
      scale *= hero.scale(timer)
    }
    drawImage(
      hero.img,
      heroOffset + x * heroWidth + offsetX,
      y * cnv.height + offsetY,
      scale,
      (hero.rotation || 0) * timer,
      opacity,
      scaleBottom
    )
    // if (hero.withText) {
    //   if (hero.displayNumber < hero.maxNumber) {
    //     hero.displayNumber = hero.displayNumber * 0.99 + hero.maxNumber * 0.01 + 0.1
    //   }
    //   drawText(hero.displayNumber.toFixed(0), heroOffset + x * heroWidth, y * cnv.height, 20 * scale * ratio, opacity)
    // }
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

loadImages(heroImages).then((images) => {
  heroImages.forEach((hero, index) => {
    hero.img = images[index]
  })
  draw()
})
