import "../styles/globals.css"
import "../styles/ebs.scss";
import "semantic-ui-css/semantic.min.css";

import type { AppProps, AppContext } from "next/app";

import React from "react"
import App from "next/app";
import Head from "next/head";
import cookie from "cookie";
import { AuthProvider } from "../middleware/AuthProvider";
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

interface EBSAppProps extends AppProps {
    authenticated: boolean;
    token: string;
}

function EBSApp({ Component, pageProps, authenticated, token }: EBSAppProps): JSX.Element {
    return (
      <>
        <Head>
          <title>EBS Project</title>
        </Head>
        <QueryClientProvider client={queryClient}>
          <AuthProvider authenticated={authenticated} token={token}>
            <Component {...pageProps} />
          </AuthProvider>
        </QueryClientProvider>
      </>
    );
}

EBSApp.getInitialProps = async (appContext: AppContext) => {
    let token = "";
    let authenticated = false;
    const request = appContext.ctx.req;
    if (request) {
      console.log("cookie", cookie);
      const cookies = cookie.parse(request.headers.cookie || "");
      const auth_token = cookies.auth_token;
      if (auth_token) {
        token = auth_token;
      }
      authenticated = !!auth_token;
    }
  
    const appProps = await App.getInitialProps(appContext);
  
    return { ...appProps, authenticated, token };
  };
  
  export default EBSApp;