export type CategoryFormState = {
  formError?: string;
  fieldErrors?: Partial<Record<"name" | "slug", string>>;
};

export type CategoryFormAction = (
  previousState: CategoryFormState,
  formData: FormData,
) => Promise<CategoryFormState>;
