const express = require('express');
const router = express.Router();
const {getAllResources,createResource,updateResource,deleteResource} = require('../controllers/resourceController');

router.get('/', getAllResources);

router.post('/', createResource);

router.put('/:id', updateResource);

router.delete('/:id', deleteResource);

module.exports = router;