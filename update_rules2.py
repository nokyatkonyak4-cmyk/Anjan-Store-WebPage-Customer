import re

content = open('firestore.rules', 'r').read()

content = content.replace('''    match /notifications/{document=**} {
      allow read, update: if request.auth != null && (resource.data.customerId == request.auth.uid || resource.data.userId == request.auth.uid || isAdmin());
      allow create, delete: if request.auth != null;
    }
    match /userNotifications/{document=**} {
      allow read, update: if request.auth != null && (resource.data.userId == request.auth.uid || isAdmin());
      allow create, delete: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      match /notifications/{notifId} {
        allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      }
      match /{document=**} {
        allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      }
    }''', '''    match /notifications/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /userNotifications/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      match /notifications/{document=**} {
        allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      }
      match /{document=**} {
        allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      }
    }''')

open('firestore.rules', 'w').write(content)
print("Updated rules script")
