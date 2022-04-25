const express = require('express');
const User = require('../models/user');

const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send({
                error: 'User is not found!'
            });
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/users/:id', async (req, res) => {
    const allowedProperties = ['name', 'email', 'password', 'age'];
    const updatePropertiesRequest = req.body;
    const notAllowedProperties = [];
    for (propertyName in updatePropertiesRequest) {
        if (!allowedProperties.includes(propertyName)) {
            notAllowedProperties.push(propertyName);
        }
    }

    if (notAllowedProperties.length) {
        return res.status(400).send({
            error: 'There are properties that are not allowed to be updated!',
            notAllowedProperties
        });
    }

    const id = req.params.id;
    try {
        const user = await User.findByIdAndUpdate(id, updatePropertiesRequest, {
            new: true,
            runValidators: true
        });
    
        if (!user) {
            return res.status(404).send({
                error: 'The user is not found'
            });
        }
    
        res.send(user);
    } catch (error) {
        res.send(error);
    }
});

router.delete('/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const isDeleted = await User.findByIdAndDelete(id);
    
        if (!isDeleted) {
            return res.status(404).send({
                error: 'User is not found!'
            });
        }
    
        res.send(isDeleted);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;