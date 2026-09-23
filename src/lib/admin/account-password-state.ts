export type AccountPasswordState = {
  formError?: string;
  success?: string;
  fieldErrors?: Partial<
    Record<"currentPassword" | "newPassword" | "confirmPassword", string>
  >;
};
