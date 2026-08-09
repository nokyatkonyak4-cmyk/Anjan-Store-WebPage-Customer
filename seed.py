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

original_rules = open('firestore.rules').read()

print("Setting permissive rules")
open('firestore.rules', 'w').write(rules_open)
subprocess.run(['npx', 'firebase-tools', 'deploy', '--only', 'firestore', '--project', 'gen-lang-client-0690213156'])

print("Running seed")
import os
os.system('node seed_db_noauth.js')

print("Restoring rules")
open('firestore.rules', 'w').write(original_rules)
subprocess.run(['npx', 'firebase-tools', 'deploy', '--only', 'firestore', '--project', 'gen-lang-client-0690213156'])
