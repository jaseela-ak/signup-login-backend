const express=require('express');
const users=require('../models/userModels')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const router=express.Router();
// registration
router.post('/register',async(req,res)=>{
    const {username,email,password}=req.body;
     // Check if the username or email already exists
     const existingUser = await users.findOne({ $or: [{ username }, { email }] });
     if (existingUser) {
       return res.status(400).json({ message: 'Username or email already exists' });
     }

       // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
     // Create a new user
    const newUser=new users({username,email,password:hashedPassword});
    try{
        newUser.save()
        res.send('User Register Successfully ')
    }catch(error){
        res.status(400).json({message:error})
        }
    
}) 
// login
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find the user by username
      const user = await users.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
// Compare the provided password with the stored hashed password
const passwordMatch = await bcrypt.compare(password, user.password);
if (!passwordMatch) {
  return res.status(401).json({ message: 'Incorrect password' });
}

// Generate and send a JSON Web Token (JWT)
const token = jwt.sign({ userId: user._id }, 'secret-key'); // Replace 'secret-key' with your own secret key
return res.status(200).json({ token });
} catch (error) {
console.error('Error:', error);
return res.status(500).json({ message: 'Internal server error' });
}
});


// forgot password

router.post('/forgotpassword', async (req, res) => {
    try {
      const { email } = req.body;
  
      // Find the user by email
      const user = await users.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate a random password
      const newPassword = Math.random().toString(36).slice(-8);
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();
  
      // Send the new password to the user's email
      const transporter = nodemailer.createTransport({
        // Set up your email provider configuration
        service: 'Gmail',
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-email-password'
        }
      });
  
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'New Password',
        text: `Your new password is: ${newPassword}`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
  
      return res.status(200).json({ message: 'New password sent to your email' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
module.exports=router;