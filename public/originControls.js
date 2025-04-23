const originListItems = document.querySelectorAll('.originList > li')

originListItems.forEach(item => {
  const originBtn = item.querySelector('button')
  const eachList = item.querySelector('.eachList')

  if (eachList) {
    originBtn.addEventListener('click', function(e) {
      e.preventDefault()
      const isOpen = eachList.classList.contains('show')
      document.querySelectorAll('.eachList.show').forEach(openList => {
        openList.classList.remove('show')
        openList.parentElement.classList.remove('active')
      })
      if (!isOpen) {
        eachList.classList.add('show')
        item.classList.add('active')
      }
    })
  }
})

document.addEventListener('click', function(e) {
  if (!e.target.closest('.originList')) {
    document.querySelectorAll('.eachList.show').forEach(openList => {
      openList.classList.remove('show')
      openList.parentElement.classList.remove('active')
    })
  }
})
