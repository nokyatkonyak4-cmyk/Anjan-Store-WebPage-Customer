import re

files = [
    'src/components/MainAppScreen.tsx',
    'src/components/OrderTrackingScreen.tsx',
    'src/components/DigitalBillScreen.tsx',
    'src/App.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Find the end of onSnapshot call which looks like:
    # `    }));\n` or `    });\n`
    # We will use regex to find the onSnapshot function call and inject the error handler correctly.
    # Wait, the easiest way is to match the exact lines where it ends for each block, but it's hard.
    # What if we just do:
    # content = content.replace("    }));\n", "    }, (error) => { console.warn('Snapshot error ignored', error?.code); }));\n")
    # Actually, in MainAppScreen.tsx, it's `    }));` (with 4 spaces)
    content = content.replace("    }));", "    }, (error) => { console.warn('Snapshot error ignored', error?.code); }));")
    
    # In App.tsx, OrderTrackingScreen, DigitalBillScreen it's `    });`
    content = content.replace("    });\n", "    }, (error) => { console.warn('Snapshot error ignored', error?.code); });\n")

    with open(file, 'w') as f:
        f.write(content)
