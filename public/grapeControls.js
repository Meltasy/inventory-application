const addGrapeBtn = document.querySelector('#addGrape')
const grapeInput = document.querySelector('#grapeInput')

addGrapeBtn.addEventListener('click', function() {
  const grapeCount = document.querySelectorAll('[name="grapes[]"]').length
  const grapeExtra = document.createElement('div')
  grapeExtra.className = 'grapeExtra'

  const label = document.createElement('label')
  label.setAttribute('for', `grapes${grapeCount}`)
  label.textContent = 'Cépage * '

  const input = document.createElement('input')
  input.setAttribute('type', 'text')
  input.setAttribute('name', 'grapes[]')
  input.setAttribute('id', `grapes${grapeCount}`)
  input.setAttribute('minlength', '3')
  input.setAttribute('maxlength', '30')

  const button = document.createElement('button')
  button.setAttribute('type', 'button')
  button.addEventListener('click', function() { 
    removeGrape(this)
  })

  const deleteIcon = document.querySelector('.deleteIcon').cloneNode(true)
  button.appendChild(deleteIcon)

  grapeExtra.appendChild(label)
  grapeExtra.appendChild(input)
  grapeExtra.appendChild(button)

  grapeInput.appendChild(grapeExtra)
})

function removeGrape(button) {
  const removeGrapeExtra = button.parentElement
  removeGrapeExtra.remove()
}
