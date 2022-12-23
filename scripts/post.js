import posts from './posts.json' assert { type: 'json' }

import { getPostTemplate } from './blog-module.js'

const postContent = document.getElementById('postContent')

function init() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
  })
  postContent.innerHTML = getPostContent(posts[params.post])
  drawLastPosts()
}

function drawLastPosts() {
  const postList = document.getElementById('postList')
  const postsForDraw = posts.slice(0, 3)
  postsForDraw.forEach((item, index) => postList.insertAdjacentHTML('beforeend', getPostTemplate(index, item)))
}

function getPostContent({ title, photoUrl = '../assets/images/office-woman-hands-on-report.png', createDate, readTime, content }) {
  return `
  <div class="post-cover" style="background-image: linear-gradient(359.65deg, rgba(80, 78, 78, 0.91) 0.28%, rgba(0, 0, 0, 0) 99.67%), url(${photoUrl})">
    <div class="post-cover_info">
      <h1 class="post-cover_title">${title}</h1>
      <span class="post-item_post-date"><img src="../assets/images/icons/icon-calendar.svg" alt=""> ${createDate}</span>
      <span class="post-item_time-to-read"><img src="../assets/images/icons/icon-time.svg" alt=""> ${readTime} min read</span>
    </div>
  </div>
  ${content}
`
}

init()
