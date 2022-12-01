// constants

const ScrollDirections = {
  DOWN: 'down',
  UP: 'up'
}

// classes

class Scroller {
  isBusy = false
  start = 0
  step = 1
  progress = 0
  target = 0
  distance = 0

  pseudoSigmoid(x) {
    return x <= 0 ? 0 : x >= 1 ? 1 : (1 - Math.cos(Math.PI * x)) * 0.5
  }

  goToElement(selector) {
    const el = document.querySelector(selector)
    this.goTo(el.offsetTop, 1)
  }

  goTo(y, timeSec = 1) {
    if (this.isBusy) {
      return
    }
    console.log('scrolling to ' + y)
    this.progress = 0
    this.start = window.scrollY
    this.target = y
    this.distance = y - this.start
    this.step = this.distance / timeSec / 60
    this.isBusy = true
    this.move()
  }

  move() {
    this.progress += this.step
    const currentState = this.progress / this.distance
    // console.log('currentState: ' + currentState)
    scrollTo(0, this.start + this.distance * this.pseudoSigmoid(currentState))
    // scrollTo(0, window.scrollY + this.step)

    if (currentState >= 1 || (this.progress - this.step <= this.distance && this.distance <= this.progress + this.step)) {
      // if (window.scrollY - this.step <= this.target && this.target <= window.scrollY + this.step) {
      scrollTo(0, this.target)
      this.isBusy = false
      console.log('Ended scroll animation')
      return
    }

    requestAnimationFrame(this.move.bind(this))
  }
}

//project variables

let currentScroll = 0
let scrollDirection = ScrollDirections.DOWN
let scrollOffset = 100
const brakepoints = []
const scroller = new Scroller()

// document elements

const main = document.getElementById('main')
const overlayMenu = document.getElementById('overlayMenu')
const menuButton = document.getElementById('menuButton')
const closeMenuButton = document.getElementById('closeMenuButton')
const collapsePanelList = document.querySelectorAll('.collapse-panel')
const convenientWorkflow = document.querySelector('#convenientWorkflow')

const features = document.querySelector('.features')
const featuresHeader = document.querySelector('.feature__header')
const featuresItemsWrapper = document.querySelector('.feature__items-wrapper')
const featuresItems = document.querySelectorAll('.feature-item__img-wrapper')

// event listeners

menuButton.addEventListener('click', toggleOverflowMenuVisible)

closeMenuButton.addEventListener('click', toggleOverflowMenuVisible)

collapsePanelList.forEach(toggleCollaps)

document.querySelectorAll('[href^="#"]').forEach((a) => a.addEventListener('click', handleScrollToAnchor))

document.addEventListener('scroll', scrollTrigger)

document.addEventListener('scroll', traceDirection(), false)

overlayMenu.querySelectorAll('[href^="#"]').forEach((a) => a.addEventListener('click', handleScrollToAnchorAndToggleOvrelayMenu))

// calculated values

const featuresHeaderHeight = document.querySelector('.feature__header').getBoundingClientRect().height
const featureItemHeight = document.querySelector('.feature-item').getBoundingClientRect().height
const featureItemsLength = featuresItems.length
const featuresPaddingBlock = Number(getComputedStyle(features).paddingTop.replace('px', ''))

// functions

function traceDirection() {
  oldScrollY = window.scrollY
  return () => {
    scrollDirection = oldScrollY < window.scrollY ? ScrollDirections.DOWN : ScrollDirections.UP
    oldScrollY = window.scrollY
  }
}

function toggleCollaps(element) {
  element.addEventListener('click', function () {
    this.classList.toggle('collapse-panel_active')
  })
}

function fillBrakepoints() {
  document.querySelectorAll('.feature-item__img-wrapper').forEach((_, index) => {
    brakepoints.push([
      features.offsetTop + featuresHeaderHeight + index * (featureItemHeight * 3),
      features.offsetTop + featuresHeaderHeight + index * (featureItemHeight * 3) + featureItemHeight * 3
    ])
  })
}

function setInitialStylesForFeatureItemsWrapper() {
  featuresItemsWrapper.style.height = featureItemHeight * featureItemsLength * 3 + 'px'
  featuresItemsWrapper.style.gap = featureItemHeight * 2 + 'px'
}

function setParalax() {
  featuresItems.forEach((item, index, array) => {
    const [animStart, animEnd] = brakepoints[index]

    const offsetY = Math.max(Math.min((animEnd - window.scrollY) / (animEnd - animStart), 1), -1)

    Array.from(item.children).forEach((img) => {
      img.style.transform = `translate3d(-50%, ${offsetY * (window.innerHeight * 0.8)}px, ${img.dataset.zIndex * 100}px) scale(${
        -img.dataset.zIndex + 0.5
      })`
    })

    if (offsetY > -1 && offsetY < 1) {
      if (!scroller.isBusy) {
        checkItemPosition(item, index, array)
      }
      setTransformForFeatureItem(item.parentElement, index, array)
    }
  })
}

function setTransform() {
  if (
    window.scrollY > features.offsetTop &&
    window.scrollY < features.offsetTop + features.clientHeight - (featuresPaddingBlock * 2 + featureItemHeight)
  ) {
    featuresHeader.style.position = 'sticky'
    featuresHeader.style.top = featuresPaddingBlock + 'px'
  } else {
    featuresHeader.style.position = 'static'
    featuresHeader.style.top = 'unset'
  }
}

function setTransformForFeatureItem(item, index, array) {
  if (scrollY > brakepoints[index][0] && scrollY < brakepoints[index][1] - featureItemHeight && index < array.length) {
    item.style.position = 'sticky'
    item.style.top = featuresPaddingBlock + featuresHeaderHeight + 'px'
  } else if (scrollY > brakepoints[index][1] - featureItemHeight && scrollY < brakepoints[index][1]) {
    const top = +item.style.top.replace('px', '')
    item.style.top = top - 50 + 'px'
  } else if (index !== array.length - 1) {
    item.style.position = 'static'
    item.style.top = 'unset'
  }
  if (index === array.length - 1) {
    featuresHeader.style.bottom = featuresPaddingBlock + featureItemHeight + 'px'
  }
}

function scrollTrigger() {
  setTransform()
  setParalax()
  if (!scroller.isBusy) {
    checkScrollPosition()
  }
}

function calcAnimationMidPosition([animStart, animEnd]) {
  return (animStart + animEnd) / 2
}

function checkItemPosition(item, index, array) {
  if (scrollDirection === ScrollDirections.DOWN) {
    if (
      index < array.length - 1 &&
      calcAnimationMidPosition(brakepoints[index]) + scrollOffset < scrollY &&
      brakepoints[index][1] > scrollY
    ) {
      scroller.goTo(calcAnimationMidPosition(brakepoints[index + 1]), 2)
    }
    if (calcAnimationMidPosition(brakepoints[array.length - 1]) + scrollOffset < scrollY && brakepoints[index][1] > scrollY) {
      scroller.goToElement('#integrations')
    }
  } else if (scrollDirection === ScrollDirections.UP) {
    if (index > 0 && calcAnimationMidPosition(brakepoints[index]) - scrollOffset > scrollY && brakepoints[index][0] < scrollY) {
      scroller.goTo(calcAnimationMidPosition(brakepoints[index - 1]), 2)
    }
    if (calcAnimationMidPosition(brakepoints[0]) - scrollOffset > scrollY) {
      scroller.goToElement('#reliable')
    }
  }
}

function checkScrollPosition() {
  if (scrollDirection === ScrollDirections.DOWN && scrollY > features.offsetTop && scrollY < features.offsetTop + scrollOffset) {
    scroller.goTo(calcAnimationMidPosition(brakepoints[0]))
  }
  if (
    scrollDirection === ScrollDirections.UP &&
    scrollY < features.offsetTop + features.clientHeight &&
    scrollY > features.offsetTop + features.clientHeight - scrollOffset
  ) {
    scroller.goTo(calcAnimationMidPosition(brakepoints[3]))
  }
}

function toggleOverflowMenuVisible() {
  overlayMenu.classList.toggle('overflow-nav_active')
  main.classList.toggle('main__overlay')
}

function handleScrollToAnchor(event) {
  event.preventDefault()
  scroller.goToElement(this.getAttribute('href'))
}

function handleScrollToAnchorAndToggleOvrelayMenu(event) {
  event.preventDefault()
  scroller.goToElement(this.getAttribute('href'))
  toggleOverflowMenuVisible()
}

// run code

fillBrakepoints()
setInitialStylesForFeatureItemsWrapper()

var duration = -1

function getOffset(t) {
  var offset = { x: 0, y: 0 }
  offset.x = t > 1 ? t - 2 : t
  offset.y = (offset.x * offset.x * -1) / 2
  return offset
}

const heroAnimationBlock = document.getElementById('heroAnimation')
Array.from(heroAnimationBlock.children).forEach((img) => {
  img.style.left = heroAnimationBlock.clientWidth / 2 - img.clientWidth / 2 + 'px'
  img.style.top = heroAnimationBlock.clientHeight / 2 - img.clientHeight / 2 + 'px'
})

setInterval(() => {
  duration = duration >= 1 ? -1 : duration + 0.003
  Array.from(heroAnimationBlock.children).forEach((img) => {
    var cords = getOffset(duration + +img.dataset.offset)
    img.style.transform = `translate(${heroAnimationBlock.clientWidth * cords.x}px, ${heroAnimationBlock.clientHeight * cords.y}px)`
  })
}, 16)
