import getCurrentUser from "@/app/actions/getCurrentUser"
import MobileFooter from "./MobileFooter"
import DesktopSidebar from "./desktopsidebar"

async function Sidebar({children} : {
    children: React.ReactNode
}) {
    const currentUser = await getCurrentUser()
    return (
        <div className="h-full">
            <DesktopSidebar currentUser={currentUser!}/>
            <MobileFooter/>
            <main className="lg:pl-20 h-full">
                {children}
            </main>
        </div>
    )
}

export default Sidebar