export function getPostTemplate(
  index,
  { title, imageUrl = '../assets/images/office-woman-hands-on-report.png', createDate, readTime, content }
) {
  const div = document.createElement('div')
  div.innerHTML = content
  return `<div class="post-item">
  <img class="post-item_img" src="${imageUrl}" alt="post-image"></img>
  <div class="post-item_info">
    <a href="./post.html?post=${index}" class="post-item_title">${title}</a>
    <p class="post-item_desc">${div.innerText.slice(0, 100)}</p>
    <span class="post-item_post-date"><img src="../assets/images/icons/icon-calendar.svg" alt="">${
      createDate || new Date().toJSON().slice(0, 10)
    }</span>
    <span class="post-item_time-to-read"><img src="../assets/images/icons/icon-time.svg" alt=""> ${readTime || 0} min read</span>
  </div>
  </div>`
}
