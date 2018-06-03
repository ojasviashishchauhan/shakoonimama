t1wY4GxFHcWNtxTI6YVeRuny


var instance = new Razorpay({
  key_id: 'rzp_test_SbMRoudvvusfuG',
  key_secret: 't1wY4GxFHcWNtxTI6YVeRuny'
})



// API signature
// {razorpayInstance}.{resourceName}.{methodName}(resourceId [, params])

// example
instance.payments.fetch(paymentId)


instance.payments.all({
  from: '2016-08-01',
  to: '2016-08-20'
}, (error, response) => {
  if (error) {
    // handle error
  } else {
    // handle success
  }
})
