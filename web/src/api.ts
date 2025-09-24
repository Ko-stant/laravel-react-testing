import axios from "axios";
import type { Contact, Paginated } from "./types";

const API_BASE = "/api";

// Fetches a paginated list of contacts from the API.
// Accepts page and perPage parameters for pagination.
export async function listContacts(
  page = 1,
  perPage = 10
): Promise<Paginated<Contact>> {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  const response = await axios.get<Paginated<Contact>>(
    `${API_BASE}/contacts?${params.toString()}`
  );

  return response.data;
}

// Creates a new contact via the API.
export async function createContact(data: Omit<Contact, "id" | "created_at" | "updated_at">) {
  const response = await axios.post<Contact>(`${API_BASE}/contacts`, data);
  return response.data;
}

// Updates an existing contact by ID via the API.
export async function updateContact(
  id: number,
  data: Partial<Omit<Contact, "id">>
) {
  const response = await axios.put<Contact>(`${API_BASE}/contacts/${id}`, data);
  return response.data;
}

// Deletes a contact by ID via the API.
export async function deleteContact(id: number) {
  const response = await axios.delete<void>(`${API_BASE}/contacts/${id}`);
  return response.data;
}
