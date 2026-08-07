lines = open("src/components/MainAppScreen.tsx").read().split("\n")
for i in [1269, 1449, 1866, 1972, 2024]:
    if 'onNavigate(' in lines[i]:
        lines[i] = lines[i].replace('onNavigate("Home")', 'onNavigate("Back")')
        lines[i] = lines[i].replace('onNavigate("Categories")', 'onNavigate("Back")')
        lines[i] = lines[i].replace('onNavigate("Profile")', 'onNavigate("Back")')

open("src/components/MainAppScreen.tsx", "w").write("\n".join(lines))
