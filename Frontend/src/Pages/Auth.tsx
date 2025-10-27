import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Signin from '../Components/signin/signin';
import Signup from '../Components/signup/signup';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode') || 'signin';
  const [mode, setMode] = useState<'signin' | 'signup'>(modeParam === 'signup' ? 'signup' : 'signin');

  useEffect(() => {
    setMode(modeParam === 'signup' ? 'signup' : 'signin');
  }, [modeParam]);

  // runtime validation: make sure imported components are defined
  if (typeof Signin === 'undefined') {
    console.error('Auth page: Signin component is undefined', Signin);
    throw new Error('Auth page: Signin component is undefined. Check the import/export in src/Components/signin/signin.tsx');
  }
  if (typeof Signup === 'undefined') {
    console.error('Auth page: Signup component is undefined', Signup);
    throw new Error('Auth page: Signup component is undefined. Check the import/export in src/Components/signup/signup.tsx');
  }

  return (
    <div>
      {mode === 'signin' ? <Signin /> : <Signup />}
    </div>
  );
};

export default Auth;
