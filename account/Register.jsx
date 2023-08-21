import React, { Component, useState } from 'react';
import { doc, setDoc, collection, getCountFromServer, getDocs, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from 'next/link';
import Router from 'next/router';
import { login } from '../../../store/auth/action';
import bcrypt from 'bcryptjs';
import { Form, Input } from 'antd';
import { connect } from 'react-redux';

const Register = ({db, auth}) => {

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userLength, setUserLength] = useState(0);
    const [emailLength, setEmailLength] = useState(0);
    const salt = bcrypt.genSaltSync(10);
    const coll = collection(db, 'users');

    const validateStates = {
        userName: userName,
        email: email,
        password: password
    };

    const validateEmail = {
        email: email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    }

    const statesValid = !Object.values(validateStates).some(item => item.length < 3);
    const emailValid = !Object.values(validateEmail).some(item => item === null);

    const handleSubmit = async () => {
        const snapshot = await getCountFromServer(coll);
        const userId = snapshot.data().count;
        const userQuery = query(coll, where("lowername", "==", userName.toLowerCase()));
        const userSnapshot = await getDocs(userQuery);
        const emailQuery = query(coll, where("email", "==", email.toLowerCase())); 
        const emailSnapshot = await getDocs(emailQuery);
         const snapshotValues = {
            emailQuery: emailSnapshot.docs.length,
            userQuery: userSnapshot.docs.length
        }
        const available = !Object.values(snapshotValues).every(item => item > 0);

        if(statesValid && emailValid && available){
              createUserWithEmailAndPassword(auth, email.toLowerCase(), bcrypt.hashSync(password, salt)).then((userCredential) =>{
                console.log('user created successfully');
              }).catch((error) => {
                console.log('error with sign up');
              });
              await setDoc(doc(db, 'users', String(userId)), {
                username: userName,
                email: email.toLowerCase(),
                password:   bcrypt.hashSync(password, salt),
                lowername: userName.toLowerCase(),
                userId: userId
               });
        }else{
               
        }
    };

    const checkName = async (user) => {
         const userQuery = query(coll, where("lowername", "==", user.toLowerCase()));
         const userSnapshot = await getDocs(userQuery);
         return userSnapshot.docs.length;
    }

    const checkEmail = async (emailAddress) => {
        const emailQuery = query(coll, where("email", "==", emailAddress.toLowerCase()));
        const emailSnapshot = await getDocs(emailQuery);
        return emailSnapshot.docs.length;
    }

        return (
            <div className="ps-my-account">
                <div className="container">
                    <Form
                        className="ps-form--account">
                        <ul className="ps-tab-list">
                            <li>
                                <Link href="/account/login">
                                    <a>Login</a>
                                </Link>
                            </li>
                            <li className="active">
                                <Link href="/account/register">
                                    <a>Register</a>
                                </Link>
                            </li>
                        </ul>
                        <div className="ps-tab active" id="register">
                            <div className="ps-form__content">
                                <h5>Register An Account</h5>
                                <div className="form-group">
                                    <Form.Item
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your username!',
                                            },
                                            ({ getFieldValue }) => ({
                                                async validator(rule, value){
                                                    if(value.length < 3){
                                                        return Promise.reject("Username Must Be Greater Than 2 Characters");
                                                    }else if(await checkName(value) > 0){
                                                        return Promise.reject("Username Not Available");
                                                    }else{
                                                        return Promise.resolve();
                                                    }
                                                }
                                            })
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="text"
                                            placeholder="Username"
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Please input your email!',
                                            },
                                             ({ getFieldValue }) => ({
                                                async validator(rule, value){
                                                    if(value.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) === null){
                                                        return Promise.reject("Email Must Be Valid");
                                                    }else if(await checkEmail(value) > 0){
                                                        return Promise.reject("Email Not Available");
                                                    }else{
                                                        return Promise.resolve();
                                                    }
                                                }
                                            })
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="email"
                                            placeholder="Email address"
                                            onChange={(e) => setEmail(e.target.value)}
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
                                            ({ getFieldValue }) => ({
                                                validator(rule, value){
                                                    if(value.length < 3){
                                                        return Promise.reject("Password Must Be Greater Than 2 Characters");
                                                    }
                                                }
                                            })
                                        ]}>
                                        <Input
                                            className="form-control"
                                            type="password"
                                            placeholder="Password..."
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group submit">
                                    <button
                                        onClick={() => handleSubmit()}
                                        type="submit"
                                        className="ps-btn ps-btn--fullwidth">
                                        Register
                                    </button>
                                </div>
                            </div>
                            <div className="ps-form__footer" style={{textAlign: 'center'}}>
                            {/*    <p>Connect with:</p>
                                <ul className="ps-list--social">
                                    <li>
                                        <a className="facebook" href="#">
                                            <i className="fa fa-facebook"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="google" href="#">
                                            <i className="fa fa-google-plus"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="twitter" href="#">
                                            <i className="fa fa-twitter"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="instagram" href="#">
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
export default connect(mapStateToProps)(Register);
