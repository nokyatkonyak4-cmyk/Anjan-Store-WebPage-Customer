import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """                    setDoc(notifRef, notifData).catch(console.error);
                }
              }
            }
          });"""

replacement = """                    setDoc(notifRef, notifData).catch(console.error);
                    const notifRef2 = doc(collection(db, "notifications"));
                    setDoc(notifRef2, notifData).catch(console.error);
                }
              }
            }
          });"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced global notification saving")
else:
    print("Target not found")

open('src/components/MainAppScreen.tsx', 'w').write(content)
