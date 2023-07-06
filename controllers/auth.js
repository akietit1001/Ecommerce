import userModel from "../models/user.js"
import orderModel from "../models/order.js";
import { comparePassword, hashPassword } from './../helpers/auth.js';
import JWT from 'jsonwebtoken'

export const registerHandler = async(req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body
            // validations
        if (!name) {
            return res.send({ message: 'Inavalid name' })
        }
        if (!email) {
            return res.send({ message: 'Inavalid email' })
        }
        if (!password) {
            return res.send({ message: 'Inavalid password' })
        }
        if (!phone) {
            return res.send({ message: 'Inavalid phone' })
        }
        if (!address) {
            return res.send({ message: 'Inavalid address' })
        }
        if (!answer) {
            return res.send({ message: 'Inavalid answer' })
        }
        // check user
        const existingUser = await userModel.findOne({ email });
        // existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'User already exists'
            })
        }
        // register user
        const hashedPassword = await hashPassword(password)
            // save
        const user = await new userModel({ name, email, phone, address, answer, password: hashedPassword }).save()

        res.status(201).send({
            success: true,
            message: 'User has been registered',
            user,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Registeration',
            error
        })
    }
}

// LOGIN
export const loginHandler = async(req, res) => {
    try {
        const { email, password } = req.body
            // validatation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        // check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not registered'
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: true,
                message: 'Invalid password'
            })
        }
        // token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        })
        res.status(200).send({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Login',
            error
        })
    }
}

// Forgot Password Handler
export const forgotPasswordHandler = async(req, res) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!email) {
            res.status(400).send({ message: 'Email is required!' })
        }
        if (!answer) {
            res.status(400).send({ message: 'Answer is required!' })
        }
        if (!newPassword) {
            res.status(400).send({ message: 'New password is required!' })
        }
        // check user
        const user = await userModel.findOne({ email, answer })
            // validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Wrong email or answer'
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).send({ success: true, message: 'Password is updated successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Something went wrong',
            error
        })
    }
}

// test handler
export const testHandler = (req, res) => {
    res.send('protected route')
}

// update profile
export const updateProfileHandler = async(req, res) => {
    try {
        const { name, email, password, address, phone } = req.body
        const user = await userModel.findById(req.user._id)
            // Password 
        if (!password && password.length < 6) {
            return res.json({ error: 'Password must be required and least 6 characters' })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id, {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            }, { new: true });
        res.status(200).send({
            success: true,
            message: 'Profile updated successfully',
            updatedUser
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error,
            message: 'Error while updating profile'
        })
    }
}

export const getOrderHandler = async(req, res) => {
    try {
        // const { id } = req.body
        const orders = await orderModel.find({ buyer: req.user._id }).populate('products', '-photo').populate('buyer', 'name')
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting order',
            error
        })
    }
}

export const getAllOrderHandler = async(req, res) => {
    try {
        const orders = await orderModel.find({}).populate('products', '-photo').populate('buyer', 'name').sort({ createdAt: '-1' })
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while getting order',
            error
        })
    }
}

// order status
export const orderStatusHandler = async(req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while updating order status',
            error
        })
    }
}