const express = require('express');
const { signup, signin , getUser,getone,deleteuser,updateuser,updatePassword} = require('../../Controllers/admin/auth');
const router = express.Router();
router.get('/student/get', getUser);
router.post('/student/signup', signup);
router.post('/student/signin', signin);
router.get('/student/getAll', getUser);
router.get('/student/getsingle/:id', getone);
router.delete('/student/delete/:id', deleteuser);
router.put('/student/update/:id',updateuser );
router.put('/student/updatePass',updatePassword );

module.exports = router;