import subprocess
import time

rules_open = """rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}"""

print("Setting permissive rules")
open('firestore.rules', 'w').write(rules_open)
