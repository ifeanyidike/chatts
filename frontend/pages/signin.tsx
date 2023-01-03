import { Inter } from '@next/font/google';
import {
  getProviders,
  signIn,
  getSession,
  getCsrfToken,
} from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import Header from '../components/Header';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

interface Provider {
  callbackUrl: string;
  id: string;
  name: string;
  email: string;
  type: string;
  signinUrl: string;
}

const SignInPage = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const providers: Provider = props.providers;
  const csrfToken: any = props.csrfToken;
  const [email, setEmail] = useState('');

  const { query } = useRouter();
  const err: string = typeof query.error !== 'string' ? '' : query.error;

  useEffect(() => {
    if (!query.error) return;
    if (typeof query.error !== 'string') return;

    const err: string = query.error;
    const message = err && (errors[err] ?? errors.default);
    enqueueSnackbar(message, {
      variant: 'info',
      autoHideDuration: 5000,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.error]);

  const handleSignIn = (
    e: React.FormEvent<HTMLFormElement>,
    provider: Provider
  ) => {
    e.preventDefault();
    if (provider.id === 'email') {
      return signIn(provider.id, { email });
    }
    return signIn(provider.id);
  };
  return (
    <div className={`signin ${inter.className}`}>
      <Header />
      <div className="signin__content">
        {Object.values(providers).map(provider => {
          return (
            <form key={provider.name} onSubmit={e => handleSignIn(e, provider)}>
              <input type="hidden" name="csrfToken" value={csrfToken} />
              {provider.id === 'email' && (
                <>
                  <label htmlFor="input-email-for-email-provider">
                    What&apos;s your email?
                  </label>
                  <input
                    className="signin__input"
                    id="input-email-for-email-provider"
                    autoFocus
                    type="email"
                    name="email"
                    placeholder="email@example.com"
                    required
                    onChange={e => setEmail(e.target.value)}
                  ></input>
                </>
              )}
              <button
                className={`signin__button signin__${provider.id}`}
                type="submit"
              >
                {provider.id === 'email' ? (
                  'Continue'
                ) : (
                  <>
                    <Image
                      src={providerIcons[provider.id]}
                      alt="provider"
                      width="15"
                      height="15"
                    />
                    Continue with {provider.name}
                  </>
                )}
              </button>
              {provider.id === 'email' && (
                <hr className="hr__content" title="or" />
              )}
            </form>
          );
        })}
        <p className="consent">
          By proceeding, you consent to the Chatts&lsquo; terms and conditions
          and privacy policies
        </p>
      </div>
    </div>
  );
};

export default SignInPage;

export async function getServerSideProps(context: any) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: '/' },
    };
  }
  return {
    props: {
      providers: await getProviders(),
      csrfToken: await getCsrfToken(),
    },
  };
}

const providerIcons: any = {
  google:
    'https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/google.svg',

  facebook:
    'https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/facebook.svg',

  github:
    'https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/github.svg',
};

const errors: any = {
  Signin: 'Try signing with a different account.',
  OAuthSignin: 'Try signing with a different account.',
  OAuthCallback: 'Try signing with a different account.',
  OAuthCreateAccount: 'Try signing with a different account.',
  EmailCreateAccount: 'Try signing with a different account.',
  Callback: 'Try signing with a different account.',
  OAuthAccountNotLinked:
    'To confirm your identity, sign in with the same account you used originally.',
  EmailSignin: 'Check your email address.',
  CredentialsSignin:
    'Sign in failed. Check the details you provided are correct.',
  default: 'Unable to sign in.',
};
