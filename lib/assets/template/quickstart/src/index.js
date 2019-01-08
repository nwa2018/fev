import './assets/css/style.css'

const title = document.createElement('h1')
title.textContent = 'Hello Fev!🚀'
title.className = 'title'

const tip = document.createElement('div')
tip.textContent = 'Edit src/index.js and save to reload.📝'
tip.className = 'tip'

const app = document.getElementById('app')

if (app) {
  app.appendChild(title)
  app.appendChild(tip)
}
