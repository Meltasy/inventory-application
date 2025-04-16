const { body } = require('express-validator')

const reqErr = 'is required.'
const lengthErr = 'must be between 1 and 30 characters'

const validateWine = [
  body('wineName').trim().notEmpty().withMessage(`Wine name ${reqErr}`)
    .isLength({ min: 1, max: 30 }).withMessage(`Name ${lengthErr}`),
  body('wineYear').notEmpty().withMessage(`Wine year ${reqErr}`)
    .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('This must be a year between 1900 and this year.'),
  body('wineColor').notEmpty().withMessage(`Wine color ${reqErr}`),
  body('wineStyle').notEmpty().withMessage(`Wine style ${reqErr}`),
  body('quantity').notEmpty().withMessage(`Wine quantity ${reqErr}`)
    .isInt({ min: 0, max: 100}).withMessage('This must be a number between 1 and 100.'),
]

module.exports = { validateWine }
