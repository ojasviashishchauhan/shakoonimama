var mongoose = require('mongoose');
var Schema = mongoose.Schema;

reviewSchema = new Schema( {
  productid: {type: Schema.Types.ObjectId, ref: 'Detail'},
  added_date:{
		type: Date,
		default: Date.now
	},
	rated: [{
    name:{type: String},
		review: {type: Number, default:0},
		comment: {type: String, default:''}
	}]

}),
Reviews = mongoose.model('Review', reviewSchema);

module.exports = Reviews;
