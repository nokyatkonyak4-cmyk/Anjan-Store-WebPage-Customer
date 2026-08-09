import re

content = open('firestore.rules', 'r').read()

replacement = """rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}"""

open('firestore.rules', 'w').write(replacement)
print("Wrote test rules")
