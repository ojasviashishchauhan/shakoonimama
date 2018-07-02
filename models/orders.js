
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
	owner: {type: Schema.Types.ObjectId, ref: 'User'},
	items: [{
		name:{type:String},
		price: {type: Number, default: 0},
		size:{type:String , default:'S'},
		image:String,
		dateo:{
	    type:Date,
	    default:Date.now
	  }
	}]
});

module.exports = mongoose.model('Order', OrderSchema);
