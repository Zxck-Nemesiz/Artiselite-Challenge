import Button from "./Button"
import Section from "./Section"
import background from "../images/6195005.jpg"

const Home = ({ onSignUpOpen }) => {
  return (
    <Section
     className='pt-[10rem] -mt-[4] flex items-center justify-center relative'
     id='home'
    >
        <div className="container relative z-10 text-center">
            <div className="relative z-1 max-w-[60rem] mx-auto text-center mb-[3rem] md:mb-15 lg:mb-[5rem]">
                <h1 className="h1 mb-5">
                    One-stop for all of your management needs
                </h1>
                <p className="body-1 max-w-2xl mx-auto mv-6 text-n-2 lg:mb-6">Want to do all your management needs all in one place? Come join us!</p>
                <Button onClick={onSignUpOpen} white>
                    Sign Up
                </Button>
            </div>
            <div className="absolute -top-[50%] left-1/2 w-[200%] -translate-x-1/2 md:-top-[50%] md:w-[150%] lg:-top-[100%] z-0">
                <img src={background}
                className="w-full h-full object-cover"
                width={1440}
                height={1800}
                alt="background" />
            </div>
        </div>
     </Section>
  )
}

export default Home