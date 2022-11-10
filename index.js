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
  // console.log(window.scrollY / convenientWorkflow.parentElement.offsetTop)
  // console.log(convenientWorkflow.parentElement.offsetTop / window.scrollY)
  // offsetTopPercent = window.scrollY / document.querySelector('body').scrollHeight

  const containerOffset = convenientWorkflow.parentElement.offsetTop - window.innerHeight / 2

  offsetTopPercent = Math.min(1 - containerOffset / window.scrollY, 0)
  console.log(offsetTopPercent)
})

function toggleOverflowMenuVisible() {
  document.querySelector('.overflow-nav').classList.toggle('overflow-nav_active')
}

function animate() {
  renderOffsetTopPercent = renderOffsetTopPercent * 0.9 + offsetTopPercent * 0.1
  Array.from(convenientWorkflow.children).forEach((item) => {
    const state =
      item.dataset.traectory === 'square'
        ? spline((renderOffsetTopPercent + Number(item.dataset.offset)) * item.dataset.moveSpeed)
        : spline1((renderOffsetTopPercent + Number(item.dataset.offset)) * item.dataset.moveSpeed)
    item.style.transform = `
      translate(${state.x * convenientWorkflow.clientWidth}px, ${state.y * convenientWorkflow.clientHeight}px)
      rotate(${renderOffsetTopPercent * item.dataset.rotateSpeed * 360}deg)
     `
  })
  requestAnimationFrame(animate)
}

animate()
