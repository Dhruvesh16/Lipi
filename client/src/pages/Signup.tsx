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
import { useState } from "react";
import { Link } from "wouter";
import { userStore } from "@/lib/userStore";

const signupSchema = z.object({
  userType: z.enum(["doctor", "patient"], { required_error: "Please select user type" }),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  specialty: z.string().optional(),
  organization: z.string().optional(),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
  medicalRecordNumber: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
  agreeToHipaa: z.boolean().refine(val => val === true, "You must agree to HIPAA authorization")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
}).refine((data) => {
  if (data.userType === "doctor") {
    return data.specialty && data.specialty.length > 0 && data.organization && data.organization.length > 1;
  }
  return true;
}, {
  message: "Specialty and organization are required for doctors",
  path: ["specialty"]
}).refine((data) => {
  if (data.userType === "patient") {
    return data.dateOfBirth && data.dateOfBirth.length > 0 && data.phone && data.phone.length > 0;
  }
  return true;
}, {
  message: "Date of birth and phone number are required for patients",
  path: ["dateOfBirth"]
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: undefined as any,
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      specialty: "",
      organization: "",
      dateOfBirth: "",
      phone: "",
      medicalRecordNumber: "",
      agreeToTerms: false,
      agreeToHipaa: false
    }
  });

  const selectedUserType = form.watch("userType");

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create user data
      const userName = `${data.firstName} ${data.lastName}`;
      const userData = {
        email: data.email,
        password: data.password,
        name: data.userType === 'doctor' ? `Dr. ${userName}` : userName,
        userType: data.userType,
        // Doctor specific fields
        ...(data.userType === 'doctor' && {
          specialty: data.specialty,
          organization: data.organization,
          license: `MD${Date.now().toString().slice(-5)}` // Generate a license number
        }),
        // Patient specific fields
        ...(data.userType === 'patient' && {
          dateOfBirth: data.dateOfBirth,
          phone: data.phone,
          medicalRecordNumber: data.medicalRecordNumber || `MRN${Date.now().toString().slice(-6)}`,
          // Calculate age from date of birth
          age: data.dateOfBirth ? new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear() : undefined,
          mrn: data.medicalRecordNumber || `MRN${Date.now().toString().slice(-6)}`
        })
      };

      // Add user to store
      const newUser = await userStore.addUser(userData);
      
      console.log('New user created:', newUser);
      
      if (!newUser) {
        setDialogMessage("An account with this email address already exists. Please use a different email or try logging in.");
        setShowErrorDialog(true);
        return;
      }
      
      if (data.userType === "doctor") {
        setDialogMessage(`Welcome, Dr. ${userName}! Your doctor account has been created successfully. You can now log in and manage patients.`);
      } else {
        setDialogMessage(`Welcome, ${userName}! Your patient account has been created successfully. You can now log in and access your medical records.`);
      }
      
      setShowSuccessDialog(true);
      form.reset();
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof Error) {
        setDialogMessage(error.message);
      } else {
        setDialogMessage("Failed to create account. Please try again.");
      }
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  const { formState: { errors } } = form;

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

      <div className="w-full max-w-md relative z-10">
        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-blue-300 hover:text-white hover:bg-white/5 backdrop-blur-sm transition-all duration-300">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 ring-2 ring-white/20">
              <span className="text-white font-bold text-2xl drop-shadow-lg">L</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-indigo-300 to-sky-300 bg-clip-text text-transparent">Join Lipi</h1>
          <p className="text-gray-300 mt-1">Create your medical scribe account</p>
        </div>

        <Card className="shadow-2xl border-0 bg-gradient-to-br from-slate-900/60 to-blue-900/40 backdrop-blur-xl border border-blue-500/20 ring-1 ring-white/10">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl font-bold tracking-tight text-white">Create your account</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="userType" className="text-blue-300 font-medium">I am a</Label>
                <Controller
                  name="userType"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={`bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50 ${errors.userType ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select user type" className="text-gray-300" />
                      </SelectTrigger>
                      <SelectContent className="bg-gradient-to-br from-slate-900 to-blue-900 border-blue-400/30 text-white backdrop-blur-xl">
                        <SelectItem value="doctor" className="focus:bg-blue-800/30 focus:text-blue-300 transition-all duration-200">👨‍⚕️ Doctor</SelectItem>
                        <SelectItem value="patient" className="focus:bg-indigo-800/30 focus:text-indigo-300 transition-all duration-200">👤 Patient</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.userType && (
                  <p className="text-sm text-red-400">{errors.userType.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-blue-300 font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...form.register("firstName")}
                    className={`bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50 ${errors.firstName ? "border-red-500" : ""}`}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-400">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-blue-300 font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...form.register("lastName")}
                    className={`bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50 ${errors.lastName ? "border-red-500" : ""}`}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-400">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-300 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...form.register("email")}
                  className={`bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-300 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    {...form.register("password")}
                    className={`bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50 pr-10 ${errors.password ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-blue-600/20 text-gray-300 hover:text-blue-300 transition-all duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-blue-300 font-medium">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...form.register("confirmPassword")}
                    className={`bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-blue-600/20 text-gray-300 hover:text-blue-300 transition-all duration-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              {selectedUserType === "doctor" && (
                <div className="space-y-4 p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 backdrop-blur-sm rounded-xl border border-blue-400/20 ring-1 ring-white/5">
                  <h3 className="font-medium text-blue-300 flex items-center space-x-2">
                    <span>👨‍⚕️</span>
                    <span>Doctor Information</span>
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="text-blue-300 font-medium">Medical Specialty</Label>
                    <Input
                      id="specialty"
                      placeholder="e.g., Cardiology, Pediatrics"
                      {...form.register("specialty")}
                      className={`bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50 ${errors.specialty ? "border-red-500" : ""}`}
                    />
                    {errors.specialty && (
                      <p className="text-sm text-red-400">{errors.specialty.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization" className="text-blue-300 font-medium">Hospital/Clinic</Label>
                    <Input
                      id="organization"
                      placeholder="e.g., City General Hospital"
                      {...form.register("organization")}
                      className={`bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50 ${errors.organization ? "border-red-500" : ""}`}
                    />
                    {errors.organization && (
                      <p className="text-sm text-red-400">{errors.organization.message}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedUserType === "patient" && (
                <div className="space-y-4 p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 backdrop-blur-sm rounded-xl border border-blue-400/20 ring-1 ring-white/5">
                  <h3 className="font-medium text-blue-300 flex items-center space-x-2">
                    <span>👤</span>
                    <span>Patient Information</span>
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-blue-300 font-medium">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...form.register("dateOfBirth")}
                      className={`bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50 ${errors.dateOfBirth ? "border-red-500" : ""}`}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-400">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-blue-300 font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      {...form.register("phone")}
                      className={`bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50 ${errors.phone ? "border-red-500" : ""}`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-400">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalRecordNumber" className="text-blue-300 font-medium">Medical Record Number (Optional)</Label>
                    <Input
                      id="medicalRecordNumber"
                      placeholder="MRN-12345678"
                      {...form.register("medicalRecordNumber")}
                      className="bg-gradient-to-r from-slate-800/60 to-blue-900/40 border-blue-400/30 text-white placeholder:text-gray-300 focus:border-blue-400 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-300 hover:from-slate-700/70 hover:to-blue-800/50"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Separator className="border-blue-500/30" />
                
                <div className="flex items-center space-x-2">
                  <Controller
                    name="agreeToTerms"
                    control={form.control}
                    render={({ field }) => (
                      <Checkbox
                        id="agreeToTerms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={`border-blue-400/50 text-blue-400 focus:ring-blue-400/20 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-500 ${errors.agreeToTerms ? "border-red-500" : ""}`}
                      />
                    )}
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-200"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-400">{errors.agreeToTerms.message}</p>
                )}

                <div className="flex items-center space-x-2">
                  <Controller
                    name="agreeToHipaa"
                    control={form.control}
                    render={({ field }) => (
                      <Checkbox
                        id="agreeToHipaa"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={`border-blue-400/50 text-blue-400 focus:ring-blue-400/20 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-indigo-500 ${errors.agreeToHipaa ? "border-red-500" : ""}`}
                      />
                    )}
                  />
                  <label
                    htmlFor="agreeToHipaa"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-200"
                  >
                    I authorize the processing of my health information in accordance with{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline">
                      HIPAA regulations
                    </a>
                  </label>
                </div>
                {errors.agreeToHipaa && (
                  <p className="text-sm text-red-400">{errors.agreeToHipaa.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white border-0 shadow-2xl shadow-blue-500/30 font-semibold py-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/20" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </span>
                ) : (
                  "Create Account ✨"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-300">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-all duration-300 hover:scale-105">
                  Sign in ✨
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Account Created Successfully!
              </AlertDialogTitle>
              <AlertDialogDescription>
                {dialogMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => {
                setShowSuccessDialog(false);
                window.location.href = '/login';
              }}>
                Continue to Login
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Account Creation Failed
              </AlertDialogTitle>
              <AlertDialogDescription>
                {dialogMessage}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
                Try Again
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <style dangerouslySetInnerHTML={{
          __html: `
            .bg-grid-pattern {
              background-image: 
                linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
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
    </div>
  );
}
