const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const oldStr = `              <span className={\`text-[10px] \${isSelected ? 'text-dark-bg font-bold' : 'text-gray-400 font-medium'}\`}>{item.title}</span>
            </button>
          );
        })}
      </div>`;

// Wait, that string exists multiple times?
// Let's just split and join.

const parts = content.split('      </div>              <span className={`text-[10px] ${isSelected ? \'text-dark-bg font-bold\' : \'text-gray-400 font-medium\'}`}>{item.title}</span>');
if (parts.length > 1) {
  content = parts[0] + '      </div>';
  const remaining = parts[1];
  // the remaining is:
  //             </button>
  //           );
  //         })}
  //       </div>
  //     </div>
  //   );
  // }
  
  // Actually we need to remove the whole broken block:
  const brokenRegex = /      \}<\/div>              <span className=\{\`text-\[10px\] \$\{isSelected \? 'text-dark-bg font-bold' : 'text-gray-400 font-medium'\}\`\}>\{item\.title\}<\/span>[\s\S]*?<\/div>\n    <\/div>\n  \);\n\}/;
  content = content.replace(brokenRegex, `    </div>\n  );\n}`);
} else {
    const backupFix = /      \}<\/div>[\s\S]*?<\/div>\n    <\/div>\n  \);\n\}/;
    const replacement = `    </div>\n  );\n}`;
    // let's just do a manual string replace.
}
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
