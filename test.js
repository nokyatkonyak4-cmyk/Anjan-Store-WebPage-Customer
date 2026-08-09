const msg = 'RESEND_PIN 1234'
console.log(msg.toLowerCase().includes("resend_pin"))
console.log(msg.match(/\b\d{4}\b/))
