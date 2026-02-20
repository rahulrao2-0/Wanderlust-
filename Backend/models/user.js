import mongoose from "mongoose";
import Host from "./host.js";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    role:{
        type:String,
        enum:["user","host","admin"],
        default:"user"
    },
    isVerified: {
    type: Boolean,
    default: false
    },

    emailVerifyToken: String,
    emailVerifyExpires: Date
},
    {timestamps:true}
)
userSchema.pre("findOneAndDelete", async function (next) {
  const user = await this.model.findOne(this.getFilter());

  if (user) {
    await Host.findOneAndDelete({ user: user._id });
  }

});


const User = mongoose.model("User",userSchema);

export default User;