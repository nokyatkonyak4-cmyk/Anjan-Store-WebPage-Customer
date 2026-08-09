import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """        if (!isRead && (title.toLowerCase().includes("resend_pin") || msg.toLowerCase().includes("resend_pin"))) {"""
replacement = """        if (!isRead && (msg.toLowerCase().includes("pin") || title.toLowerCase().includes("pin"))) {"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced pin alert logic")
else:
    print("Target not found")

open('src/components/MainAppScreen.tsx', 'w').write(content)
