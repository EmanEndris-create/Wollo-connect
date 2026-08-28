import { Link, Outlet } from "react-router-dom"
import ThemeSelector from "./ThemeSelector"
import Sidebar from "./Sidebar"


function Layout() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle inline" />
      <div className="drawer-content flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300 sticky top-0 z-10 shrink-0">
          <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost drawer-button">
            {/* Sidebar toggle icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" fill="none" stroke="currentColor" className="my-1.5 inline-block size-6"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path><path d="M9 4v16"></path><path d="M14 10l2 2l-2 2"></path></svg>
          </label>
            <div className='flexEnd gap-3 ml-auto px-4'>
              <Link to = {'/requests'} className= 'btn rounded-full'>
              Requests
              <div className='badge badge-sm badge-info'>{'00'}</div>
              </Link>
              <ThemeSelector />
          </div>
        </nav>
        {/* Page content here */}
        <div className="p-4 flex-1 overflow-y-auto">
          <Outlet />
          </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

        <Sidebar />
      </div>
    </div>
  )
}

export default Layout
