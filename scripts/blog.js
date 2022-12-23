import posts from './posts.json' assert { type: 'json' }

import { getPostTemplate } from './blog-module.js'

const postList = document.getElementById('postList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pageSize = 6

loadMoreButton.addEventListener('click', drawPostsPage)

function drawPostsPage() {
  const postsForDraw = posts.splice(0, pageSize)
  postsForDraw.forEach((item, index) => postList.insertAdjacentHTML('beforeend', getPostTemplate(index, item)))
  if (postsForDraw.length < pageSize) {
    loadMoreButton.style.display = 'none'
  }
}

drawPostsPage()
