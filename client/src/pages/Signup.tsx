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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userType">I am a</Label>
                <Controller
                  name="userType"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={errors.userType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="patient">Patient</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.userType && (
                  <p className="text-sm text-red-500">{errors.userType.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    {...form.register("firstName")}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    {...form.register("lastName")}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...form.register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    {...form.register("password")}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...form.register("confirmPassword")}
                    className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {selectedUserType === "doctor" && (
                <div className="space-y-4 p-4 bg-blue-50 dark:bg-slate-800 rounded-lg border">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100">Doctor Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Medical Specialty</Label>
                    <Input
                      id="specialty"
                      placeholder="e.g., Cardiology, Pediatrics"
                      {...form.register("specialty")}
                      className={errors.specialty ? "border-red-500" : ""}
                    />
                    {errors.specialty && (
                      <p className="text-sm text-red-500">{errors.specialty.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organization">Hospital/Clinic</Label>
                    <Input
                      id="organization"
                      placeholder="e.g., City General Hospital"
                      {...form.register("organization")}
                      className={errors.organization ? "border-red-500" : ""}
                    />
                    {errors.organization && (
                      <p className="text-sm text-red-500">{errors.organization.message}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedUserType === "patient" && (
                <div className="space-y-4 p-4 bg-green-50 dark:bg-slate-800 rounded-lg border">
                  <h3 className="font-medium text-green-900 dark:text-green-100">Patient Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...form.register("dateOfBirth")}
                      className={errors.dateOfBirth ? "border-red-500" : ""}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      {...form.register("phone")}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medicalRecordNumber">Medical Record Number (Optional)</Label>
                    <Input
                      id="medicalRecordNumber"
                      placeholder="MRN-12345678"
                      {...form.register("medicalRecordNumber")}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Separator />
                
                <div className="flex items-center space-x-2">
                  <Controller
                    name="agreeToTerms"
                    control={form.control}
                    render={({ field }) => (
                      <Checkbox
                        id="agreeToTerms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={errors.agreeToTerms ? "border-red-500" : ""}
                      />
                    )}
                  />
                  <label
                    htmlFor="agreeToTerms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
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
                        className={errors.agreeToHipaa ? "border-red-500" : ""}
                      />
                    )}
                  />
                  <label
                    htmlFor="agreeToHipaa"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I authorize the processing of my health information in accordance with{" "}
                    <a href="#" className="text-primary hover:underline">
                      HIPAA regulations
                    </a>
                  </label>
                </div>
                {errors.agreeToHipaa && (
                  <p className="text-sm text-red-500">{errors.agreeToHipaa.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
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
      </div>
    </div>
  );
}
