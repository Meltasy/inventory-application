function handleDecrease() {
  const quantityInput = document.getElementById('quantity')
  const currentValue = parseInt(quantityInput.value) || 0
  quantityInput.value = currentValue > 0 ? currentValue - 1 : 0
}

function handleIncrease() {
  const quantityInput = document.getElementById('quantity')
  const currentValue = parseInt(quantityInput.value) || 0
  quantityInput.value = currentValue < 100 ? currentValue + 1 : 100
}
