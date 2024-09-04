import { Link} from "react-router-dom";

const Nav = () => {

    return (
        <div>
            <img 
                // src="https://static01.nyt.com/images/2021/03/03/us/03xp-amazon-logo/oakImage-1614794068335-articleLarge.jpg?quality=75&auto=webp&disable=upscale" 
                src="https://hamarilaado.org/media/website/Hamari-Laado-2.png" 
                className="logo" 
                alt="not found" 
            />

      
                <>
                    <ul className="nav-ul">
                        <li><Link to='/'>Home</Link></li>
                        <li><Link to='/reg'>Register</Link></li>
                        <li><Link to='/payment'>Payment</Link></li>
                        <li><Link to='/payment-list'>Payment Logs</Link></li>
                        <li><Link to='/user-list'>All Users </Link></li>
                    </ul>
                </>
           
        </div>
    );
};

export default Nav;
