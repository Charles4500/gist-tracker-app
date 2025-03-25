"use client";

import { useEffect, useState } from "react";
import { User, Save, Trash2 } from "lucide-react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export const ProfileForm = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    bio: "", //to change to bio
    image: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();
  // Sync form with session when it loads
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        bio: session.user.email || "", // Changed from email to bio
        image: session.user.image || "",
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate
      if (!formData?.name?.trim()) {
        throw new Error("Name is required");
      }

      const response = await fetch("api/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success(data.message);
      setIsEditing(false);
    } catch (err) {
      setError((err as Error).message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("api/auth/delete", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);
      toast.success(data.message);
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      console.error("Error :", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <SessionProvider>
      <Card className="w-full max-w-2xl mx-auto glass-card animate-scale-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Your Profile</CardTitle>
          <CardDescription>
            View and update your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center mb-6">
            <Avatar className="h-24 w-24 border-2 border-muted">
              <AvatarImage
                src={session?.user?.image || undefined}
                alt={session?.user?.name || ""}
              />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="text-2xl font-medium">{session?.user?.name}</h3>
              <p className="text-muted-foreground">{session?.user?.email}</p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                readOnly={!isEditing}
                disabled={isLoading}
                className={
                  !isEditing
                    ? "bg-muted cursor-not-allowed"
                    : "bg-background/50"
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself"
                value={formData.bio}
                onChange={handleChange}
                readOnly={!isEditing}
                disabled={isLoading}
                className={
                  !isEditing
                    ? "bg-muted cursor-not-allowed resize-none"
                    : "bg-background/50 resize-none"
                }
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                placeholder="https://example.com/avatar.jpg"
                value={formData.image}
                onChange={handleChange}
                readOnly={!isEditing}
                disabled={isLoading}
                className={
                  !isEditing
                    ? "bg-muted cursor-not-allowed"
                    : "bg-background/50"
                }
              />
              <p className="text-xs text-muted-foreground">
                Enter a URL for your profile image
              </p>
            </div>

            <div className="flex justify-between pt-4">
              {isEditing ? (
                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-pulse mr-2">●</span>
                        Saving...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Save className="mr-2 h-4 w-4" />
                        Save changes
                      </span>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        name: session?.user?.name || "",
                        bio: session?.user?.email || "",
                        image: session?.user?.image || "",
                      });
                    }}
                    disabled={isLoading || isEditing}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                >
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    type="button"
                    className="hover:bg-red-300"
                  >
                    <Trash2 className="mr-2 h-4 w-4 " />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="animate-scale-in">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove all of your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </SessionProvider>
  );
};
