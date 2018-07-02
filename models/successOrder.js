var mongoose = require('mongoose');
var Schema = mongoose.Schema;

successOrderSchema = new Schema( {
	Name: String,
	Email: String,
	Pincode:Number,
	order_date:{
		type: Date,
		default: Date.now
	},
  City:String,
  State:String,
  Address:String,
  Address1:String,
  Phone:Number,
  Amount:Number,
  Payment:String,
	
}),
successOrder = mongoose.model('successOrder', successOrderSchema);

module.exports =successOrder;
