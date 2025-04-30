const { body, query } = require('express-validator')

const reqErr = 'is required.'
const lengthErr = 'must be between 1 and 30 characters'

const validateNewWine = [
  body('wineName').trim().notEmpty().withMessage(`Wine name ${reqErr}`)
    .isLength({ min: 1, max: 30 }).withMessage(`Name ${lengthErr}`),
  body('producer').trim().notEmpty().withMessage(`Wine producer ${reqErr}`)
    .isLength({ min: 1, max: 30 }).withMessage(`Producer ${lengthErr}`),
  body('appellation').trim().notEmpty().withMessage(`Wine appellation ${reqErr}`)
    .isLength({ min: 1, max: 30 }).withMessage(`Appellation ${lengthErr}`),
  body('region').trim().notEmpty().withMessage(`Wine region ${reqErr}`)
    .isLength({ min: 1, max: 30 }).withMessage(`Region ${lengthErr}`),
  body('wineYear').notEmpty().withMessage(`Wine year ${reqErr}`)
    .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('This must be a year between 1900 and this year.'),
  body('lifeMax').notEmpty().withMessage(`Time in years that wine can be kept ${reqErr}`)
    .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('This must be a year between 1900 and this year.'),
  body('qtyFull').notEmpty().withMessage(`Quantity of full bottles ${reqErr}`)
    .isInt({ min: 1, max: 100}).withMessage('This must be a number between 1 and 100.'),
  body('wineColor').notEmpty().withMessage(`Wine color ${reqErr}`),
]

const validateEditWine = [
  body('wineName').trim().notEmpty().withMessage(`Wine name ${reqErr}`)
    .isLength({ min: 1, max: 30 }).withMessage(`Name ${lengthErr}`),
  body('producer').trim().notEmpty().withMessage(`Wine producer ${reqErr}`)
    .isLength({ min: 1, max: 30 }).withMessage(`Producer ${lengthErr}`),
  body('appellation').trim().notEmpty().withMessage(`Wine appellation ${reqErr}`)
    .isLength({ min: 1, max: 30 }).withMessage(`Appellation ${lengthErr}`),
  body('region').trim().notEmpty().withMessage(`Wine region ${reqErr}`)
    .isLength({ min: 1, max: 30 }).withMessage(`Region ${lengthErr}`),
  body('wineYear').notEmpty().withMessage(`Wine year ${reqErr}`)
    .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('This must be a year between 1900 and this year.'),
  body('lifeMax').notEmpty().withMessage(`Time in years that wine can be kept ${reqErr}`)
    .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('This must be a year between 1900 and this year.'),
  body('qtyEmpty').notEmpty().withMessage(`Quantity of empty bottles ${reqErr}`)
    .isInt({ min: 0, max: 100}).withMessage('This must be a number between 0 and 100.'),
  body('qtyFull').notEmpty().withMessage(`Quantity of full bottles ${reqErr}`)
    .isInt({ min: 0, max: 100}).withMessage('This must be a number between 0 and 100.'),
  body('wineColor').notEmpty().withMessage(`Wine color ${reqErr}`),
]

const validateQuantity = [
  body('qtyFull').notEmpty().withMessage(`Quantity of full bottles ${reqErr}`)
    .isInt({ min: 0, max: 100}).withMessage('This must be a number between 1 and 100.'),
]

const validateSearch = [
  query('producer').trim().notEmpty().withMessage('Please enter a producer to search.')
    .isLength({ min: 1, max: 30 }).withMessage(`Producer ${lengthErr}`),
]

module.exports = { validateNewWine, validateEditWine, validateQuantity, validateSearch }
