import React, { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';
import { getGuestMessages } from '../utils/generalUtils';
import { BASE } from '../utils/appUtil';
import { useRouter } from 'next/router';
import { IUser } from '../interfaces/channeltypes';
import { useDispatch } from 'react-redux';
import { setMessages } from '../redux/slices/message';

interface ISignInInfo {
  email?: string;
  name?: string;
}

interface AuthError {
  statusCode?: number | string;
  value?: boolean;
}

interface Props {
  widgetLocation?: string;
  setWidgetUser?: Dispatch<SetStateAction<IUser>>;
}

const GuestInfo = (props: Props) => {
  const [signInInfo, setSignInInfo] = useState<ISignInInfo>({});
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [authError, setAuthError] = useState<AuthError>({});
  const [showSignIn, setShowSignIn] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { query } = useRouter();
  const { widgetLocation, setWidgetUser } = props;

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!widgetLocation) return;
    if (!showSignIn) return setShowSignIn(true);

    const { email, name } = signInInfo;

    const allMessages = getGuestMessages({});
    const courseMessages = allMessages[widgetLocation];

    return authenticateWidgetUser(courseMessages);
  };

  const authenticateWidgetUser = async (courseMessages: any) => {
    try {
      setLoadingSignIn(true);
      const { data } = await axios.post(`${BASE}/users/widget-user`, {
        signInInfo,
        courseMessages,
        channelKey: query.key,
        title: widgetLocation,
      });
      setLoadingSignIn(false);
      if (data.user && setWidgetUser) {
        setWidgetUser(data.user);
        localStorage.setItem('widgetUser', JSON.stringify(data.user));
      }
      if (data.allMessages) {
        dispatch(setMessages(data.allMessages));
      }
    } catch (error: any) {
      if (
        error.response.status === 403 &&
        error.response.data === 'User does not exist'
      ) {
        setAuthError({
          value: true,
          statusCode: 403,
        });
      }
    } finally {
      setLoadingSignIn(false);
    }
  };
  return (
    <div className=" messages__info__guests ">
      <h3>You are interacting as a guest</h3>
      <p>Your conversation will not be persisted until you log in.</p>
      <div className="signin">
        <div className="signin__content">
          <form onSubmit={handleSignIn}>
            {showSignIn && (
              <>
                <input
                  className="signin__input"
                  id="input-email-for-email-provider"
                  autoFocus
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  required
                  onChange={e =>
                    setSignInInfo({
                      ...signInInfo,
                      email: e.target.value,
                    })
                  }
                />
                {authError.value && (
                  <input
                    className="signin__input"
                    type="name"
                    name="name"
                    placeholder="Jose Sammy"
                    required
                    onChange={e =>
                      setSignInInfo({
                        ...signInInfo,
                        name: e.target.value,
                      })
                    }
                  />
                )}
              </>
            )}
            <button className={`signin__button signin__email}`} type="submit">
              {loadingSignIn ? (
                <div className="ripple embedded__loader"></div>
              ) : showSignIn ? (
                'Continue'
              ) : (
                'Sign in '
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestInfo;
