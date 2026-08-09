rules = """rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}"""
open('firestore.rules', 'w').write(rules)
print("Wrote completely open rules for debugging")
