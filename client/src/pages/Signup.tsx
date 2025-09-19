import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  specialty: z.string().min(1, "Please select your specialty"),
  organization: z.string().min(2, "Organization name is required"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
  agreeToHipaa: z.boolean().refine(val => val === true, "You must agree to HIPAA compliance")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      specialty: "",
      organization: "",
      agreeToTerms: false,
      agreeToHipaa: false
    }
  });

  const onSubmit = async (data: SignupForm) => {
    console.log('Signup attempt:', { 
      email: data.email, 
      name: `${data.firstName} ${data.lastName}`,
      specialty: data.specialty,
      organization: data.organization
    });
    setIsLoading(true);
    
    try {
      // todo: remove mock functionality - integrate with authentication system
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      navigate("/dashboard");
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
    // todo: remove mock functionality - integrate with Google OAuth
  };

  const specialties = [
    "Family Medicine",
    "Internal Medicine", 
    "Pediatrics",
    "Emergency Medicine",
    "Cardiology",
    "Dermatology",
    "Orthopedic Surgery",
    "Psychiatry",
    "Radiology",
    "Anesthesiology",
    "Ophthalmology",
    "Other"
  ];

  const passwordStrength = form.watch("password");
  const getPasswordStrength = () => {
    if (!passwordStrength) return { strength: 0, text: "", color: "" };
    
    let score = 0;
    if (passwordStrength.length >= 8) score++;
    if (/[A-Z]/.test(passwordStrength)) score++;
    if (/[a-z]/.test(passwordStrength)) score++;
    if (/[0-9]/.test(passwordStrength)) score++;
    if (/[^A-Za-z0-9]/.test(passwordStrength)) score++;

    switch (score) {
      case 0:
      case 1: return { strength: 20, text: "Very Weak", color: "bg-red-500" };
      case 2: return { strength: 40, text: "Weak", color: "bg-orange-500" };
      case 3: return { strength: 60, text: "Fair", color: "bg-yellow-500" };
      case 4: return { strength: 80, text: "Good", color: "bg-blue-500" };
      case 5: return { strength: 100, text: "Strong", color: "bg-green-500" };
      default: return { strength: 0, text: "", color: "" };
    }
  };

  const passwordCheck = getPasswordStrength();

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

      <div className="w-full max-w-lg space-y-6">
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
          <h1 className="text-2xl font-bold">Join Lipi</h1>
          <p className="text-muted-foreground">Create your medical scribe account</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center">Create Account</CardTitle>
            <CardDescription className="text-center">
              Start your free trial and transform your practice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign Up */}
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleSignup}
              data-testid="button-google-signup"
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

            {/* Signup Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...form.register("firstName")}
                    data-testid="input-first-name"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-destructive" data-testid="error-first-name">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Smith"
                    {...form.register("lastName")}
                    data-testid="input-last-name"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-destructive" data-testid="error-last-name">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
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

              {/* Professional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Controller
                    name="specialty"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger data-testid="select-specialty">
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty} value={specialty}>
                              {specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.specialty && (
                    <p className="text-sm text-destructive" data-testid="error-specialty">
                      {form.formState.errors.specialty.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    placeholder="City General Hospital"
                    {...form.register("organization")}
                    data-testid="input-organization"
                  />
                  {form.formState.errors.organization && (
                    <p className="text-sm text-destructive" data-testid="error-organization">
                      {form.formState.errors.organization.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
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
                {passwordStrength && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${passwordCheck.color}`}
                          style={{ width: `${passwordCheck.strength}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground" data-testid="text-password-strength">
                        {passwordCheck.text}
                      </span>
                    </div>
                  </div>
                )}
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive" data-testid="error-password">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...form.register("confirmPassword")}
                    data-testid="input-confirm-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    data-testid="button-toggle-confirm-password"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-destructive" data-testid="error-confirm-password">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Agreements */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={form.watch("agreeToTerms")}
                    onCheckedChange={(checked) => form.setValue("agreeToTerms", !!checked)}
                    data-testid="checkbox-terms"
                  />
                  <Label htmlFor="terms" className="text-sm leading-none">
                    I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </Label>
                </div>
                {form.formState.errors.agreeToTerms && (
                  <p className="text-sm text-destructive ml-6" data-testid="error-terms">
                    {form.formState.errors.agreeToTerms.message}
                  </p>
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="hipaa"
                    checked={form.watch("agreeToHipaa")}
                    onCheckedChange={(checked) => form.setValue("agreeToHipaa", !!checked)}
                    data-testid="checkbox-hipaa"
                  />
                  <Label htmlFor="hipaa" className="text-sm leading-none">
                    I acknowledge and agree to <Link href="/hipaa" className="text-primary hover:underline">HIPAA compliance requirements</Link> for handling protected health information
                  </Label>
                </div>
                {form.formState.errors.agreeToHipaa && (
                  <p className="text-sm text-destructive ml-6" data-testid="error-hipaa">
                    {form.formState.errors.agreeToHipaa.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-create-account"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline" data-testid="link-sign-in">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Trial Notice */}
        <div className="text-center text-xs text-muted-foreground bg-primary/5 p-4 rounded-lg border border-primary/10">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-4 h-4 text-primary mr-2" />
            <span className="font-medium text-primary">14-day free trial</span>
          </div>
          <p>No credit card required • Cancel anytime</p>
          <p>Full access to all features during your trial period</p>
        </div>
      </div>
    </div>
  );
}