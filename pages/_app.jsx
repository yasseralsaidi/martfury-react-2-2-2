import React, { useEffect } from 'react';
import { wrapper } from '~/store/store';
import { CookiesProvider } from 'react-cookie';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import MasterLayout from '~/components/layouts/MasterLayout';
import '~/public/static/fonts/Linearicons/Font/demo-files/demo.css';
import '~/public/static/fonts/font-awesome/css/font-awesome.min.css';
import '~/public/static/css/bootstrap.min.css';
import '~/public/static/css/slick.min.css';
import '~/scss/style.scss';
import '~/scss/home-default.scss';
import '~/scss/market-place-1.scss';
import '~/scss/market-place-2.scss';
import '~/scss/market-place-3.scss';
import '~/scss/market-place-4.scss';
import '~/scss/electronic.scss';
import '~/scss/furniture.scss';
import '~/scss/organic.scss';
import '~/scss/technology.scss';
import '~/scss/autopart.scss';
import '~/scss/electronic.scss';
import Head from 'next/head';



function App({ Component, pageProps }) {

     const firebaseConfig = {
              apiKey: "AIzaSyDDqagNhkHWP-S9HkIkAPAuwywhIM5_pkY",
              authDomain: "ebino-396be.firebaseapp.com",
              projectId: "ebino-396be",
              storageBucket: "ebino-396be.appspot.com",
              messagingSenderId: "352040508344",
              appId: "1:352040508344:web:2fc66d871cea827fd48d4d",
              measurementId: "G-RP8FV8CB3W"
            };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);

    useEffect(() => {
        setTimeout(function () {
            document.getElementById('__next').classList.add('loaded');
        }, 100);

        const analytics = getAnalytics(app);
    });

   

    return (
        <>
            <Head>
                <title>Ebino</title>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta name="format-detection" content="telephone=no" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="author" content="clr" />
                <meta
                    name="keywords"
                    content="Ebino, eCommerce, React, Next"
                />
                <meta
                    name="description"
                    content="Ebino"
                />
            </Head>
            <CookiesProvider>
                <MasterLayout>
                    <Component {...pageProps} db={db} auth={auth} />
                </MasterLayout>
            </CookiesProvider>
        </>
    );
}

export default wrapper.withRedux(App);
