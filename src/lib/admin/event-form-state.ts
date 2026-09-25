export type EventFieldErrors = Partial<Record<"title" | "description" | "startsAt" | "endsAt" | "externalUrl" | "active", string>>;
export type EventFormState = { formError?: string; fieldErrors?: EventFieldErrors };
export type EventFormAction = (state: EventFormState, formData: FormData) => Promise<EventFormState>;
