"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { postJob, type JobFormValues } from "@/app/jobs/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  company: z.string().min(1, "Company is required").max(200),
  location: z.string().min(1, "Location is required").max(200),
  work_type: z.enum(["remote", "hybrid", "onsite"], { error: "Select a work type" }),
  employment_type: z.enum(["full-time", "part-time", "contract", "internship"], {
    error: "Select an employment type",
  }),
  description: z.string().min(1, "Description is required").max(5000),
  application_url: z.string().url("Must be a valid URL"),
});

export function PostJobForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: JobFormValues) {
    setServerError(null);
    const result = await postJob(values);
    if (result?.error) setServerError(result.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <p className="text-sm text-destructive">{serverError}</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Job title" error={errors.title?.message}>
          <Input placeholder="e.g. UX Researcher" {...register("title")} />
        </Field>
        <Field label="Company" error={errors.company?.message}>
          <Input placeholder="e.g. Acme Corp" {...register("company")} />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Field label="Location" error={errors.location?.message}>
          <Input placeholder="e.g. Pittsburgh, PA" {...register("location")} />
        </Field>
        <Field label="Work type" error={errors.work_type?.message}>
          <select
            {...register("work_type")}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Select…</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </Field>
        <Field label="Employment type" error={errors.employment_type?.message}>
          <select
            {...register("employment_type")}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Select…</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </Field>
      </div>

      <Field label="Description" error={errors.description?.message}>
        <Textarea
          placeholder="Describe the role, responsibilities, and what you're looking for…"
          rows={6}
          {...register("description")}
        />
      </Field>

      <Field label="Application URL" error={errors.application_url?.message}>
        <Input
          type="url"
          placeholder="https://example.com/apply"
          {...register("application_url")}
        />
      </Field>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting…" : "Post job"}
        </Button>
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
