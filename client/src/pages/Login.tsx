import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { userStore } from "@/lib/userStore";

const loginSchema = z.object({
  userType: z.enum(["doctor", "patient"], { required_error: "Please select user type" }),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false)
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [successUserName, setSuccessUserName] = useState("");

  // Initialize userStore on component mount
  useEffect(() => {
    userStore.initialize();
  }, []);

  // Get sample users for demo credentials display
  const demoCredentials = userStore.getDemoCredentials();
  const sampleDoctors = demoCredentials.doctors;
  const samplePatients = demoCredentials.patients;

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userType: undefined as any,
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const onSubmit = async (data: LoginForm) => {
    console.log('Login attempt:', { 
      userType: data.userType,
      email: data.email,
      rememberMe: data.rememberMe 
    });
    
    setIsLoading(true);
    
    try {
      // Use userStore to authenticate (await the async function)
      const authenticatedUser = await userStore.authenticate(data.email, data.password, data.userType);
      
      if (authenticatedUser) {
        // Store user info in sessionStorage for dashboard
        sessionStorage.setItem('userType', authenticatedUser.userType);
        sessionStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success dialog
        setSuccessUserName(authenticatedUser.name);
        setShowSuccessDialog(true);
      } else {
        // Authentication failed - show error dialog
        setDialogMessage(
          `Invalid ${data.userType === "doctor" ? "doctor" : "patient"} credentials. Please check your email and password and try again.`
        );
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setDialogMessage("An unexpected error occurred during login. Please try again later.");
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/dashboard");
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // todo: remove mock functionality - integrate with Google OAuth
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // todo: remove mock functionality - navigate to password reset
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-slate-900/20"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-20 animate-[grid-move_20s_ease-in-out_infinite]"></div>
      
      {/* Enhanced floating particles */}
      <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-indigo-500/15 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-500/25 to-blue-500/20 rounded-full blur-3xl animate-[float_15s_ease-in-out_infinite_reverse]"></div>
      <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-r from-sky-500/15 to-blue-500/10 rounded-full blur-2xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-xl animate-[float_12s_ease-in-out_infinite]"></div>
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-sm text-blue-300 hover:text-white transition-all duration-300 backdrop-blur-sm hover:bg-white/5 px-3 py-2 rounded-lg" data-testid="link-back-home">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 ring-2 ring-white/20">
              <span className="text-white font-bold text-2xl drop-shadow-lg">L</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-indigo-300 to-sky-300 bg-clip-text text-transparent">Welcome back to Lipi</h1>
          <p className="text-gray-300 mt-2">Sign in to your medical scribe platform</p>
        </div>

        <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900/60 to-blue-900/40 backdrop-blur-xl border border-blue-500/20 ring-1 ring-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-white text-xl">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Enter your credentials to access your dashboard
            </CardDescription>
            
            {/* Demo Credentials */}
            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 backdrop-blur-sm p-4 rounded-xl text-xs space-y-3 border border-blue-400/20 ring-1 ring-white/5">
              <p className="font-medium text-center text-blue-300 text-sm">✨ Demo Credentials:</p>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-blue-900/20 p-2 rounded-lg border border-blue-400/20">
                  <p className="font-medium text-blue-300">👨‍⚕️ Doctor:</p>
                  <p className="text-gray-200 text-xs">Email: {demoCredentials.doctors[0]?.email}</p>
                  <p className="text-gray-200 text-xs">Password: doctor123</p>
                </div>
                <div className="bg-indigo-900/20 p-2 rounded-lg border border-indigo-400/20">
                  <p className="font-medium text-indigo-300">👤 Patient:</p>
                  <p className="text-gray-200 text-xs">Email: {demoCredentials.patients[0]?.email}</p>
                  <p className="text-gray-200 text-xs">Password: patient123</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <Button 
              variant="outline" 
              className="w-full bg-gradient-to-r from-slate-800/60 to-blue-800/60 border-blue-400/30 hover:from-slate-700/70 hover:to-blue-700/70 text-white backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20" 
              onClick={handleGoogleLogin}
              data-testid="button-google-login"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-blue-500/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gradient-to-r from-slate-900 to-blue-900 px-3 py-1 rounded-full text-blue-300 font-medium">Or continue with email</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-300 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  {...form.register("email")}
                  data-testid="input-email"
                  className="bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-400" data-testid="error-email">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-300 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...form.register("password")}
                    data-testid="input-password"
                    className="bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm pr-10 transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-blue-600/20 text-gray-300 hover:text-blue-300 transition-all duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-400" data-testid="error-password">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* User Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="userType" className="text-blue-300 font-medium">I am a</Label>
                <Controller
                  name="userType"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger data-testid="select-user-type" className="bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50">
                        <SelectValue placeholder="Select user type" className="text-gray-300" />
                      </SelectTrigger>
                      <SelectContent className="bg-gradient-to-br from-slate-900 to-blue-900 border-blue-400/30 text-white backdrop-blur-xl">
                        <SelectItem value="doctor" className="focus:bg-blue-800/30 focus:text-blue-300 transition-all duration-200">👨‍⚕️ Doctor / Healthcare Provider</SelectItem>
                        <SelectItem value="patient" className="focus:bg-indigo-800/30 focus:text-indigo-300 transition-all duration-200">👤 Patient</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.userType && (
                  <p className="text-sm text-red-400" data-testid="error-user-type">
                    {form.formState.errors.userType.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={form.watch("rememberMe")}
                    onCheckedChange={(checked) => form.setValue("rememberMe", !!checked)}
                    data-testid="checkbox-remember"
                    className="border-blue-400/50 text-blue-400 focus:ring-blue-400/20 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-200 font-medium">Remember me</Label>
                </div>
                <button
                  type="button"
                  className="px-0 font-medium text-blue-400 hover:text-blue-300 hover:underline bg-transparent border-none cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={handleForgotPassword}
                  data-testid="button-forgot-password"
                >
                  Forgot password?
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white border-0 shadow-2xl shadow-blue-500/30 font-semibold py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/20" 
                disabled={isLoading}
                data-testid="button-sign-in"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </span>
                ) : (
                  "Sign In ✨"
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-gray-300">Don't have an account? </span>
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-all duration-300 hover:scale-105" data-testid="link-sign-up">
                Sign up ✨
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-sm bg-gradient-to-r from-blue-900/20 to-indigo-900/20 backdrop-blur-sm p-4 rounded-xl border border-blue-400/20 ring-1 ring-white/5">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
            <p className="text-blue-300 font-medium">🔒 Your data is encrypted and HIPAA compliant</p>
          </div>
          <p className="text-gray-300">We use industry-standard security to protect your medical information</p>
        </div>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="bg-slate-900 border border-green-500/20 backdrop-blur-xl">
          <AlertDialogHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <AlertDialogTitle className="text-white">Login Successful!</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-gray-300">
              Welcome back, {successUserName}! You have been successfully logged in.
              Redirecting you to your dashboard...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={handleSuccessDialogClose}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white border-0"
            >
              Continue to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent className="bg-slate-900 border border-red-500/20 backdrop-blur-xl">
          <AlertDialogHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <AlertDialogTitle className="text-white">Login Failed</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-gray-300">
              {dialogMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowErrorDialog(false)}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-0"
            >
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style dangerouslySetInnerHTML={{
        __html: `
          .bg-grid-pattern {
            background-image: 
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79, 70, 229, 0.1) 1px, transparent 1px);
            background-size: 60px 60px;
          }
          
          @keyframes grid-move {
            0% { transform: translate(0, 0); }
            100% { transform: translate(60px, 60px); }
          }
          
          @keyframes float {
            0%, 100% { 
              transform: translateY(0px) rotate(0deg) scale(1); 
              opacity: 0.7;
            }
            50% { 
              transform: translateY(-30px) rotate(180deg) scale(1.1); 
              opacity: 1;
            }
          }
          
          @keyframes pulse-slow {
            0%, 100% { 
              opacity: 0.4; 
              transform: scale(1);
            }
            50% { 
              opacity: 0.9; 
              transform: scale(1.05);
            }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          .shimmer {
            background: linear-gradient(110deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%);
            background-size: 200% 100%;
            animation: shimmer 3s infinite;
          }
        `
      }} />
    </div>
  );
}