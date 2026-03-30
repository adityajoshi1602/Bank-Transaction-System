const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        lowercase: true,
        match: [/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/, "invalid email"],
        unique: true
    },
    name: {
        type: String,
        required: [true, "name is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "password must be at least 6 characters"],
        select: false
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return
    }

    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash;
    return
})

userSchema.methods.comparePassword=async function (pass){
    return await bcrypt.compare(pass,this.password)
}

const usermodel = mongoose.model('user',userSchema)

module.exports=usermodel
