import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = "const msg = `Your order #${orderId.slice(0, 6).toUpperCase()} is ${newStatus}.`;"

replacement = """
                let actionStr = `is now ${newStatus}`;
                if (newStatus.toLowerCase() === 'packed') actionStr = 'is packed and ready for delivery';
                if (newStatus.toLowerCase() === 'shipped') actionStr = 'has been shipped';
                if (newStatus.toLowerCase() === 'delivered') actionStr = 'has been delivered successfully';
                if (newStatus.toLowerCase() === 'cancelled') actionStr = 'has been cancelled';
                
                const msg = `Your order #${orderId.slice(0, 6).toUpperCase()} ${actionStr}.`;
"""

if target in content:
    content = content.replace(target, replacement)
    open('src/components/MainAppScreen.tsx', 'w').write(content)
    print("Replaced successfully")
else:
    print("Target not found!")
