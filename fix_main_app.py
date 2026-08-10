import re

with open("src/components/MainAppScreen.tsx", "r") as f:
    content = f.read()

# The broken part starts at:
#           {bottomNavItems.map((item, index) => {
#             const isSelected =
#               selectedItem === item.title ||
#               (item.title === "Categories" &&
#                 selectedItem.startsWith("Category_"));
#             return (
#               <button 
#           onClick={async () => {

start_marker = r'\{bottomNavItems\.map\(\(item, index\) => \{[\s\S]*?onClick=\{async \(\) => \{'
end_marker = r'Enable Push\s*<\/button>\s*<\/div>'

match = re.search(start_marker + r'.*?' + end_marker, content, re.DOTALL)
if match:
    print("Found broken block")
else:
    print("Could not find broken block")

