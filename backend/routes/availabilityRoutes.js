const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createAvailability,getUserAvailability,updateAvailability,deleteAvailability } = require('../controllers/availabilityController');



router.get('/:userId', getUserAvailability);

router.use(auth);

router.post('/', createAvailability);
router.put('/:id', updateAvailability);
router.delete('/:id', deleteAvailability);

module.exports = router;