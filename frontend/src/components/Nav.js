import { Link} from "react-router-dom";
import logo from '../resources/HL_logo.png';


const Nav = () => {

    return (
        <div>
            <a href="https://hamarilaado.org/">
            <img 
                // src="https://static01.nyt.com/images/2021/03/03/us/03xp-amazon-logo/oakImage-1614794068335-articleLarge.jpg?quality=75&auto=webp&disable=upscale" 
                src={logo}
                className="logo" 
                alt="not found" 
            /></a>

      
                <>
                    <ul className="nav-ul">
                    </ul>
                </>
           
        </div>
    );
};

export default Nav;
