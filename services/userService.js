const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('../models/user')

const getUserById = (id) => {
    return User.findById(id)
}

const getUserByUsername = (username) => {
    return User.find({ username: username })
}


const updateUser = async (id, userUpdate) => {
    const updatedUser = await User.findByIdAndUpdate(id, userUpdate)
    if (updatedUser)
        await this.save()
    return updatedUser    

}

const deleteUserById = async (id) => {
    return User.findByIdAndDelete(id)
}

module.exports = {
    getUserById,
    getUserByUsername,
    updateUser,
    deleteUserById
}