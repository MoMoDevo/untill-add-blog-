import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique:'true'
  },
  username: {
    type: String,
    
  },
  password: {
    type: String,
  }
});

const User = models.User || model("User", UserSchema);

export default User;