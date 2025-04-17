const colorListItems = document.querySelectorAll('.colorList > li')

colorListItems.forEach(item => {
  const colorLink = item.querySelector('a')
  const styleList = item.querySelector('.styleList')

  if (styleList) {
    colorLink.addEventListener('click', function(e) {
      e.preventDefault()
      const isOpen = styleList.classList.contains('show')
      document.querySelectorAll('.styleList.show').forEach(openList => {
        openList.classList.remove('show')
        openList.parentElement.classList.remove('active')
      })
      if (!isOpen) {
        styleList.classList.add('show')
        item.classList.add('active')
      } else {
        window.location.href = colorLink.href
      }
    })
  }
})

document.addEventListener('click', function(e) {
  if (!e.target.closest('.colorList')) {
    document.querySelectorAll('.styleList.show').forEach(openList => {
      openList.classList.remove('show')
      openList.parentElement.classList.remove('active')
    })
  }
})
