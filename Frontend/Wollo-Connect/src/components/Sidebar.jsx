import { BellRing, Home, LogOutIcon, LucideMails } from "lucide-react"
import { Link, NavLink } from "react-router-dom"
import useAuthUser from "../hooks/useAuthUser"
import useLogout from "../hooks/useLogout"
import { clearAccessToken } from "../lib/token";

function Sidebar() {
  const { authenticatedUser } = useAuthUser();
  const { logoutMutation } = useLogout();

  const handleLogout = () =>{
    logoutMutation(undefined, {
      onSuccess: ()=>{
        clearAccessToken();
        console.log('logged out successfully.');
        window.location.href = '/login';
      },
    });
  };

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <Home size={25} className="opacity-50" />
    },
    {
      path: '/connections',
      label: 'Connections',
      icon: <LucideMails size={25} className="opacity-50" />
    },
    {
      path: '/notifications',
      label: 'Notifications',
      icon: <BellRing size={25} className="opacity-50" />
    }
  ]
  return (
    <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64 pt-3">
      {/* LOGO */}
      <Link to='/' className="flex gap-1 pl-3">
        <img src="./logo.jpg" alt="Wollo-Connect"
          height={40} width={200} />
      </Link>
      {/* Sidebar content here */}
      <ul className="menu w-full grow space-y-3 pt-10">
        {navItems.map((link) => (
          <li key={link.label}>
            <NavLink
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `${isActive ? "is-drawer-open:bg-base-200 text-info" : ""} is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center gap-3`
              }
              data-tip={link.label}
            >
              <span className="mb-1 mr-1 inline-block size-4">{link.icon}</span>
              <span className="is-drawer-close:hidden font-semibold">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      {/* USER PROFILE */}
      <div className="dropdown dropdown-top dropdown-hover border border-base-300 bg-base-200 w-full">
        <div tabIndex={0} role="button" className="flex items-center gap-3 p1-1 m-1">
          <img src={authenticatedUser?.image} alt="profileImg" height={43} width={43} />
          <h6 className="is-drawer-close:hidden capitalize">{authenticatedUser?.fullName}</h6>
        </div>
        <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          <li className="disabled capitalize font-bold"><a>{authenticatedUser?.fullName}</a></li>
          <li onClick={handleLogout}><a>Logout <LogOutIcon size = {11} /></a></li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
