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

document
  .querySelectorAll('.feature-item')
  .forEach(
    (featuresItem) =>
      (featuresItem.style.top = document.querySelector('.feature__header').getBoundingClientRect().height + 'px')
  )

const features = document.querySelector('.features')
const featuresItemsWrapper = document.querySelector('.features__item-wrapper')

const featuresHeaderHeight = document.querySelector('.feature__header').getBoundingClientRect().height
const featureItemHeight = document.querySelector('.feature-item').getBoundingClientRect().height

featuresItemsWrapper.style.height = featureItemHeight * 2 * document.querySelectorAll('.feature-item').length + 'px'
featuresItemsWrapper.style.gap = featureItemHeight + 'px'

document.querySelectorAll('.feature-item__img-wrapper').forEach((imageWrapper, index) => {
  console.log(features.offsetTop + featuresHeaderHeight + index * (featureItemHeight * 2))
})

document.addEventListener('scroll', () => {
  document.querySelectorAll('.feature-item__img-wrapper').forEach((imageWrapper, index) => {
    const animStart = features.offsetTop + featuresHeaderHeight + index * (featureItemHeight * 2)
    const animEnd = animStart + featureItemHeight
    const offsetY = Math.max(Math.min((animEnd - window.scrollY) / (animEnd - animStart), 1), -1)

    setParalax(offsetY, imageWrapper)
  })
})

function toggleOverflowMenuVisible() {
  overlayMenu.classList.toggle('overflow-nav_active')
  main.classList.toggle('main__overlay')
}

function setParalax(offset, imageWrapper) {
  imageWrapper.parentElement.style.opacity = Math.max(Math.min(offset + 0.5, 1), 0)
  Array.from(imageWrapper.children).forEach((item) => {
    item.style.transform = `translate3d(0, ${offset * (window.innerHeight * 0.8)}px, ${
      item.dataset.zIndex * 100
    }px) scale(${-item.dataset.zIndex + 0.5})`
  })
}
