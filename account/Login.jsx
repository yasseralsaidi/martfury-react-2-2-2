import React, { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { login } from '../../../store/auth/action';
import { doc, collection, getCountFromServer, getDocs, getDoc, query, where, or } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import bcrypt from 'bcryptjs';
import { Form, Input, notification } from 'antd';
import { connect } from 'react-redux';

const Login = ({db, auth}) => {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [validation, setValidation] = useState("");
    const coll = collection(db, 'users');



    const handleLoginSubmit = async () => {
         setValidation("");
        const userQuery = query(coll, or(where("lowername", "==", userName.toLowerCase()), where("email", "==", userName.toLowerCase())));
        const userSnapshot = await getDocs(userQuery);
        if(userSnapshot.docs.length > 0){
        const docRef = doc(db, 'users', String(userSnapshot.docs[0].id));
        const docSnap = await getDoc(docRef);
        const compare = await bcrypt.compare(password, docSnap.data().password);
            if(compare){
            await signInWithEmailAndPassword(auth, docSnap.data().email, docSnap.data().password)
              .then((userCredential) => {
                console.log('signed in');
                login();
                Router.push('/');
              })
              .catch((error) => {
               console.log('error with sign in');
              });

            }else{
                setValidation("Wrong Password");
            }
        }else{
            setValidation("User/Email Does Not Exist");
        }
    }

        return (
            <div className="ps-my-account">
                <div className="container">
                    <Form
                        className="ps-form--account">
                        <ul className="ps-tab-list">
                            <li className="active">
                                <Link href="/account/login">
                                    <a>Login</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/account/register">
                                    <a>Register</a>
                                </Link>
                            </li>
                        </ul>
                        <div className="ps-tab active" id="sign-in">
                            <div className="ps-form__content">
                                <h5>Log In Your Account</h5>
                                <div className="form-group">
                                    <Form.Item
                                        name="email/user"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your email/username!',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="Username or email address"
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group form-forgot">
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your password!',
                                            },
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="password"
                                            placeholder="Password..."
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <div className="ps-checkbox">
                                        <input
                                            className="form-control"
                                            type="checkbox"
                                            id="remember-me"
                                            name="remember-me"
                                        />
                                        <label htmlFor="remember-me">
                                            Rememeber me
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group submit">
                                    <button
                                        onClick={() => handleLoginSubmit()}
                                        type="submit"
                                        className="ps-btn ps-btn--fullwidth">
                                        Login
                                    </button>
                                </div>
                            </div>
                            <div className="ps-form__footer" style={{textAlign: 'center'}}>
                            <p style={{color: 'red'}}>{validation}</p>
                               {/* <p>Connect with:</p>
                                <ul className="ps-list--social">
                                    <li>
                                        <a
                                            className="facebook"
                                            href="#"
                                            onClick={e =>
                                                this.handleFeatureWillUpdate(e)
                                            }>
                                            <i className="fa fa-facebook"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="google"
                                            href="#"
                                            onClick={e =>
                                                this.handleFeatureWillUpdate(e)
                                            }>
                                            <i className="fa fa-google-plus"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="twitter"
                                            href="#"
                                            onClick={e =>
                                                this.handleFeatureWillUpdate(e)
                                            }>
                                            <i className="fa fa-twitter"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            className="instagram"
                                            href="#"
                                            onClick={e =>
                                                this.handleFeatureWillUpdate(e)
                                            }>
                                            <i className="fa fa-instagram"></i>
                                        </a>
                                    </li>
                                </ul>*/}
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        );
}
const mapStateToProps = state => {
    return state.auth;
};
export default connect(mapStateToProps)(Login);
