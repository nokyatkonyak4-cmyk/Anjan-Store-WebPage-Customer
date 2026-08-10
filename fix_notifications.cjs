const fs = require('fs');
let content = fs.readFileSync('src/components/MainAppScreen.tsx', 'utf8');

const regex = /function NotificationsScreen\(\{ notifications, onNavigate \}: any\) \{[\s\S]*?return \(/;

const newCode = `import { deleteDoc } from "firebase/firestore";

function NotificationsScreen({ notifications, onNavigate }: any) {
    const handleNotificationClick = async (notif: any) => {
        if (!notif.isRead) {
            onNavigate("optimistic_read_" + notif.id);
            try {
                await updateDoc(doc(db, "notifications", notif.id), { isRead: true });
            } catch (error) {
                console.error("Error updating notification", error);
            }
        }
    };
    
    const handleDeleteNotification = async (notif: any, e: any) => {
        e.stopPropagation();
        onNavigate("optimistic_delete_" + notif.id);
        try {
            await deleteDoc(doc(db, "notifications", notif.id));
            toast.success("Notification deleted");
        } catch (error) {
            console.error("Error deleting notification", error);
        }
    };
    
    return (`;

if (regex.test(content)) {
    content = content.replace(regex, newCode);
    
    // Ensure import { deleteDoc } is correctly added at the top if it's not there, 
    // actually it's easier to just replace the local function string and use the existing imports. 
    // Let's first check if deleteDoc is imported.
}
fs.writeFileSync('src/components/MainAppScreen.tsx', content);
