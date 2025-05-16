const externalLinks = document.querySelectorAll('a.extLink')

externalLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const url = link.getAttribute('href')
    window.open(url, '_blank', 'noopener,noreferrer')
  }) 
})
