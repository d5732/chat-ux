import { useState, useEffect, FormEvent } from 'react'
import { auth, authenticateWithEmail } from '../firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { Container, Form, FormLabel, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useAuthState } from 'react-firebase-hooks/auth';


const Signin = () => {

    const [userInfo, setUserInfo] = useState(null);
    // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    //     webClientId: ''
    // });
    const [user] = useAuthState(auth);
    const [useremail, setUseremail] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [validated, setValidated] = useState(false);
    const [initialError, setInitialError] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();
    const [infoMsg, setInfoMsg] = useState('');
    const [authenticatedUser, setAuthenticatedUser] = useState(null);

    const handleCredentialResponse = (response: any) => {
        try {
            const { credential } = response;
            const user: any = jwt_decode(credential);
            window.localStorage.setItem('user', JSON.stringify(user));
            window.localStorage.setItem('accessToken', credential);
            navigate('/doctor-lookup');
        } catch(error: any) {
            console.log('Error authenticating with Google: ', error);
        }
        
    };

    const handleLogin = async (event: FormEvent) => {
        const form = event.currentTarget as HTMLFormElement;
        console.log(form.checkValidity());
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(false);
            return;
        }

        setValidated(true);
        setLoading(true);
        
        const isLoginLinkSent = await authenticateWithEmail(useremail);
        if (!isLoginLinkSent) {
            setLoginError("Something went wrong. Please try again later.");
            window.localStorage.removeItem('emailForSignIn');
        } else {
            setInfoMsg('Please check your email for the login link.');
            setLoginError('');
            window.localStorage.setItem('emailForSignIn', useremail);
        }
        setLoading(false);
    };

    useEffect(() => {
        if(user || authenticatedUser) {
            window.localStorage.setItem('user', JSON.stringify(user));
            navigate('/doctor-lookup');
        }

        /* global google */
        const googleAccounts = (window as any).google.accounts;
        googleAccounts.id.initialize({
            client_id: import.meta.env.VITE_G_CLIENT_ID || '',
            callback: handleCredentialResponse,
        });

        googleAccounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { size: 'large', width: '400px', 'align-content': 'center', backgroundColor: '#E5E7EB' }
        );

        if(isSignInWithEmailLink(auth, window.location.href)){
            let email = localStorage.getItem('emailForSignIn');
            if (email) {
                setLoading(true);
                signInWithEmailLink(auth, email, window.location.href)
                .then((result)=>{
                    window.localStorage.setItem('user', JSON.stringify(result.user));
                    setLoading(false);
                    setInitialError('');
                    navigate('/doctor-lookup');
                }).catch((err)=>{
                    setLoading(false);
                    setInitialError(err.message);
                })
            }
        }
    },[]);

    return (
        <Container className='w-full p-0'>
            { isLoading ? (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>) :
            (
                <div className='w-full flex flex-col content-center'>
                    <div className="mb-4 pt-3 w-[400px]">
                        <p className='text-left p-2'>Our AI chat bot will help you find the nearest doctor based on your symptoms. Signin with your Google account or email id. </p>
                    </div>
                    <div id='google-signin-button' className='w-[400px]'></div>

                    <p className="content-around text-center py-4 text-sm">Or, Signin with your email</p>

                    <Form className="form-signin" noValidate validated={validated} onSubmit={handleLogin}>
                        <div className="relative">
                            <Form.Group controlId="emailValidation">
                                <Form.Control
                                    type="email"
                                    className="peer h-10 w-full placeholder-transparent focus:outline-none bg-transparent ring-blue ring-2 rounded-md"
                                    placeholder="Email address"
                                    required
                                    name="useremail"
                                    value={useremail}
                                    onChange={(event) => setUseremail(event.target.value)}
                                />
                                <FormLabel className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-200 dark:bg-gray-200 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"> Email address </FormLabel>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid email.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Sign In</button>
                        </div>
                        {loginError!==''&&(
                            <div className='error-msg'>{loginError}</div>
                            )}
                        {infoMsg!==''&&(
                            <div className='info-msg'>{infoMsg}</div>
                            )}
                    </Form>

                </div>
            )
            }
        </Container>
    );
}

export default Signin