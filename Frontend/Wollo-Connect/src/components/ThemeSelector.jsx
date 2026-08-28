import { PaletteIcon } from "lucide-react"
import { THEMES } from "../constants/index";
import { useEffect, useState } from "react";

function ThemeSelector() {
  const [theme, setTheme] = useState('cupcake');

  useEffect(()=>{
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="dropdown dropdown-bottom dropdown-end">
  <div tabIndex={0} role="button" className="btn btn-circle m-1">
    <PaletteIcon size = {19} />
    </div>

    <div className="dropdown-content menu bg-base-100 rounded-box z-50 mb-2 w-52 p-2 shadow-sm">

    <ul className="menu max-h-80 w-full overflow-y-auto flex-nowrap">
    {THEMES.map((t)=>(
      <li key={t.name}>
      <button onClick={()=>setTheme(t.name)} className={`flex items-center justify-between ${theme === t.name ? 'active' : ''}`}>
        <span>{t.label}</span>
        <div className="flex gap-1">
    {t.colors.map((color) => (
      <span
        key={color}
        className="size-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    ))}
  </div>
        </button></li>
    ))}
    </ul>
  </div>
    </div>
  )
}

export default ThemeSelector
