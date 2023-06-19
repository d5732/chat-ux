import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = (props: any) => {

    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const checkUserToken = () => {
        const user = localStorage.getItem('user');
        if (!user || user === 'undefined' || user === 'null') {
            console.log('navigate to signin')
            setIsLoggedIn(false);
            return navigate('/auth/signin');
        }
        setIsLoggedIn(true);
    }

    useEffect(() => {
        checkUserToken();
    }, [isLoggedIn]);

    return (
        <React.Fragment>
            {
                isLoggedIn ? props.children : null
            }
        </React.Fragment>
    );
}

export default ProtectedRoute;
