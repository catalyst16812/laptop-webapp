const mongoose = require("mongoose");

const LaptopSchema = new mongoose.Schema({
  Brand: {
    type: String,
    required: true,
  },
  Link:{
    type:String,
  },
  Model: {
    type: String,
    required: true,
  },
  Cpuman:{
    type:String,
  },
  Cpu: {
    type: String,
    required: true,
  },
  CpuGen: {
    type: Number
  },
  Ram: {
    type: Number,
    required: true,
  },
  Gpu:{
    type: String
  },
  SSD:{
    type:String
  },
  SsdSize:{
    type: Number,
  },
  Price:{
    type: Number,
    required : true,
  },
  Laptopsize:{
    type: Number,
  },
  Selfadd:{
    type: Boolean
  }
});

const User = mongoose.model("Laptop", LaptopSchema);

module.exports = User;
