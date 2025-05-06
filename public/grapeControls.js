const addGrapeBtn = document.querySelector('#addGrape')
const grapeInput = document.querySelector('#grapeInput')

addGrapeBtn.addEventListener('click', function() {
  const grapeCount = document.querySelectorAll('[name="grapes[]"]').length
  const grapeExtra = document.createElement('div')
  grapeExtra.className = 'grapeExtra'

  grapeExtra.innerHTML = `
    <label for='grapes${grapeCount}'>Cépage</label>
    <input type='text' name='grapes[]' id='grapes${grapeCount}' minlength='3' maxlength='30'>
    <button type='button' onclick='removeGrape(this)'>X</button>
  `

  grapeInput.appendChild(grapeExtra)
})

function removeGrape(button) {
  const removeGrapeExtra = button.parentElement
  removeGrapeExtra.remove()
}

// Need to find out why my grapes aren't being saved???
