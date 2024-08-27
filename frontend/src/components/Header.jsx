import { Button, Navbar, TextInput } from "flowbite-react"
import { FaMoon, FaSun } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { AiOutlineSearch } from "react-icons/ai";

const Header = () => {
   const path = useLocation().pathname
   const {theme} = useSelector(state => state.theme)
   const dispatch = useDispatch()
  return (
    <Navbar className="border-b-2 sticky top-0 bg-slate-200 shadow-md z-40">
      <Link to='/' className="self-center whitespace-nowrap text-sm sm:text-xl font-bold dark:text-white">
         <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg">Shop</span>Ito
      </Link>
      <form>
         <TextInput type="text" placeholder="Search..." rightIcon={AiOutlineSearch} className="hidden lg:inline" />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
         <AiOutlineSearch/>
      </Button>
      <div className="flex gap-2 md:order-2">
         <Button className="w-12 h-10 hidden sm:inline" color="gray" pill onClick={() => dispatch(toggleTheme())}>
            {theme === 'light' ? <FaSun/> : <FaMoon/>}
         </Button>
         <Link to='/signIn'>
            <Button gradientDuoTone='purpleToBlue' outline>
               SignIn
            </Button>
         </Link>
         <Navbar.Toggle className="text-sm" />
      </div>
      <Navbar.Collapse>
         <Navbar.Link active={path === "/"} as={'div'}>
            <Link to="/" >Home</Link>
         </Navbar.Link>
         <Navbar.Link active={path === "/about"} as={'div'}>
            <Link to="/about" >About Us</Link>
         </Navbar.Link>
         <Navbar.Link active={path === "/contact"} as={'div'}>
            <Link to="/contact" >Contact Us</Link>
         </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header