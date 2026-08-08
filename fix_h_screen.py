import glob

files = glob.glob('src/**/*.tsx', recursive=True)

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    if 'h-screen' in content or 'min-h-screen' in content:
        content = content.replace('min-h-screen', 'min-h-[100dvh]')
        content = content.replace('h-screen', 'h-[100dvh]')
        
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Replaced in {file_path}")

print("Done")
