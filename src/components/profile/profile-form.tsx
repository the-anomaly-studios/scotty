"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";

import { updateProfile } from "@/app/profile/actions";
import type { ProfileFormValues } from "@/app/profile/actions";
import type { Profile } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillsInput } from "@/components/profile/skills-input";
import { HeadshotUploader } from "@/components/profile/headshot-uploader";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  graduation_year: z
    .number({ error: "Required" })
    .int()
    .min(1998, "Must be 1998 or later")
    .max(new Date().getFullYear() + 2),
  linkedin_url: z.string().url("Must be a valid URL").min(1, "Required"),
  bio: z.string().max(500).optional().nullable(),
  role: z.string().max(100).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  personal_email: z.string().email("Must be a valid email").optional().nullable().or(z.literal("")),
  website: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  instagram: z.string().max(60).optional().nullable(),
  x: z.string().max(60).optional().nullable(),
  bluesky: z.string().max(60).optional().nullable(),
  tiktok: z.string().max(60).optional().nullable(),
  skills: z.array(z.string()),
  is_mentorship_open: z.boolean(),
  is_featured_eligible: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function ProfileForm({
  profile,
  submitAction,
}: {
  profile: Profile;
  // Injected by admin edit page; defaults to the user's own updateProfile.
  submitAction?: (values: ProfileFormValues) => Promise<{ error?: string } | void>;
}) {
  const [headshotUrl, setHeadshotUrl] = useState(profile.headshot_url);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.name ?? "",
      graduation_year: profile.graduation_year ?? undefined,
      linkedin_url: profile.linkedin_url ?? "",
      bio: profile.bio ?? "",
      role: profile.role ?? "",
      company: profile.company ?? "",
      location: profile.location ?? "",
      personal_email: profile.personal_email ?? "",
      website: profile.website ?? "",
      instagram: profile.instagram ?? "",
      x: profile.x ?? "",
      bluesky: profile.bluesky ?? "",
      tiktok: profile.tiktok ?? "",
      skills: profile.skills ?? [],
      is_mentorship_open: profile.is_mentorship_open,
      is_featured_eligible: profile.is_featured_eligible,
    },
  });

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = form;

  async function onSubmit(values: FormValues) {
    const action = submitAction ?? updateProfile;
    const result = await action(values);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile saved");
    }
  }

  const requiredMissing = !headshotUrl;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
      {/* Headshot */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl font-normal">Photo</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <HeadshotUploader
            currentUrl={headshotUrl}
            onUpload={(url) => setHeadshotUrl(url)}
          />
        </CardContent>
      </Card>

      {/* Required info */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl font-normal">
            Basic info <span className="text-destructive">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name <span className="text-destructive">*</span></Label>
            <Input id="name" {...register("name")} placeholder="Jane Smith" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="graduation_year">Graduation year <span className="text-destructive">*</span></Label>
            <Input
              id="graduation_year"
              type="number"
              min={1998}
              max={new Date().getFullYear() + 2}
              {...register("graduation_year", { valueAsNumber: true })}
              placeholder="2022"
            />
            {errors.graduation_year && <p className="text-xs text-destructive">{errors.graduation_year.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="linkedin_url">LinkedIn URL <span className="text-destructive">*</span></Label>
            <Input id="linkedin_url" {...register("linkedin_url")} placeholder="https://linkedin.com/in/yourname" />
            {errors.linkedin_url && <p className="text-xs text-destructive">{errors.linkedin_url.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...register("bio")}
              placeholder="A short description of what you're working on or interested in…"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {watch("bio")?.length ?? 0} / 500
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current role */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl font-normal">Current role</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="role">Title</Label>
              <Input id="role" {...register("role")} placeholder="Product Designer" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...register("company")} placeholder="Acme Corp" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} placeholder="San Francisco, CA" />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl font-normal">Skills & focus areas</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillsInput
            value={watch("skills")}
            onChange={(skills) => setValue("skills", skills)}
          />
          <p className="text-xs text-muted-foreground mt-2">Press Enter or comma to add a skill</p>
        </CardContent>
      </Card>

      {/* Social links */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl font-normal">Links & contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="personal_email">Personal email</Label>
            <Input id="personal_email" type="email" {...register("personal_email")} placeholder="jane@example.com" />
            {errors.personal_email && <p className="text-xs text-destructive">{errors.personal_email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="website">Personal website</Label>
            <Input id="website" {...register("website")} placeholder="https://yoursite.com" />
            {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" {...register("instagram")} placeholder="@handle" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="x">X (Twitter)</Label>
              <Input id="x" {...register("x")} placeholder="@handle" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bluesky">Bluesky</Label>
              <Input id="bluesky" {...register("bluesky")} placeholder="@handle.bsky.social" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tiktok">TikTok</Label>
              <Input id="tiktok" {...register("tiktok")} placeholder="@handle" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl font-normal">Community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_mentorship_open" className="text-sm font-medium">Open to mentorship</Label>
              <p className="text-xs text-muted-foreground">Allow fellow alumni to send you mentorship requests</p>
            </div>
            <Switch
              id="is_mentorship_open"
              checked={watch("is_mentorship_open")}
              onCheckedChange={(v) => setValue("is_mentorship_open", v)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_featured_eligible" className="text-sm font-medium">Featured on home page</Label>
              <p className="text-xs text-muted-foreground">Opt in to appear in the weekly featured alumni rotation</p>
            </div>
            <Switch
              id="is_featured_eligible"
              checked={watch("is_featured_eligible")}
              onCheckedChange={(v) => setValue("is_featured_eligible", v)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pb-8">
        {requiredMissing && (
          <p className="text-sm text-muted-foreground">Upload a headshot to complete your required fields</p>
        )}
        <div className="ml-auto">
          <Button type="submit" disabled={isSubmitting || requiredMissing} size="lg">
            {isSubmitting ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </div>
    </form>
  );
}
