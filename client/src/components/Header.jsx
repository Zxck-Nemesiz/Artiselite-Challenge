import { useLocation } from "react-router-dom"
import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import { navigation } from "../constants"
import { useState } from "react";
import Button from "./Button";
import MenuSvg from "../assets/MenuSvg"
import background from '../images/background.jpg'

const SideLines = () => {
    return (
      <>
        <div className="absolute top-0 left-5 w-0.25 h-full bg-n-6"></div>
        <div className="absolute top-0 right-5 w-0.25 h-full bg-n-6"></div>
      </>
    );
};

const HamburgerMenu = () => {
    return (
      <div className="absolute inset-0 pointer-events-none lg:hidden">
        <div className="absolute inset-0 opacity-[.03]">
        <img
          className="w-full h-full object-cover"
          src={background}
          width={688}
          height={953}
          alt="Background"
        />
        </div>
  
        <SideLines />
      </div>
    );
  };

const Header = () => {
    const pathname = useLocation();
    const [openNavigation, setOpenNavigation] = useState(false);

    const toggleNavigation = () => {
        if(openNavigation) {
            setOpenNavigation(false)
            enablePageScroll()
        } else {
            setOpenNavigation(true)
            disablePageScroll()
        }
    }

    const handleClick = () => {
      if(!openNavigation) return

      enablePageScroll()
        setOpenNavigation(false)
    }

  return (
    <div className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm ${openNavigation ? 'bg-n-8' : 'bg-n-8/90 backdrop-blur-sm'}`}>
        <div className="flex items-center px-5 lg:px-7 xl:px-9 max-lg:py-4">
            <a className="block w-[15rem] xl:mr-5 py-4" href="#home">
                Warehouse Management
            </a>

            <nav className={`${openNavigation ? "flex" : "hidden" } hidden fixed top-[3rem] left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex lg:mx-auto lg:bg-transparent`}>
                <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
                    {navigation.map((item) => (
                        <a key={item.id} href={item.url} onClick={handleClick}
                        className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 ${item.onlyMobile ? 'lg:hidden' : "" } px-5 py-5 md:py-6 lg:-mr-0.1 lg:text-xs lg:font-semibold ${ item.url === pathname.hash ?  'lg:text-n-1/50' : 'z-2 lg:text-n-1' } lg:leading-4 lg:hover:text-n-1 xl:px-10`}>
                            {item.title}
                        </a>
                    ))}
                    
                </div>
                <HamburgerMenu />
            </nav>

            <a href="#signup" className="button hidden mr-8 text-n-1 transition-colors hover:text-n-1 lg:block">
                New account
            </a>
            <Button className="hidden lg:flex" href="#login">
                Sign In
            </Button>

            <Button className="ml-auto lg:hidden" px="px-3" onClick={toggleNavigation}>
                <MenuSvg openNavigation={openNavigation}/>
            </Button>
        </div>
    </div>
  )
}

export default Header