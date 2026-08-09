import re

content = open('src/components/MainAppScreen.tsx', 'r').read()

target = """  const handleNavigate = (item: string) => {
    if (item === "Back") {
      handleGoBack();
      return;
    }"""

replacement = """  const handleNavigate = (item: string) => {
    if (item.startsWith("optimistic_read_")) {
      const id = item.replace("optimistic_read_", "");
      const updateFn = (prev: any[]) => prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      setNotifications1(updateFn);
      setNotifications2(updateFn);
      setNotifications3(updateFn);
      return;
    }
    if (item.startsWith("optimistic_delete_")) {
      const id = item.replace("optimistic_delete_", "");
      const filterFn = (prev: any[]) => prev.filter(n => n.id !== id);
      setNotifications1(filterFn);
      setNotifications2(filterFn);
      setNotifications3(filterFn);
      return;
    }
    if (item === "Back") {
      handleGoBack();
      return;
    }"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced handleNavigate successfully")
else:
    print("Target not found")

open('src/components/MainAppScreen.tsx', 'w').write(content)
