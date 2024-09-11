import React, { useEffect, useRef, useState } from 'react';
import './Login.css';
import assets from '../../assets/assets';
import { signup, login, resetPass } from '../../config/firebase';
import { FaEnvelope, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';

const Login = () => {
  const [currState, setCurrState] = useState('Sign up');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const audioRefFuture = useRef(null);
  const audioRefChat = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Retrieve stored data
    const savedUserName = localStorage.getItem('userName') || '';
    const savedEmail = localStorage.getItem('email') || '';
    const savedPassword = localStorage.getItem('password') || '';

    // Set state with saved data
    setUserName(savedUserName);
    setEmail(savedEmail);
    setPassword(savedPassword);

    // Audio and video playback
    const fadeOutAudio = (audioElement, duration) => {
      if (!audioElement) return;

      const initialVolume = audioElement.volume;
      const fadeDuration = duration * 1000;
      const fadeInterval = 50;
      const volumeStep = initialVolume / (fadeDuration / fadeInterval);
      let currentVolume = initialVolume;

      const fadeOut = setInterval(() => {
        if (currentVolume > 0) {
          currentVolume = Math.max(0, currentVolume - volumeStep);
          audioElement.volume = currentVolume;
        } else {
          clearInterval(fadeOut);
          audioElement.pause();
        }
      }, fadeInterval);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const playAudio = async () => {
      try {
        if (audioRefFuture.current && audioRefChat.current) {
          audioRefFuture.current.volume = 0.6;
          audioRefChat.current.volume = 1.0;

          await Promise.all([
            audioRefFuture.current.play(),
            audioRefChat.current.play()
          ]);
          handlePlay();
        }
      } catch (error) {
        console.log('Audio playback failed:', error);
      }
    };

    const startPlayback = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.log('Video playback failed:', error);
        }
      }
      await playAudio();
    };

    const hasPlayed = localStorage.getItem('loginAudioPlayed');
    if (!hasPlayed) {
      startPlayback();
      localStorage.setItem('loginAudioPlayed', 'true');
    }

    const audioFuture = audioRefFuture.current;
    const audioChat = audioRefChat.current;

    if (audioFuture) {
      audioFuture.addEventListener('ended', handleEnded);
      audioFuture.addEventListener('timeupdate', () => {
        if (audioFuture.currentTime > audioFuture.duration - 10) {
          fadeOutAudio(audioFuture, 10);
        }
      });
    }

    if (audioChat) {
      audioChat.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audioFuture) {
        audioFuture.removeEventListener('ended', handleEnded);
        audioFuture.removeEventListener('timeupdate', () => {
          if (audioFuture.currentTime > audioFuture.duration - 10) {
            fadeOutAudio(audioFuture, 10);
          }
        });
      }
      if (audioChat) {
        audioChat.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currState === 'Sign up') {
      signup(userName, email, password);
    } else {
      login(email, password);
    }
  };

  const handleInputChange = (setter) => (event) => {
    const { value, name } = event.target;
    setter(value);
    localStorage.setItem(name, value);
  };

  return (
    <div className='login'>
      <video className="background-video" ref={videoRef} autoPlay loop muted>
        <source src={assets.Supra} type="video/mp4" />
      </video>
      <audio ref={audioRefFuture} src={assets.future} />
      <audio ref={audioRefChat} src={assets.chat} />
      <form onSubmit={onSubmitHandler} className='login-form'>
        <h2>{currState}</h2>
        {currState === 'Sign up' && (
          <div className="input-container">
            <input
              name='userName'
              onChange={handleInputChange(setUserName)}
              value={userName}
              className='form-input'
              type='text'
              placeholder='Username'
              required
            />
            <FaUser className="icon" />
          </div>
        )}
        <div className="input-container">
          <input
            name='email'
            onChange={handleInputChange(setEmail)}
            value={email}
            className='form-input'
            type='email'
            placeholder='Email address'
            required
          />
          <FaEnvelope className="icon" />
        </div>
        <div className="input-container password-container">
          <input
            name='password'
            onChange={handleInputChange(setPassword)}
            value={password}
            className='form-input'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            required
          />
          <button
            type="button"
            className="eye-button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              top: '52%',
              right: '0px',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              color: '#ffffff44',
              fontSize: '16px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff44'}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <button type='submit'>
          {currState === 'Sign up' ? 'Create account' : 'Login now'}
        </button>
        <div className='login-term'>
          <input type='checkbox' />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className='login-forgot'>
          {currState === 'Sign up' ? (
            <p className='login-toggle'>
              Already have an account?{' '}
              <span onClick={() => setCurrState('Login')}>Login here</span>
            </p>
          ) : (
            <p className='login-toggle'>
              Create an account{' '}
              <span onClick={() => setCurrState('Sign up')}>Click here</span>
            </p>
          )}
          {currState === 'Login' && (
            <p className='login-toggle'>
              Forgot Password?{' '}
              <span onClick={() => resetPass(email)}>Click here</span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
