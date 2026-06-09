import { z } from "zod";

export const listBooksQuerySchema = z.object({
  search: z.string().trim().optional(),
  availableOnly: z
    .union([z.literal("true"), z.literal("false")])
    .transform((v) => v === "true")
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const bookPayloadSchema = z.object({
  title: z.string().trim().min(1).max(255),
  author: z.string().trim().min(1).max(255),
  isbn: z.string().trim().min(10).max(20),
  publishedYear: z.number().int().min(1450).max(3000).nullable().optional(),
  totalCopies: z.number().int().min(0),
});

export const borrowPayloadSchema = z.object({
  bookId: z.number().int().positive(),
  borrowerName: z.string().trim().min(1).max(255),
  borrowerEmail: z.string().trim().email().max(255),
  dueDate: z.string().date().optional(),
});

export const loansQuerySchema = z.object({
  status: z.enum(["ACTIVE", "RETURNED"]).optional(),
  overdueOnly: z
    .union([z.literal("true"), z.literal("false")])
    .transform((v) => v === "true")
    .optional(),
});
