import Head from 'next/head';

import { Header } from '../components/Header';

import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { theme } from '../theme';

import '../styles/globals.scss';
import 'macro-css';
import { wrapper } from "../redux/store";
import {AppProps} from "next/app";
import {parseCookies} from "nookies";
import {UserApi} from "../utils/api/user";
import {setUserData} from "../redux/slices/user";

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>RJournal</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400;1,500;1,700;1,900&display=swap"
                    rel="stylesheet" />
            </Head>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Header />
                <Component {...pageProps} />
            </MuiThemeProvider>
        </>
    );
}

App.getInitialProps = wrapper.getInitialAppProps(
    (store) => async ({
        ctx, Component
    }) => {
    try {
        const {authToken} = parseCookies(ctx)
        const userData = await UserApi.getMe(authToken)
        store.dispatch(setUserData(userData))
    } catch (err) {
        console.log(err)
    }
    return {pageProps: {
        ...(Component.getInitialProps ? await Component.getInitialProps({...ctx, store}): {})
    }}
})

export default wrapper.withRedux(App);
