import React, { useState } from 'react';
import Logo from '@/components/ui/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast({
          title: 'Success',
          description: 'Account created successfully. Redirecting...',
        });
      } else {
        await signIn(email, password);
        toast({
          title: 'Success',
          description: 'Signed in successfully. Redirecting...',
        });
      }
      navigate('/sessions');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Authentication failed.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-joip-darker p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo showText={true} className="scale-125" />
        </div>
        
        <Card className="bg-joip-card border-joip-border">
          <CardHeader>
            <CardTitle>{isSignUp ? 'Create an account' : 'Sign in'}</CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Enter your details to create a new account' 
                : 'Enter your credentials to access your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input 
                  type="password" 
                  id="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full btn-primary">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-4 text-center text-sm">
          <p className="text-muted-foreground">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-joip-yellow hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
