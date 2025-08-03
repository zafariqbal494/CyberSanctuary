import { z } from "zod";

export const courseSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  description: z.string().min(30, "Description must be at least 30 characters"),
  icon: z.string(),
  image_url: z.string().optional(),
  price: z.number().min(0, "Price cannot be negative"),
  lastUpdate: z.string(),
  duration: z.string(),
  specifications: z.array(z.string()).optional(),
  topics: z.array(z.string()).optional(),
});

export default courseSchema; 