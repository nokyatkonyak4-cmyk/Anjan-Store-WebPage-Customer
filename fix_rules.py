rules = """rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null; 
    }
    match /staticPages/{document=**} {
      allow read: if true;
    }
    match /categories/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /products/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /products/{productId}/reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /banners/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /settings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /feedbacks/{document=**} {
      allow create: if request.auth != null;
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
    match /orders/{document=**} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && (resource.data.customerId == request.auth.uid || isAdmin());
      allow delete: if isAdmin();
    }
    match /notifications/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /userNotifications/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      match /{document=**} {
        allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      }
    }
  }
}"""
open('firestore.rules', 'w').write(rules)
print("Restored sensible rules")
