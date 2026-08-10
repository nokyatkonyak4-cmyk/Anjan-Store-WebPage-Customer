const fs = require('fs');

let content = fs.readFileSync('src/components/Screens.tsx', 'utf8');

// The HomeScreen returns a div wrapping everything, ending with:
//             )}
//         </div>
//     );
// }

// Let's replace the last closing div of HomeScreen with the Footer and closing div.
const hsRegex = /export function HomeScreen\(\{[\s\S]*?\}\s*\)\s*;/;

const searchStr = `                </div>
            )}
        </div>
    );
}`;

if (content.includes(searchStr)) {
    content = content.replace(searchStr, `                </div>
            )}
            
            <Footer />
        </div>
    );
}`);
    fs.writeFileSync('src/components/Screens.tsx', content);
    console.log("Added Footer to HomeScreen!");
} else {
    console.log("Could not find replacement string.");
}
