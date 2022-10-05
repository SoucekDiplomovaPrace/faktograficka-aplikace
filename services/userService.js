const bcrypt = require('bcrypt')

const User = require('../models/user')

const getUserById = (id) => {
    return User.findById(id)
}

const getUserByName = (name) => {
    return User.find({ name: name })
}

const createUser = (name, password) => {
    if (this.getUserByName(name)) {
        throw `Name ${name} already exists`;
    }
    
    const hashPassword = bcrypt.hash(password, 10)
    
    const newUser = new User({
        name: name,
        password: hashPassword
    })
    
    return newUser.save()
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
    getUserByName,
    createUser,
    updateUser,
    deleteUserById
}