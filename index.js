const SplineUtils = {
  modDiff: (n1, n2, mod) => {
    return Math.min(Math.abs(n1 - n2), Math.abs(mod - n1 + n2), Math.abs(mod - n2 + n1))
  },

  fastSpline: (points) => {
    const amount = points.length
    return (t) => {
      const tScaled = (t * amount) % amount
      console.log(tScaled)
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

function toggleOverflowMenuVisible() {
  document.querySelector('.overflow-nav').classList.toggle('overflow-nav_active')
}

const menuButton = document.getElementById('menuButton')
const closeMenuButton = document.getElementById('closeMenuButton')
const collapsePanelList = document.querySelectorAll('.collapse-panel')

const features = document.getElementById('features')

const lineChart = document.getElementById('chart')
const stage = document.getElementById('stage')
const kanban = document.getElementById('kanban')

const spline = SplineUtils.fastSpline([
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 0 }
])

menuButton.addEventListener('click', toggleOverflowMenuVisible)
closeMenuButton.addEventListener('click', toggleOverflowMenuVisible)
collapsePanelList.forEach((element) =>
  element.addEventListener('click', function () {
    this.classList.toggle('collapse-panel_active')
  })
)

document.addEventListener('scroll', () => {
  const offsetTop = window.scrollY - features.offsetTop
  const featuresHeight = features.offsetHeight

  const state = spline(offsetTop / featuresHeight)
  const state1 = spline((offsetTop / featuresHeight) * 3)
  const state2 = spline((offsetTop / featuresHeight) * 6)

  lineChart.style.top = `${+state.y * 80}%`
  lineChart.style.left = `${+state.x * 80}%`

  stage.style.top = `${10 + state1.y * 80}%`
  stage.style.left = `${10 + state1.x * 80}%`

  kanban.style.top = `${10 + state2.y * 80}%`
  kanban.style.left = `${10 + state2.x * 80}%`
})
