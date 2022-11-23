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
    // console.log(this)
    this.move()
    this.isBusy = true
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
let scrollDirection = 0
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

document.querySelectorAll('a[href]').forEach((a) => a.addEventListener('click', addScrollingHanderForLinks))

document.addEventListener('scroll', scrollTrigger)

document.addEventListener('scroll', traceDirection(), false)

// calculated values

const featuresHeaderHeight = document.querySelector('.feature__header').getBoundingClientRect().height
const featureItemHeight = document.querySelector('.feature-item').getBoundingClientRect().height
const featureItemsLength = featuresItems.length

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
      features.offsetTop + featuresHeaderHeight + index * (featureItemHeight * 3) + featureItemHeight
    ])
  })
  console.log(brakepoints)

  console.log(features.offsetTop)
  console.log(featuresItems[0].offsetTop)
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
      img.style.transform = `translate3d(0, ${offsetY * (window.innerHeight * 0.8)}px, ${img.dataset.zIndex * 100}px) scale(${
        -img.dataset.zIndex + 0.5
      })`
    })

    if (offsetY > -1 && offsetY < 1) {
      checkPosition(item, index, array)
      setTransformForFeatureItem(item.parentElement, index)
    }
  })
}

function setTransform() {
  const top = getComputedStyle(features).paddingTop
  if (
    window.scrollY > features.offsetTop &&
    window.scrollY < features.offsetTop + features.clientHeight - (top.replace('px', '') * 2 + featureItemHeight)
  ) {
    featuresHeader.style.position = 'sticky'
    featuresHeader.style.top = top
    // featuresHeader.style.paddingBottom = Number(top.replace('px', '')) + featureItemHeight + 'px'
  } else {
    featuresHeader.style.position = 'static'
    featuresHeader.style.top = 'unset'
  }
}

function setTransformForFeatureItem(item, index) {
  console.log(features.offsetTop)
  console.log(featuresItems[0].offsetTop)

  if (window.scrollY > features.offsetTop && window.scrollY <= brakepoints[index][1]) {
    Array.from(item.children).forEach((img) => (img.style.transform = `translateY(${window.scrollY - features.offsetTop}px)`))
  }
}

function scrollTrigger() {
  setTransform()
  setParalax()
}

function checkPosition(item, index, array) {
  if (
    scrollDirection === ScrollDirections.DOWN &&
    index < array.length - 1 &&
    item.getBoundingClientRect().y < -100 &&
    array[index + 1].getBoundingClientRect().y > 0
  ) {
    scroller.goTo(scrollY + array[index + 1].getBoundingClientRect().y)
  }
  if (
    scrollDirection === ScrollDirections.UP &&
    index > 0 &&
    item.getBoundingClientRect().y > 100 &&
    array[index - 1].getBoundingClientRect().y < 0
  ) {
    scroller.goTo(scrollY + array[index - 1].getBoundingClientRect().y)
  }
}

function toggleOverflowMenuVisible() {
  overlayMenu.classList.toggle('overflow-nav_active')
  main.classList.toggle('main__overlay')
}

function addScrollingHanderForLinks(event) {
  event.preventDefault()
  scroller.goToElement(event.target.getAttribute('href'))
}

// run code

fillBrakepoints()
setInitialStylesForFeatureItemsWrapper()
