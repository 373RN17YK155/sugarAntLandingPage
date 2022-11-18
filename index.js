const main = document.getElementById('main')
const overlayMenu = document.getElementById('overlayMenu')
const menuButton = document.getElementById('menuButton')
const closeMenuButton = document.getElementById('closeMenuButton')
const collapsePanelList = document.querySelectorAll('.collapse-panel')

menuButton.addEventListener('click', toggleOverflowMenuVisible)
closeMenuButton.addEventListener('click', toggleOverflowMenuVisible)
collapsePanelList.forEach((element) =>
  element.addEventListener('click', function () {
    this.classList.toggle('collapse-panel_active')
  })
)

const convenientWorkflow = document.querySelector('#convenientWorkflow')

document.addEventListener('scroll', () => {
  const item = document.querySelector('#features')

  document.querySelectorAll('.feature-item__img-wrapper').forEach((imageWrapper, index) => {
    const animStart =
      item.offsetTop +
      imageWrapper.clientHeight * (index + 1) -
      window.innerHeight +
      index * 300 +
      index * window.innerHeight
    const animEnd = item.offsetTop + imageWrapper.clientHeight * (index + 1) + index * 300 + index * window.innerHeight

    const offsetY = Math.max(Math.min((animEnd - window.scrollY) / (animEnd - animStart), 1), -1)

    setParalax(offsetY, Array.from(imageWrapper.children))
    imageWrapper.parentElement.style.opacity = Math.min(offsetY + 1, 1)
  })
})

function toggleOverflowMenuVisible() {
  overlayMenu.classList.toggle('overflow-nav_active')
  main.classList.toggle('main__overlay')
}

function setParalax(offset, images) {
  images.forEach((item) => {
    item.style.transform = `translate3d(0, ${offset * (window.innerHeight * 0.8)}px, ${
      item.dataset.zIndex * 100
    }px) scale(${-item.dataset.zIndex + 0.5})`
  })
}
