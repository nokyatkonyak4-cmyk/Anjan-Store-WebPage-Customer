import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """    const mapNotification = (d: any) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        title: data.title || data.type || "Notification",
        message: data.message || data.body || data.text || data.content || ""
      };
    };"""

replacement = """    const mapNotification = (d: any) => {
      const data = d.data();
      return {
        id: d.id,
        _path: d.ref.path,
        ...data,
        title: data.title || data.type || "Notification",
        message: data.message || data.body || data.text || data.content || ""
      };
    };"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced mapNotification")
else:
    print("Target not found")

open('src/components/MainAppScreen.tsx', 'w').write(content)
