var mongoose = require('mongoose');
var Schema = mongoose.Schema;

detailSchema = new Schema( {
	unique_id:Number,
	ItemCode:String,
	Name: String,
	Group: String,
	SellingPrice:Number,
	Quantity : Number,
	Squantity:Number,
	Mquantity:Number,
	Lquantity:Number,
	XLquantity:Number,
	Description:String,
	Stock : Number,
	image1:String,
	image2:String,
	image3:String,
	image4:String,
	added_date:{
		type: Date,
		default: Date.now
	}
}),
Detail = mongoose.model('Detail', detailSchema);

module.exports = Detail;
