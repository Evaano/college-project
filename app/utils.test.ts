import { expect, test } from "vitest";
import { z } from "zod";

import { validateEmail } from "./utils";

test("validateEmail returns false for non-emails", () => {
  expect(validateEmail(undefined)).toBe(false);
  expect(validateEmail(null)).toBe(false);
  expect(validateEmail("")).toBe(false);
  expect(validateEmail("not-an-email")).toBe(false);
  expect(validateEmail("n@")).toBe(false);
});

test("validateEmail returns true for emails", () => {
  expect(validateEmail("kody@example.com")).toBe(true);
});

// Add event details schema
const EventAddSchema = z.object({
  id: z.string().optional(),
  image: z.string().url(),
  name: z.string().min(1, "Event name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  start: z.string().datetime(),
  end: z.string().datetime(),
  category: z.string(),
  featured: z.preprocess((val) => val === "true", z.boolean()).default(false),
});

// Edit event details schema
const EventEditSchema = z.object({
  id: z.string(),
  image: z.string().url().optional(),
  name: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  category: z.string().optional(),
  featured: z.preprocess((val) => val === "true", z.boolean()).default(false),
});

test("addSchema should validate correct data", () => {
  const data = {
    id: "123",
    image: "https://example.com/image.png",
    name: "Event Name",
    location: "Event Location",
    description: "Event Description",
    start: "2024-08-15T00:00:00.000Z",
    end: "2024-08-15T01:00:00.000Z",
    category: "Category",
    featured: "true",
  };
  expect(EventAddSchema.safeParse(data).success).toBe(true);
});

test("addSchema should invalidate incorrect data", () => {
  const data = {
    id: "123",
    image: "not-a-url",
    name: "",
    location: "",
    description: "",
    start: "not-a-date",
    end: "not-a-date",
    category: "",
    featured: "not-a-boolean",
  };
  const result = EventAddSchema.safeParse(data);
  expect(result.success).toBe(false);
});

test("editSchema should validate correct data", () => {
  const data = {
    id: "123",
    image: "https://example.com/image.png",
    name: "Event Name",
    location: "Event Location",
    description: "Event Description",
    start: "2024-08-15T00:00:00.000Z",
    end: "2024-08-15T01:00:00.000Z",
    category: "Category",
    featured: "true",
  };
  expect(EventEditSchema.safeParse(data).success).toBe(true);
});

test("editSchema should invalidate incorrect data", () => {
  const data = {
    id: "",
    image: "not-a-url",
    name: "",
    location: "",
    description: "",
    start: "not-a-date",
    end: "not-a-date",
    category: "",
    featured: "not-a-boolean",
  };
  const result = EventEditSchema.safeParse(data);
  expect(result.success).toBe(false);
});

// User management schema
const userSchema = z.object({
  id: z.string(),
  email: z.string().optional(),
  role: z.string().optional(),
  vendor: z.string().optional(),
});

// Test the userSchema for valid data
test("userSchema should validate correct data", () => {
  const data = {
    id: "123",
    email: "test@example.com",
    role: "admin",
    vendor: "vendorName",
  };
  expect(userSchema.safeParse(data).success).toBe(true);
});

test("userSchema should validate correct data with optional fields missing", () => {
  const data = {
    id: "123",
  };
  expect(userSchema.safeParse(data).success).toBe(true);
});

// Test the userSchema for invalid data
test("userSchema should invalidate incorrect data", () => {
  const data = {
    id: "",
    email: "not-an-email",
    role: 123,
    vendor: null,
  };
  const result = userSchema.safeParse(data);
  expect(result.success).toBe(false);
});

// Vendor schema
const vendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  email: z.string().toLowerCase().min(1, "Vendor mail is required"),
  address: z.string().min(1, "Vendor address is required"),
  phone: z.coerce.string().min(1, "Phone is required"),
  description: z.string().optional(),
});

// Test the vendorSchema for valid data
test("vendorSchema should validate correct data", () => {
  const data = {
    name: "Vendor Name",
    email: "vendor@example.com",
    address: "123 Vendor St",
    phone: "123-456-7890",
    description: "A description about the vendor",
  };
  expect(vendorSchema.safeParse(data).success).toBe(true);
});

test("vendorSchema should validate correct data without optional description", () => {
  const data = {
    name: "Vendor Name",
    email: "vendor@example.com",
    address: "123 Vendor St",
    phone: "123-456-7890",
  };
  expect(vendorSchema.safeParse(data).success).toBe(true);
});

// Test the vendorSchema for invalid data
test("vendorSchema should invalidate incorrect data", () => {
  const data = {
    name: "",
    email: "",
    address: "",
    phone: "",
    description: "A description about the vendor",
  };
  const result = vendorSchema.safeParse(data);
  expect(result.success).toBe(false);
});

test("vendorSchema should invalidate data with wrong types", () => {
  const data = {
    name: 123, // name should be a string
    email: 123, // email should be a string
    address: 123, // address should be a string
    phone: 123, // phone should be coerced to string but needs min length validation
    description: 123, // description should be a string if provided
  };
  const result = vendorSchema.safeParse(data);
  expect(result.success).toBe(false);
});
