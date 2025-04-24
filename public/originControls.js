const regionListItems = document.querySelectorAll('.regionList > li')

regionListItems.forEach(item => {
  const regionLink = item.querySelector('a')
  const appellationList = item.querySelector('.appellationList')

  if (appellationList) {
    regionLink.addEventListener('click', function(e) {
      e.preventDefault()
      const isOpen = appellationList.classList.contains('show')
      document.querySelectorAll('.appellationList.show').forEach(openList => {
        openList.classList.remove('show')
        openList.parentElement.classList.remove('active')
      })
      if (!isOpen) {
        appellationList.classList.add('show')
        item.classList.add('active')
      } else {
        window.location.href = regionLink.href
      }
    })
  }
})

document.addEventListener('click', function(e) {
  if (!e.target.closest('.regionList')) {
    document.querySelectorAll('.appellationList.show').forEach(openList => {
      openList.classList.remove('show')
      openList.parentElement.classList.remove('active')
    })
  }
})
