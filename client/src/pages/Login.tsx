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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-back-home">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">L</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">Welcome back to Lipi</h1>
          <p className="text-muted-foreground">Sign in to your medical scribe platform</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
            
            {/* Demo Credentials */}
            <div className="bg-muted/50 p-3 rounded-lg text-xs space-y-2">
              <p className="font-medium text-center">Demo Credentials:</p>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <p className="font-medium">Doctor:</p>
                  <p>Email: {sampleDoctors[0]?.email || "sarah.johnson@hospital.com"}</p>
                  <p>Password: doctor123</p>
                </div>
                <div>
                  <p className="font-medium">Patient:</p>
                  <p>Email: {samplePatients[0]?.email || "john.smith@email.com"}</p>
                  <p>Password: patient123</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <Button 
              variant="outline" 
              className="w-full" 
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
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="doctor@hospital.com"
                  {...form.register("email")}
                  data-testid="input-email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive" data-testid="error-email">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...form.register("password")}
                    data-testid="input-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive" data-testid="error-password">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* User Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="userType">I am a</Label>
                <Controller
                  name="userType"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger data-testid="select-user-type">
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">Doctor / Healthcare Provider</SelectItem>
                        <SelectItem value="patient">Patient</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.userType && (
                  <p className="text-sm text-destructive" data-testid="error-user-type">
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
                  />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <button
                  type="button"
                  className="px-0 font-normal text-primary hover:underline bg-transparent border-none cursor-pointer"
                  onClick={handleForgotPassword}
                  data-testid="button-forgot-password"
                >
                  Forgot password?
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-sign-in"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/signup" className="text-primary hover:underline" data-testid="link-sign-up">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg">
          <p>🔒 Your data is encrypted and HIPAA compliant</p>
          <p>We use industry-standard security to protect your medical information</p>
        </div>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <AlertDialogTitle>Login Successful!</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Welcome back, {successUserName}! You have been successfully logged in.
              Redirecting you to your dashboard...
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={handleSuccessDialogClose}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <AlertDialogTitle>Login Failed</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {dialogMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowErrorDialog(false)}
              className="bg-red-600 hover:bg-red-700"
            >
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}