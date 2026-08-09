import re

content = open('firestore.rules', 'r').read()

target = """    match /users/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      match /{document=**} {
        allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      }
    }"""

replacement = """    match /users/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      match /notifications/{notifId} {
        allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      }
      match /{document=**} {
        allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      }
    }"""

if target in content:
    content = content.replace(target, replacement)
    print("Updated firestore.rules")
else:
    print("Target not found")

open('firestore.rules', 'w').write(content)
