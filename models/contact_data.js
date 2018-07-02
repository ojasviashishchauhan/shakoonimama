var mongoose = require('mongoose');
var Schema = mongoose.Schema;

contactSchema = new Schema( {
	Name: String,
	Email: String,
	Message:String,
	added_date:{
		type: Date,
		default: Date.now
	}
}),
Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
