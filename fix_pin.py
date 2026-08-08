import re

content = open('src/components/OrderTrackingScreen.tsx', 'r').read()

target = """  const handleVerifyPin = () => {
    if (enteredPin === order?.deliveryOtp) {
      setPinVerified(true);
    } else {
      alert("delivery confirmation PIN is Incorrect.");
    }
  };"""

replacement = """  const handleVerifyPin = () => {
    if (!enteredPin || enteredPin.trim() === "" || enteredPin.length !== 4) {
      alert("Please enter a valid 4-digit PIN.");
      return;
    }
    if (String(enteredPin) === String(order?.deliveryOtp)) {
      setPinVerified(true);
    } else {
      alert("delivery confirmation PIN is Incorrect.");
    }
  };"""

content = content.replace(target, replacement)
open('src/components/OrderTrackingScreen.tsx', 'w').write(content)
