import 'remixicon/fonts/remixicon.css';
// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
// At the top of your Nav.tsx
import type { FC } from 'react';
import {
  SignInButton,
  UserButton,
  SignedIn as SignedInComponent,
  SignedOut as SignedOutComponent,
} from '@clerk/clerk-react';

const SignedIn = SignedInComponent as FC<{ children?: React.ReactNode }>;
const SignedOut = SignedOutComponent as FC<{ children?: React.ReactNode }>;

interface NavProps {
  handleComponentChange: (component: string) => void;
}

function Nav({ handleComponentChange }: NavProps) {
  return (
    <nav>
      <div id="nav-parent">
        <h1>EazyCart</h1>
        <h2>&copy;</h2>
        <h3>Makes Easy</h3>
        <h4 onClick={() => handleComponentChange('home')}>Home</h4>
        <h4 onClick={() => handleComponentChange('cart')}>Cart</h4>
        <input type="text" placeholder="Search for items, brands and grocery" />
        <h4 onClick={() => handleComponentChange('about')}>About</h4>
        <h4 onClick={() => handleComponentChange('contact')}>Contact Us</h4>

        {/* Auth Controls */}
        <SignedOut>
          <SignInButton mode="modal">
            <i
              className="ri-login-circle-fill"
              style={{ cursor: 'pointer' }}
              title="Login"
            ></i>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}

export default Nav;
