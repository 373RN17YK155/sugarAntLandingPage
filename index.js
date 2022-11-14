const SplineUtils = {
  modDiff: (n1, n2, mod) => {
    return Math.min(Math.abs(n1 - n2), Math.abs(mod - n1 + n2), Math.abs(mod - n2 + n1))
  },

  fastSpline: (points) => {
    const amount = points.length
    return (t) => {
      const tScaled = (t * amount) % amount
      return points.reduce(
        (acc, cur, i) => {
          const d = SplineUtils.modDiff(tScaled, i, amount)
          if (d < 2) {
            const weight = d > 1 ? (2 - d) * 0.1 : 0.1 + (1 - d) * 0.7
            acc.x += cur.x * weight
            acc.y += cur.y * weight
          }
          return acc
        },
        { x: 0, y: 0 }
      )
    }
  }
}

const main = document.getElementById('main')
const overlayMenu = document.getElementById('overlayMenu')
const menuButton = document.getElementById('menuButton')
const closeMenuButton = document.getElementById('closeMenuButton')
const collapsePanelList = document.querySelectorAll('.collapse-panel')

const convenientWorkflow = document.getElementById('convenientWorkflow')

var offsetTopPercent = 0
var renderOffsetTopPercent = 0

const spline = SplineUtils.fastSpline([
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 0 }
])
const spline1 = SplineUtils.fastSpline([
  { x: 0.5, y: 0 },
  { x: 0, y: 0.5 },
  { x: 0.5, y: 1 },
  { x: 1, y: 0.5 }
])

menuButton.addEventListener('click', toggleOverflowMenuVisible)
closeMenuButton.addEventListener('click', toggleOverflowMenuVisible)
collapsePanelList.forEach((element) =>
  element.addEventListener('click', function () {
    this.classList.toggle('collapse-panel_active')
  })
)

document.addEventListener('scroll', () => {
  const animStart = convenientWorkflow.parentElement.offsetTop - window.innerHeight
  const animEnd = convenientWorkflow.parentElement.offsetTop - window.innerHeight / 2
  offsetTopPercent = Math.max(Math.min((animEnd - window.scrollY) / (animEnd - animStart), 1), 0)
})

function toggleOverflowMenuVisible() {
  overlayMenu.classList.toggle('overflow-nav_active')
  main.classList.toggle('main__overlay')
}

function animate() {
  renderOffsetTopPercent = renderOffsetTopPercent * 0.9 + offsetTopPercent * 0.1
  Array.from(convenientWorkflow.children).forEach((item) => {
    const state =
      item.dataset.traectory === 'square'
        ? spline((renderOffsetTopPercent + Number(item.dataset.traectoryOffset)) * item.dataset.moveSpeed)
        : spline1((renderOffsetTopPercent + Number(item.dataset.traectoryOffset)) * item.dataset.moveSpeed)
    item.style.transform = `
      translate(
        ${state.x * convenientWorkflow.clientWidth + convenientWorkflow.clientWidth * Number(item.dataset.offsetX)}px, 
        ${state.y * convenientWorkflow.clientHeight + convenientWorkflow.clientWidth * Number(item.dataset.offsetY)}px
      )
      rotate(${item.dataset.rotateSpeed * renderOffsetTopPercent * 360}deg)
      `
    item.style.zIndex = item.dataset.zIndex
  })
  requestAnimationFrame(animate)
}

animate()
