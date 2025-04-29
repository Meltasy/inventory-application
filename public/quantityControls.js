function handleDecrease() {
  const qtyInput = document.querySelector('#qtyFull')
  const currentValue = parseInt(qtyInput.value) || 0
  qtyInput.value = currentValue > 0 ? currentValue - 1 : 0
}

function handleIncrease() {
  const qtyInput = document.querySelector('#qtyFull')
  const currentValue = parseInt(qtyInput.value) || 0
  qtyInput.value = currentValue < 100 ? currentValue + 1 : 100
}
