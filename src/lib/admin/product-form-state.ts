export type ProductFormState = {
  formError?: string;
  fieldErrors?: Partial<Record<"name" | "description" | "price" | "categoryId", string>>;
};

export type ProductFormAction = (
  previousState: ProductFormState,
  formData: FormData,
) => Promise<ProductFormState>;
